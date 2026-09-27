"""Offer sync job — fetches offers from configured sources and ingests them."""
from __future__ import annotations

import logging
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.clock import get_clock
from app.core.config import get_settings
from app.models.models import SyncRun
from app.services.offer_ingester import OfferIngester
from app.services.offer_sources.impact_feed import ImpactFeedOfferSource

logger = logging.getLogger(__name__)


async def run_sync_offers(session: AsyncSession, *, source: str = "impact_feed") -> None:
    """Run offer sync for a specific source."""
    clock_now = get_clock().now()

    sync_run = SyncRun(
        job_name=f"sync_offers_{source}",
        status="running",
        started_at=clock_now,
    )
    session.add(sync_run)
    await session.flush()

    try:
        items = []
        if source == "impact_feed":
            feed_source = ImpactFeedOfferSource()
            items = await feed_source.fetch_offers()
        else:
            logger.warning(f"[sync_offers] Unknown offer source: {source}")

        ingester = OfferIngester(session, clock_now=clock_now)
        stats = await ingester.ingest_items(items)

        sync_run.status = "success"
        sync_run.finished_at = get_clock().now()
        sync_run.rows_processed = stats["processed"]
        await session.commit()
        logger.info(f"[sync_offers] Complete: {stats}")

    except Exception as exc:
        logger.exception(f"[sync_offers] Error syncing offers from '{source}': {exc}")
        sync_run.status = "failed"
        sync_run.finished_at = get_clock().now()
        sync_run.error_message = str(exc)
        await session.commit()
        raise
