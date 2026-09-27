"""Catalog sync job — fetches Coursera catalog and upserts courses.

Respects COURSERA_SYNC_MAX_COURSES limit.
Never infers delisting from a capped/partial sync.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.clock import get_clock
from app.core.config import get_settings
from app.models.models import Category, Course, CourseCategory, Platform, SyncRun
from app.services.catalog_client import CatalogAPIError, CourseraCatalogClient
from app.services.catalog_mapper import MappedCourse, map_catalog_page

logger = logging.getLogger(__name__)

COURSERA_PLATFORM_SLUG = "coursera"
COURSERA_PLATFORM_NAME = "Coursera"
COURSERA_BASE_URL = "https://www.coursera.org"


async def _get_or_create_platform(session: AsyncSession, clock_now: datetime) -> Platform:
    """Get the Coursera platform row, creating it if it doesn't exist."""
    result = await session.execute(
        select(Platform).where(Platform.slug == COURSERA_PLATFORM_SLUG)
    )
    platform = result.scalar_one_or_none()
    if platform is None:
        platform = Platform(
            slug=COURSERA_PLATFORM_SLUG,
            name=COURSERA_PLATFORM_NAME,
            base_url=COURSERA_BASE_URL,
            created_at=clock_now,
            updated_at=clock_now,
        )
        session.add(platform)
        await session.flush()
    return platform


async def _get_or_create_category(
    session: AsyncSession, slug: str, clock_now: datetime
) -> Category:
    """Get or create a category by slug."""
    result = await session.execute(select(Category).where(Category.slug == slug))
    cat = result.scalar_one_or_none()
    if cat is None:
        name = slug.replace("-", " ").title()
        cat = Category(slug=slug, name=name)
        session.add(cat)
        await session.flush()
    return cat


async def _upsert_course(
    session: AsyncSession,
    platform: Platform,
    mapped: MappedCourse,
    clock_now: datetime,
) -> Course:
    """Insert or update a course. Updates last_seen_at on each sync."""
    result = await session.execute(
        select(Course).where(
            Course.platform_id == platform.id,
            Course.slug == mapped.slug,
        )
    )
    course = result.scalar_one_or_none()

    if course is None:
        course = Course(
            platform_id=platform.id,
            slug=mapped.slug,
            platform_course_id=mapped.platform_course_id,
            title=mapped.title,
            description=mapped.description,
            image_url=mapped.image_url,
            course_url=mapped.course_url,
            status="ACTIVE",
            consecutive_misses=0,
            first_seen_at=clock_now,
            last_seen_at=clock_now,
        )
        session.add(course)
    else:
        # Update mutable fields
        course.title = mapped.title
        course.description = mapped.description
        course.image_url = mapped.image_url
        course.course_url = mapped.course_url
        course.last_seen_at = clock_now
        # If previously delisted and now found, restore
        if course.status == "DELISTED":
            course.status = "ACTIVE"
            course.consecutive_misses = 0

    await session.flush()
    return course


async def _sync_categories(
    session: AsyncSession,
    course: Course,
    category_slugs: list[str],
    clock_now: datetime,
) -> None:
    """Sync course-category associations."""
    for slug in category_slugs:
        cat = await _get_or_create_category(session, slug, clock_now)
        # Check if association already exists
        result = await session.execute(
            select(CourseCategory).where(
                CourseCategory.course_id == course.id,
                CourseCategory.category_id == cat.id,
            )
        )
        if result.scalar_one_or_none() is None:
            session.add(CourseCategory(course_id=course.id, category_id=cat.id))


async def run_sync_catalog(session: AsyncSession) -> None:
    """Run the catalog sync job.

    Fetches all courses up to COURSERA_SYNC_MAX_COURSES.
    A capped sync NEVER delists courses (see check_delisting.py for that).
    """
    settings = get_settings()
    clock_now = get_clock().now()
    client = CourseraCatalogClient()

    sync_run = SyncRun(
        job_name="sync_catalog",
        status="running",
        started_at=clock_now,
    )
    session.add(sync_run)
    await session.flush()

    total_processed = 0
    try:
        platform = await _get_or_create_platform(session, clock_now)

        start = 0
        page_size = min(100, settings.COURSERA_SYNC_MAX_COURSES)
        max_courses = settings.COURSERA_SYNC_MAX_COURSES

        while total_processed < max_courses:
            logger.info(f"[sync_catalog] Fetching page start={start} limit={page_size}")
            try:
                page_data = await client.fetch_catalog_page(start=start, limit=page_size)
            except CatalogAPIError as exc:
                logger.error(f"[sync_catalog] API error: {exc}")
                # Record failure but don't crash scheduler loop
                sync_run.status = "failed"
                sync_run.finished_at = get_clock().now()
                sync_run.error_message = str(exc)
                sync_run.rows_processed = total_processed
                await session.commit()
                return

            courses = map_catalog_page(page_data)
            if not courses:
                logger.info(f"[sync_catalog] No more courses. Done at {total_processed} total.")
                break

            for mapped in courses:
                if total_processed >= max_courses:
                    break
                course = await _upsert_course(session, platform, mapped, clock_now)
                await _sync_categories(session, course, mapped.category_slugs, clock_now)
                total_processed += 1

            # Check if there are more pages
            paging = page_data.get("paging", {})
            next_start = paging.get("next")
            if next_start is None:
                break
            start = next_start

        sync_run.status = "success"
        sync_run.finished_at = get_clock().now()
        sync_run.rows_processed = total_processed
        await session.commit()
        logger.info(f"[sync_catalog] Complete. Processed {total_processed} courses.")

    except Exception as exc:
        logger.exception(f"[sync_catalog] Unexpected error: {exc}")
        sync_run.status = "failed"
        sync_run.finished_at = get_clock().now()
        sync_run.error_message = str(exc)
        sync_run.rows_processed = total_processed
        await session.commit()
        raise
    finally:
        await client.aclose()


async def purge_platform(session: AsyncSession, platform_slug: str, clock_now: datetime) -> int:
    """Purge all courses and categories for a platform (admin action).

    Returns count of courses purged.
    """
    result = await session.execute(select(Platform).where(Platform.slug == platform_slug))
    platform = result.scalar_one_or_none()
    if platform is None:
        return 0

    result = await session.execute(select(Course).where(Course.platform_id == platform.id))
    courses = result.scalars().all()

    for course in courses:
        await session.delete(course)

    await session.commit()
    logger.info(f"[purge_platform] Purged {len(courses)} courses for platform '{platform_slug}'")
    return len(courses)
