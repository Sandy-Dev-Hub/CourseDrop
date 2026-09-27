"""Catalog sync job — Phase 2 implementation."""
from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession


async def run_sync_catalog(session: AsyncSession) -> None:
    """Sync Coursera catalog. Implemented in Phase 2."""
    pass
