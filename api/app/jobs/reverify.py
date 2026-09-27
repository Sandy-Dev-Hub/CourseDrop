"""Expiry reverify sweep job — Phase 3 implementation."""
from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession


async def run_reverify(session: AsyncSession) -> None:
    """Re-verify active offers. Implemented in Phase 3."""
    pass
