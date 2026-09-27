"""Scheduler entry point — asyncio loop that runs jobs on a schedule.

Run with: python -m app.jobs.scheduler

Each job is protected by a Postgres advisory lock so two instances
never run the same job at the same time.
"""
from __future__ import annotations

import asyncio
import logging
import os
import signal
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import text

from app.core.config import get_settings

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")

_stop_event = asyncio.Event()


def _handle_signal(*args):
    logger.info("Shutdown signal received")
    _stop_event.set()


async def _acquire_advisory_lock(conn, lock_id: int) -> bool:
    """Try to acquire a Postgres advisory lock. Returns True if acquired."""
    result = await conn.execute(text(f"SELECT pg_try_advisory_lock({lock_id})"))
    row = result.fetchone()
    return bool(row[0])


async def _release_advisory_lock(conn, lock_id: int) -> None:
    await conn.execute(text(f"SELECT pg_advisory_unlock({lock_id})"))


async def _run_job_with_lock(
    session_factory,
    lock_id: int,
    job_name: str,
    job_coro,
) -> None:
    """Runs a job coroutine, guarded by an advisory lock."""
    async with session_factory() as session:
        raw_conn = await session.connection()
        acquired = await _acquire_advisory_lock(raw_conn, lock_id)
        if not acquired:
            logger.info(f"[scheduler] Job '{job_name}' already running elsewhere, skipping.")
            return
        try:
            logger.info(f"[scheduler] Starting job: {job_name}")
            await job_coro(session)
            logger.info(f"[scheduler] Finished job: {job_name}")
        except Exception as exc:
            logger.exception(f"[scheduler] Job '{job_name}' failed: {exc}")
        finally:
            await _release_advisory_lock(raw_conn, lock_id)


# Job registry: (lock_id, name, interval_seconds, coroutine_factory)
def _build_job_registry(settings):
    jobs = []

    # Catalog sync
    if True:  # always enabled
        from app.jobs.sync_catalog import run_sync_catalog
        jobs.append((1001, "sync_catalog", settings.SYNC_CATALOG_HOURS * 3600, run_sync_catalog))

    # Delisting check
    if True:
        from app.jobs.check_delisting import run_check_delisting
        jobs.append((1002, "check_delisting", settings.DELIST_CHECK_HOURS * 3600, run_check_delisting))

    # Offer sync (only if impact_feed source is enabled)
    sources = [s.strip() for s in settings.OFFER_SOURCES.split(",")]
    if "impact_feed" in sources:
        from app.jobs.sync_offers import run_sync_offers
        jobs.append((1003, "sync_offers", settings.SYNC_OFFERS_MINUTES * 60, lambda s: run_sync_offers(s, source="impact_feed")))

    # Expiry sweep
    if True:
        from app.jobs.reverify import run_reverify
        jobs.append((1004, "reverify", settings.REVERIFY_MINUTES * 60, run_reverify))

    return jobs


async def run_scheduler() -> None:
    settings = get_settings()
    if not settings.SCHEDULER_ENABLED:
        logger.info("[scheduler] SCHEDULER_ENABLED=false, exiting.")
        return

    engine = create_async_engine(settings.DATABASE_URL, pool_size=3)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    job_registry = _build_job_registry(settings)
    job_last_run: dict[str, float] = {}

    logger.info(f"[scheduler] Starting with {len(job_registry)} jobs.")

    while not _stop_event.is_set():
        now = asyncio.get_event_loop().time()
        for lock_id, name, interval, coro_factory in job_registry:
            last = job_last_run.get(name, 0.0)
            if now - last >= interval:
                job_last_run[name] = now
                asyncio.create_task(
                    _run_job_with_lock(session_factory, lock_id, name, coro_factory)
                )

        try:
            await asyncio.wait_for(_stop_event.wait(), timeout=30)
        except asyncio.TimeoutError:
            pass  # Normal — check jobs again

    await engine.dispose()
    logger.info("[scheduler] Stopped.")


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        try:
            loop.add_signal_handler(sig, _handle_signal)
        except NotImplementedError:
            pass  # Windows doesn't support all signals
    loop.run_until_complete(run_scheduler())
