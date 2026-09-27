"""Coursera Catalog API client.

Uses the documented public Coursera Catalog API (courses.v1).
No scraping of coursera.org, no undocumented endpoints.
"""
from __future__ import annotations

import logging
from typing import Any

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)


# Fields requested from the Coursera catalog API
_CATALOG_FIELDS = ",".join([
    "name",
    "slug",
    "description",
    "photoUrl",
    "domainTypes",
    "partnerIds",
    "courseStatus",
])


class CatalogAPIError(Exception):
    """Raised when the Coursera catalog API returns an error."""


class CourseraNotFoundError(Exception):
    """Raised when a course slug lookup returns no results (definitive 404)."""


class CourseraCatalogClient:
    """Client for the Coursera Catalog API (courses.v1).

    Only retrieves data from the documented public API endpoint.
    """

    def __init__(self, base_url: str | None = None, timeout: float = 30.0) -> None:
        settings = get_settings()
        self._base_url = base_url or settings.COURSERA_CATALOG_URL
        self._timeout = timeout
        self._client = httpx.AsyncClient(timeout=timeout)

    async def aclose(self) -> None:
        await self._client.aclose()

    async def fetch_catalog_page(
        self, *, start: int = 0, limit: int = 100
    ) -> dict[str, Any]:
        """Fetch a single page of courses from the catalog API.

        Returns the raw API response dict.
        Raises CatalogAPIError on non-2xx responses.
        Does NOT raise on 429/5xx (caller decides retry logic).
        """
        params = {
            "start": start,
            "limit": limit,
            "fields": _CATALOG_FIELDS,
        }
        try:
            resp = await self._client.get(self._base_url, params=params)
        except httpx.TimeoutException as exc:
            raise CatalogAPIError(f"Coursera API timeout: {exc}") from exc
        except httpx.RequestError as exc:
            raise CatalogAPIError(f"Coursera API request error: {exc}") from exc

        if resp.status_code == 429:
            raise CatalogAPIError(f"Coursera API rate limited (429)")
        if resp.status_code >= 500:
            raise CatalogAPIError(f"Coursera API server error: {resp.status_code}")
        if not resp.is_success:
            raise CatalogAPIError(
                f"Coursera API error {resp.status_code}: {resp.text[:200]}"
            )

        return resp.json()

    async def lookup_by_slug(self, slug: str) -> dict[str, Any] | None:
        """Lookup a single course by slug.

        Returns None if the course is definitively not found (empty elements).
        Raises CatalogAPIError on timeouts, 429s, 5xx (not a miss).
        """
        params = {
            "q": "slug",
            "slug": slug,
            "fields": _CATALOG_FIELDS,
        }
        try:
            resp = await self._client.get(self._base_url, params=params)
        except httpx.TimeoutException as exc:
            raise CatalogAPIError(f"Timeout looking up slug '{slug}': {exc}") from exc
        except httpx.RequestError as exc:
            raise CatalogAPIError(f"Request error for slug '{slug}': {exc}") from exc

        if resp.status_code == 429:
            raise CatalogAPIError(f"Rate limited looking up slug '{slug}' (429)")
        if resp.status_code >= 500:
            raise CatalogAPIError(f"Server error {resp.status_code} for slug '{slug}'")
        if resp.status_code == 404:
            return None  # Definitive not found

        if not resp.is_success:
            raise CatalogAPIError(
                f"Coursera API error {resp.status_code} for slug '{slug}': {resp.text[:200]}"
            )

        data = resp.json()
        elements = data.get("elements", [])
        if not elements:
            return None  # Empty result — definitive not found

        return elements[0]
