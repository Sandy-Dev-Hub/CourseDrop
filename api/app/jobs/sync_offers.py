"""Offer sync job — Phase 3 implementation."""
from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession


async def run_sync_offers(session: AsyncSession, *, source: str = "impact_feed") -> None:
    """Sync offers from source. Implemented in Phase 3."""
    pass
