"""Delisting check job — Phase 2 implementation."""
from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession


async def run_check_delisting(session: AsyncSession) -> None:
    """Check for delisted courses. Implemented in Phase 2."""
    pass
