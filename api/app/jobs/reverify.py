"""Expiry and schedule reverification sweep job."""
from __future__ import annotations

import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.clock import get_clock
from app.models.models import Offer, SyncRun
from app.services.audit import AuditService

logger = logging.getLogger(__name__)


async def run_reverify(session: AsyncSession) -> None:
    """Sweep offers: activate scheduled offers whose start time arrived, expire past offers."""
    clock_now = get_clock().now()
    audit = AuditService(db=session, clock_now=clock_now)

    sync_run = SyncRun(
        job_name="reverify",
        status="running",
        started_at=clock_now,
    )
    session.add(sync_run)
    await session.flush()

    activated = 0
    expired = 0

    try:
        # 1. Activate scheduled offers whose valid_from <= clock_now
        sched_res = await session.execute(
            select(Offer).where(
                Offer.status == "SCHEDULED",
                Offer.valid_from <= clock_now,
            )
        )
        for offer in sched_res.scalars().all():
            if offer.valid_to and offer.valid_to <= clock_now:
                # Started in past and already expired
                offer.status = "EXPIRED"
                offer.updated_at = clock_now
                await audit.log(
                    entity_type="offer",
                    entity_id=offer.id,
                    offer_id=offer.id,
                    event_type="offer_expired",
                    old_status="SCHEDULED",
                    new_status="EXPIRED",
                )
                expired += 1
            else:
                offer.status = "ACTIVE"
                offer.updated_at = clock_now
                await audit.log(
                    entity_type="offer",
                    entity_id=offer.id,
                    offer_id=offer.id,
                    event_type="offer_activated",
                    old_status="SCHEDULED",
                    new_status="ACTIVE",
                )
                activated += 1

        # 2. Expire active offers whose valid_to <= clock_now
        active_res = await session.execute(
            select(Offer).where(
                Offer.status == "ACTIVE",
                Offer.valid_to != None,
                Offer.valid_to <= clock_now,
            )
        )
        for offer in active_res.scalars().all():
            offer.status = "EXPIRED"
            offer.updated_at = clock_now
            await audit.log(
                entity_type="offer",
                entity_id=offer.id,
                offer_id=offer.id,
                event_type="offer_expired",
                old_status="ACTIVE",
                new_status="EXPIRED",
            )
            expired += 1

        sync_run.status = "success"
        sync_run.finished_at = get_clock().now()
        sync_run.rows_processed = activated + expired
        await session.commit()
        logger.info(f"[reverify] Complete. Activated: {activated}, Expired: {expired}")

    except Exception as exc:
        logger.exception(f"[reverify] Error: {exc}")
        sync_run.status = "failed"
        sync_run.finished_at = get_clock().now()
        sync_run.error_message = str(exc)
        await session.commit()
        raise
