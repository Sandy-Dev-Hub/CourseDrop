"""Unit tests for CourseraCatalogClient using respx."""
from __future__ import annotations

import httpx
import pytest
import respx

from app.services.catalog_client import CatalogAPIError, CourseraCatalogClient


@pytest.mark.asyncio
async def test_fetch_catalog_page_success():
    client = CourseraCatalogClient(base_url="https://api.coursera.org/api/courses.v1")
    fake_response = {
        "elements": [
            {"id": "c1", "slug": "course-one", "name": "Course One"},
            {"id": "c2", "slug": "course-two", "name": "Course Two"},
        ],
        "paging": {"next": "100", "total": 200},
    }

    with respx.mock(base_url="https://api.coursera.org") as respx_mock:
        route = respx_mock.get("/api/courses.v1").respond(200, json=fake_response)
        data = await client.fetch_catalog_page(start=0, limit=100)

        assert route.called
        assert len(data["elements"]) == 2
        assert data["paging"]["next"] == "100"

    await client.aclose()


@pytest.mark.asyncio
async def test_fetch_catalog_page_429_raises_api_error():
    client = CourseraCatalogClient(base_url="https://api.coursera.org/api/courses.v1")

    with respx.mock(base_url="https://api.coursera.org") as respx_mock:
        respx_mock.get("/api/courses.v1").respond(429, text="Rate Limited")
        with pytest.raises(CatalogAPIError) as exc_info:
            await client.fetch_catalog_page(start=0, limit=100)
        assert "429" in str(exc_info.value)

    await client.aclose()


@pytest.mark.asyncio
async def test_fetch_catalog_page_500_raises_api_error():
    client = CourseraCatalogClient(base_url="https://api.coursera.org/api/courses.v1")

    with respx.mock(base_url="https://api.coursera.org") as respx_mock:
        respx_mock.get("/api/courses.v1").respond(503, text="Service Unavailable")
        with pytest.raises(CatalogAPIError) as exc_info:
            await client.fetch_catalog_page(start=0, limit=100)
        assert "503" in str(exc_info.value)

    await client.aclose()


@pytest.mark.asyncio
async def test_lookup_by_slug_found():
    client = CourseraCatalogClient(base_url="https://api.coursera.org/api/courses.v1")
    fake_response = {
        "elements": [
            {"id": "cs001", "slug": "python-for-everybody", "name": "Python for Everybody"}
        ]
    }

    with respx.mock(base_url="https://api.coursera.org") as respx_mock:
        respx_mock.get("/api/courses.v1").respond(200, json=fake_response)
        res = await client.lookup_by_slug("python-for-everybody")
        assert res is not None
        assert res["name"] == "Python for Everybody"

    await client.aclose()


@pytest.mark.asyncio
async def test_lookup_by_slug_empty_returns_none():
    client = CourseraCatalogClient(base_url="https://api.coursera.org/api/courses.v1")
    fake_response = {"elements": []}

    with respx.mock(base_url="https://api.coursera.org") as respx_mock:
        respx_mock.get("/api/courses.v1").respond(200, json=fake_response)
        res = await client.lookup_by_slug("non-existent-course")
        assert res is None

    await client.aclose()


@pytest.mark.asyncio
async def test_lookup_by_slug_404_returns_none():
    client = CourseraCatalogClient(base_url="https://api.coursera.org/api/courses.v1")

    with respx.mock(base_url="https://api.coursera.org") as respx_mock:
        respx_mock.get("/api/courses.v1").respond(404, text="Not found")
        res = await client.lookup_by_slug("non-existent-course")
        assert res is None

    await client.aclose()


@pytest.mark.asyncio
async def test_lookup_by_slug_429_raises_error():
    client = CourseraCatalogClient(base_url="https://api.coursera.org/api/courses.v1")

    with respx.mock(base_url="https://api.coursera.org") as respx_mock:
        respx_mock.get("/api/courses.v1").respond(429, text="Rate limit")
        with pytest.raises(CatalogAPIError):
            await client.lookup_by_slug("python-for-everybody")

    await client.aclose()
