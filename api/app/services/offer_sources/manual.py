"""Manual and seed offer source."""
from __future__ import annotations

from app.services.offer_sources.base import RawOfferItem


class ManualOfferSource:
    """In-memory or admin supplied offer items."""

    def __init__(self, items: list[RawOfferItem] | None = None) -> None:
        self._items = items or []

    async def fetch_offers(self) -> list[RawOfferItem]:
        return self._items
