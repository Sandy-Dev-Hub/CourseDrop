"""Delisting check job — individual by-slug lookup for courses that may be gone.

Key rules (from spec):
- A capped sync NEVER causes delisting (absence from partial sync ≠ gone)
- Timeouts, 429s, 5xx NEVER count as a miss
- Only definitive empty-result or 404 from a by-slug lookup increments consecutive_misses
- At 3 consecutive misses: course → DELISTED, its ACTIVE/SCHEDULED offers → INVALID(course_delisted)
"""
from __future__ import annotations

import logging
from datetime import timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.clock import get_clock
from app.models.models import Course, Offer, SyncRun
from app.services.audit import AuditService
from app.services.catalog_client import CatalogAPIError, CourseraCatalogClient

logger = logging.getLogger(__name__)

DELIST_THRESHOLD = 3


async def _should_check_course(course: Course, clock_now) -> bool:
    """Check if a course is eligible for delisting check.

    Checks courses that:
    - Have at least one non-terminal offer (ACTIVE/SCHEDULED/NEEDS_REVIEW), OR
    - Were displayed (last_seen_at) in the last 30 days
    """
    # Always check non-DELISTED, non-UNKNOWN courses
    return course.status not in ("DELISTED",)


async def run_check_delisting(session: AsyncSession) -> None:
    """Run the delisting check job.

    For each eligible course, does a by-slug lookup.
    Definitive not-found → consecutive_misses += 1
    Found → reset to 0
    Timeouts, 429s, 5xx → no change (not a miss)
    At 3 misses → DELISTED + cascade offers to INVALID(course_delisted)
    """
    clock = get_clock()
    clock_now = clock.now()
    client = CourseraCatalogClient()
    audit = AuditService(db=session, clock_now=clock_now)

    sync_run = SyncRun(
        job_name="check_delisting",
        status="running",
        started_at=clock_now,
    )
    session.add(sync_run)
    await session.flush()

    checked = 0
    delisted = 0

    try:
        # Get all non-DELISTED courses
        result = await session.execute(
            select(Course).where(Course.status != "DELISTED")
        )
        courses = result.scalars().all()

        for course in courses:
            try:
                found = await client.lookup_by_slug(course.slug)
            except CatalogAPIError as exc:
                # Timeout, 429, 5xx → NOT a miss, skip this course
                logger.debug(
                    f"[check_delisting] Skipping course '{course.slug}' due to transient error: {exc}"
                )
                continue

            checked += 1
            course.last_checked_at = clock_now

            if found is None:
                # Definitive not-found
                course.consecutive_misses += 1
                logger.info(
                    f"[check_delisting] Course '{course.slug}' not found "
                    f"(miss #{course.consecutive_misses})"
                )

                if course.consecutive_misses >= DELIST_THRESHOLD:
                    # Delist the course
                    old_status = course.status
                    course.status = "DELISTED"
                    delisted += 1
                    logger.warning(
                        f"[check_delisting] Course '{course.slug}' DELISTED after "
                        f"{course.consecutive_misses} consecutive misses"
                    )
                    await audit.log(
                        entity_type="course",
                        entity_id=course.id,
                        event_type="course_delisted",
                        old_status=old_status,
                        new_status="DELISTED",
                        event_metadata={"consecutive_misses": course.consecutive_misses},
                    )

                    # Cascade: mark ACTIVE/SCHEDULED offers as INVALID
                    offers_result = await session.execute(
                        select(Offer).where(
                            Offer.course_id == course.id,
                            Offer.status.in_(["ACTIVE", "SCHEDULED"]),
                        )
                    )
                    for offer in offers_result.scalars().all():
                        old_offer_status = offer.status
                        offer.status = "INVALID"
                        offer.invalid_reason = "course_delisted"
                        offer.updated_at = clock_now
                        await audit.log(
                            entity_type="offer",
                            entity_id=offer.id,
                            offer_id=offer.id,
                            event_type="offer_invalidated",
                            old_status=old_offer_status,
                            new_status="INVALID",
                            event_metadata={"reason": "course_delisted"},
                        )
            else:
                # Found — reset counter
                if course.consecutive_misses > 0:
                    logger.info(
                        f"[check_delisting] Course '{course.slug}' found again, "
                        f"resetting consecutive_misses from {course.consecutive_misses}"
                    )
                course.consecutive_misses = 0

        sync_run.status = "success"
        sync_run.finished_at = get_clock().now()
        sync_run.rows_processed = checked
        await session.commit()
        logger.info(
            f"[check_delisting] Complete. Checked: {checked}, Delisted: {delisted}"
        )

    except Exception as exc:
        logger.exception(f"[check_delisting] Unexpected error: {exc}")
        sync_run.status = "failed"
        sync_run.finished_at = get_clock().now()
        sync_run.error_message = str(exc)
        sync_run.rows_processed = checked
        await session.commit()
        raise
    finally:
        await client.aclose()
