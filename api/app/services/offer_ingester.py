"""Offer Ingester — deduplicates, matches courses, validates, and upserts offers."""
from __future__ import annotations

import hashlib
import json
import logging
from datetime import datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.clock import get_clock
from app.core.config import get_settings
from app.models.models import Course, Offer, Platform
from app.services.audit import AuditService
from app.services.offer_sources.base import RawOfferItem
from app.services.offer_validator import validate_offer

logger = logging.getLogger(__name__)


def generate_fingerprint(item: RawOfferItem) -> str:
    """Generate deterministic fingerprint for deduplication."""
    parts = [
        item.source_name or "",
        item.source_item_id or "",
        item.course_slug or item.course_url or "",
        item.offer_type or "",
        item.coupon_code or "",
        item.tracking_url or "",
    ]
    raw_str = "|".join(parts)
    return hashlib.sha256(raw_str.encode("utf-8")).hexdigest()


class OfferIngester:
    """Ingests raw offer items, matches courses, validates rules, and logs audits."""

    def __init__(self, session: AsyncSession, clock_now: datetime | None = None) -> None:
        self._session = session
        self._now = clock_now or get_clock().now()
        self._audit = AuditService(db=session, clock_now=self._now)

    async def _get_or_create_course(
        self, platform: Platform, item: RawOfferItem
    ) -> Course | None:
        """Find existing course or create a stub course if slug/title present."""
        slug = item.course_slug
        if not slug and item.course_url:
            # Extract slug from URL if possible
            parts = [p for p in item.course_url.strip("/").split("/") if p]
            if parts:
                slug = parts[-1]

        if not slug:
            # Cannot link to a course
            return None

        result = await self._session.execute(
            select(Course).where(
                Course.platform_id == platform.id,
                Course.slug == slug,
            )
        )
        course = result.scalar_one_or_none()
        if course is None:
            # Create a placeholder course
            course = Course(
                platform_id=platform.id,
                slug=slug,
                title=item.course_title or slug.replace("-", " ").title(),
                description=item.description,
                course_url=item.course_url or f"https://www.coursera.org/learn/{slug}",
                status="ACTIVE",
                consecutive_misses=0,
                first_seen_at=self._now,
                last_seen_at=self._now,
            )
            self._session.add(course)
            await self._session.flush()

        return course

    async def ingest_items(
        self, items: list[RawOfferItem], platform_slug: str = "coursera"
    ) -> dict[str, int]:
        """Process and ingest a batch of raw offer items."""
        settings = get_settings()
        allowed_hosts = [h.strip() for h in settings.ALLOWED_TRACKING_HOSTS.split(",") if h.strip()]

        # Ensure platform exists
        plat_res = await self._session.execute(
            select(Platform).where(Platform.slug == platform_slug)
        )
        platform = plat_res.scalar_one_or_none()
        if platform is None:
            platform = Platform(
                slug=platform_slug,
                name=platform_slug.title(),
                base_url="https://www.coursera.org",
                created_at=self._now,
                updated_at=self._now,
            )
            self._session.add(platform)
            await self._session.flush()

        stats = {
            "processed": 0,
            "created": 0,
            "updated": 0,
            "invalid": 0,
            "needs_review": 0,
        }

        for item in items:
            stats["processed"] += 1
            fingerprint = generate_fingerprint(item)

            # 1. Course lookup / association
            course = await self._get_or_create_course(platform, item)

            # 2. Validation
            val = validate_offer(
                offer_type=item.offer_type,
                tracking_url=item.tracking_url,
                original_price=item.original_price,
                discounted_price=item.discounted_price,
                discount_percentage=item.discount_percentage,
                valid_from=item.valid_from,
                valid_to=item.valid_to,
                clock_now=self._now,
                allowed_hosts=allowed_hosts,
            )

            if val.status == "INVALID":
                stats["invalid"] += 1
            elif val.status == "NEEDS_REVIEW":
                stats["needs_review"] += 1

            # 3. Check for existing offer
            offer_res = await self._session.execute(
                select(Offer).where(Offer.fingerprint == fingerprint)
            )
            offer = offer_res.scalar_one_or_none()

            if offer is None:
                # Create new offer
                offer = Offer(
                    course_id=course.id if course else None,
                    source=item.source_name,
                    source_item_id=item.source_item_id,
                    offer_type=item.offer_type,
                    headline=item.headline,
                    description=item.description,
                    coupon_code=item.coupon_code,
                    tracking_url=item.tracking_url,
                    original_price=item.original_price,
                    discounted_price=item.discounted_price,
                    discount_percentage=val.discount_percentage or item.discount_percentage,
                    currency=item.currency,
                    valid_from=item.valid_from,
                    valid_to=item.valid_to,
                    status=val.status,
                    invalid_reason=val.invalid_reason,
                    fingerprint=fingerprint,
                    raw_payload=item.raw_payload,
                    first_seen_at=self._now,
                    last_seen_at=self._now,
                    created_at=self._now,
                    updated_at=self._now,
                )
                self._session.add(offer)
                await self._session.flush()

                await self._audit.log(
                    entity_type="offer",
                    entity_id=offer.id,
                    offer_id=offer.id,
                    event_type="offer_created",
                    new_status=offer.status,
                    event_metadata={"reason": val.invalid_reason} if val.invalid_reason else None,
                )
                stats["created"] += 1
            else:
                # Existing offer update
                old_status = offer.status
                offer.headline = item.headline
                offer.description = item.description
                offer.original_price = item.original_price
                offer.discounted_price = item.discounted_price
                offer.discount_percentage = val.discount_percentage or item.discount_percentage
                offer.valid_from = item.valid_from
                offer.valid_to = item.valid_to
                offer.last_seen_at = self._now
                offer.updated_at = self._now

                # If status changed
                if old_status != val.status:
                    offer.status = val.status
                    offer.invalid_reason = val.invalid_reason
                    await self._audit.log(
                        entity_type="offer",
                        entity_id=offer.id,
                        offer_id=offer.id,
                        event_type="offer_status_changed",
                        old_status=old_status,
                        new_status=val.status,
                        event_metadata={"reason": val.invalid_reason} if val.invalid_reason else None,
                    )

                stats["updated"] += 1

        await self._session.flush()
        return stats
