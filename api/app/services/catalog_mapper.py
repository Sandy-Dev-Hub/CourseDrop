"""Catalog mapper — converts raw Coursera API response to our Course model.

Handles null fields gracefully (e.g. cs007 with null description/image).
Unknown extra fields are logged, not fatal.
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from typing import Any

from app.services.category_matcher import extract_categories

logger = logging.getLogger(__name__)

COURSERA_COURSE_BASE = "https://www.coursera.org/learn/"


@dataclass
class MappedCourse:
    """Intermediate representation of a mapped Coursera course."""

    platform_course_id: str
    slug: str
    title: str
    description: str | None
    image_url: str | None
    course_url: str
    category_slugs: list[str] = field(default_factory=list)
    raw: dict[str, Any] = field(default_factory=dict)


def _slugify(text: str) -> str:
    """Basic slug normalisation (Coursera already provides slugs)."""
    return re.sub(r"[^\w-]", "", text.lower().replace(" ", "-"))


def map_coursera_course(raw: dict[str, Any]) -> MappedCourse | None:
    """Map a single Coursera API element to a MappedCourse.

    Returns None if required fields are missing.
    Extra unknown fields are logged at DEBUG level.
    """
    course_id = raw.get("id")
    slug = raw.get("slug")
    name = raw.get("name")

    if not course_id or not slug or not name:
        logger.warning(
            "Coursera course missing required fields (id/slug/name): %r",
            {k: raw.get(k) for k in ("id", "slug", "name")},
        )
        return None

    # Log unknown top-level fields (never fatal)
    known_fields = {"id", "slug", "name", "description", "photoUrl", "domainTypes", "partnerIds", "courseStatus"}
    unknown = set(raw.keys()) - known_fields
    if unknown:
        logger.debug("Coursera course %r has unknown fields: %s", slug, unknown)

    # Description may be null
    description = raw.get("description") or None

    # Image may be null
    image_url = raw.get("photoUrl") or None

    # Category mapping from domainTypes
    domain_types = raw.get("domainTypes") or []
    category_slugs = extract_categories(domain_types)

    course_url = f"{COURSERA_COURSE_BASE}{slug}"

    return MappedCourse(
        platform_course_id=str(course_id),
        slug=slug,
        title=name,
        description=description,
        image_url=image_url,
        course_url=course_url,
        category_slugs=category_slugs,
        raw=raw,
    )


def map_catalog_page(page_data: dict[str, Any]) -> list[MappedCourse]:
    """Map a full catalog API page response.

    Handles missing 'elements' key gracefully.
    Skips items with missing required fields (logged).
    """
    elements = page_data.get("elements")
    if elements is None:
        logger.warning("Catalog page response missing 'elements' key: %r", list(page_data.keys()))
        return []

    results: list[MappedCourse] = []
    for item in elements:
        mapped = map_coursera_course(item)
        if mapped is not None:
            results.append(mapped)

    return results
