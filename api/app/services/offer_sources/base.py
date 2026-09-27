"""Base offer source dataclass and protocol."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import Protocol


@dataclass
class RawOfferItem:
    """Standardized raw offer item extracted from any source."""
    source_name: str
    source_item_id: str | None
    course_slug: str | None
    course_title: str | None
    course_url: str | None
    offer_type: str  # PERCENTAGE, FIXED_AMOUNT, FREE_ACCESS, COUPON, etc.
    headline: str
    description: str | None
    coupon_code: str | None
    tracking_url: str
    original_price: Decimal | None = None
    discounted_price: Decimal | None = None
    discount_percentage: float | None = None
    currency: str = "USD"
    valid_from: datetime | None = None
    valid_to: datetime | None = None
    raw_payload: dict | None = None


class BaseOfferSource(Protocol):
    """Protocol for fetching/generating raw offer items."""
    async def fetch_offers(self) -> list[RawOfferItem]:
        ...
