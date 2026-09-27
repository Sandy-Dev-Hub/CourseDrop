"""Retention purge job — purges old sync runs and click logs beyond retention threshold."""
from __future__ import annotations

import logging
from datetime import timedelta

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.clock import get_clock
from app.models.models import ClickEvent, SyncRun

logger = logging.getLogger(__name__)

# Default retention periods
SYNC_RUN_RETENTION_DAYS = 30
CLICK_LOG_RETENTION_DAYS = 90


async def run_purge(session: AsyncSession) -> None:
    """Purge old sync_runs and click_events beyond retention period."""
    clock_now = get_clock().now()
    sync_cutoff = clock_now - timedelta(days=SYNC_RUN_RETENTION_DAYS)
    click_cutoff = clock_now - timedelta(days=CLICK_LOG_RETENTION_DAYS)

    logger.info(f"[purge] Purging sync runs older than {sync_cutoff}")
    res1 = await session.execute(
        delete(SyncRun).where(SyncRun.started_at < sync_cutoff)
    )

    logger.info(f"[purge] Purging click events older than {click_cutoff}")
    res2 = await session.execute(
        delete(ClickEvent).where(ClickEvent.clicked_at < click_cutoff)
    )

    await session.commit()
    logger.info("[purge] Purge complete.")
