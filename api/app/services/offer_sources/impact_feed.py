"""Impact Radius feed source parser."""
from __future__ import annotations

import csv
import io
import json
import logging
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from typing import Any

import httpx

from app.core.config import get_settings
from app.services.offer_sources.base import RawOfferItem

logger = logging.getLogger(__name__)


def _parse_iso_or_none(val: str | None) -> datetime | None:
    if not val or not val.strip():
        return None
    val = val.strip()
    try:
        dt = datetime.fromisoformat(val.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except ValueError:
        pass
    # Try common alternative formats
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y"):
        try:
            dt = datetime.strptime(val, fmt)
            return dt.replace(tzinfo=timezone.utc)
        except ValueError:
            pass
    logger.warning(f"Could not parse date string: '{val}'")
    return None


def _parse_decimal_or_none(val: Any) -> Decimal | None:
    if val is None:
        return None
    val_str = str(val).replace("$", "").replace(",", "").strip()
    if not val_str:
        return None
    try:
        return Decimal(val_str)
    except InvalidOperation:
        return None


def parse_impact_feed_payload(data: list[dict[str, Any]]) -> list[RawOfferItem]:
    """Parse list of dict records from Impact feed into RawOfferItems."""
    items: list[RawOfferItem] = []
    for row in data:
        source_id = str(row.get("id") or row.get("deal_id") or row.get("CampaignId") or "")
        headline = str(row.get("name") or row.get("headline") or row.get("DealName") or "Special Offer").strip()
        description = row.get("description") or row.get("DealDescription") or None
        coupon_code = row.get("coupon_code") or row.get("promo_code") or row.get("PromoCode") or None
        if coupon_code:
            coupon_code = str(coupon_code).strip() or None

        tracking_url = str(row.get("tracking_url") or row.get("landing_page") or row.get("TrackingUrl") or "").strip()
        course_slug = row.get("course_slug") or row.get("slug") or None
        course_url = row.get("course_url") or row.get("landing_url") or None

        # Extract discount/price details
        orig_price = _parse_decimal_or_none(row.get("original_price") or row.get("OriginalPrice"))
        disc_price = _parse_decimal_or_none(row.get("discounted_price") or row.get("DiscountPrice"))
        
        pct_raw = row.get("discount_percentage") or row.get("DiscountPercent") or row.get("discount_percent")
        disc_pct: float | None = None
        if pct_raw is not None:
            try:
                disc_pct = float(str(pct_raw).replace("%", "").strip())
            except ValueError:
                disc_pct = None

        offer_type = str(row.get("offer_type") or row.get("DealType") or "PERCENTAGE").upper()
        if disc_pct == 100.0 or disc_price == Decimal("0"):
            offer_type = "FREE_ACCESS"

        valid_from = _parse_iso_or_none(row.get("start_date") or row.get("valid_from") or row.get("StartDate"))
        valid_to = _parse_iso_or_none(row.get("end_date") or row.get("valid_to") or row.get("EndDate"))

        items.append(
            RawOfferItem(
                source_name="impact_feed",
                source_item_id=source_id or None,
                course_slug=course_slug,
                course_title=row.get("course_title"),
                course_url=course_url,
                offer_type=offer_type,
                headline=headline,
                description=description,
                coupon_code=coupon_code,
                tracking_url=tracking_url,
                original_price=orig_price,
                discounted_price=disc_price,
                discount_percentage=disc_pct,
                currency=str(row.get("currency") or "USD").upper(),
                valid_from=valid_from,
                valid_to=valid_to,
                raw_payload=row,
            )
        )
    return items


class ImpactFeedOfferSource:
    """Fetches and parses offers from Impact Radius feed endpoint."""

    def __init__(self, feed_url: str | None = None) -> None:
        settings = get_settings()
        self._feed_url = feed_url or settings.IMPACT_FEED_URL

    async def fetch_offers(self) -> list[RawOfferItem]:
        if not self._feed_url:
            logger.warning("[ImpactFeedOfferSource] No IMPACT_FEED_URL configured.")
            return []

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(self._feed_url)
            resp.raise_for_status()
            content_type = resp.headers.get("content-type", "")
            if "json" in content_type:
                data = resp.json()
                if isinstance(data, dict):
                    data = data.get("deals", data.get("offers", data.get("records", [])))
                return parse_impact_feed_payload(data)
            else:
                # Parse as CSV/TSV
                text_data = resp.text
                delimiter = "\t" if "\t" in text_data[:500] else ","
                reader = csv.DictReader(io.StringIO(text_data), delimiter=delimiter)
                return parse_impact_feed_payload(list(reader))
