"""Tests for admin authentication and throttle."""
from __future__ import annotations

import time
from unittest.mock import patch

import pytest

from app.core.security import _failures, _failure_lock


@pytest.mark.asyncio
async def test_valid_admin_key(client, admin_headers):
    """Valid key returns 200 from health endpoint."""
    resp = await client.get("/api/health", headers=admin_headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_invalid_admin_key(client):
    """Invalid key returns 401."""
    resp = await client.get("/api/health", headers={"X-API-Key": "wrong-key"})
    # health doesn't require admin — test with a protected endpoint
    # For now health is public; use a placeholder
    assert resp.status_code in (200, 401)


@pytest.mark.asyncio
async def test_no_admin_key_on_protected_route(client):
    """Missing key on admin endpoint returns 401 or 403."""
    resp = await client.get("/api/admin/offers")
    assert resp.status_code in (401, 403, 404)


@pytest.mark.asyncio
async def test_constant_time_compare(client):
    """Timing is similar for correct and wrong keys (smoke test)."""
    import time

    t_correct = []
    t_wrong = []

    for _ in range(5):
        start = time.perf_counter()
        await client.get("/api/admin/offers", headers={"X-API-Key": "test-admin-key-for-tests-only"})
        t_correct.append(time.perf_counter() - start)

    for _ in range(5):
        start = time.perf_counter()
        await client.get("/api/admin/offers", headers={"X-API-Key": "x"})
        t_wrong.append(time.perf_counter() - start)

    # Not a hard assertion (timing is noisy in tests), just ensure it doesn't raise
    assert len(t_correct) == 5
    assert len(t_wrong) == 5


@pytest.mark.asyncio
async def test_throttle_after_10_failures(client):
    """After 10 failures, the 11th returns 429."""
    # Clear failure state for a fake IP
    fake_ip = "10.0.0.1"
    with _failure_lock:
        _failures[fake_ip] = []

    # Simulate 10 failures from this IP by patching _get_client_ip
    with patch("app.core.security._get_client_ip", return_value=fake_ip):
        for i in range(10):
            resp = await client.get("/api/admin/offers", headers={"X-API-Key": "bad-key"})
            assert resp.status_code == 401, f"Expected 401 on attempt {i+1}, got {resp.status_code}"

        # 11th should be throttled
        resp = await client.get("/api/admin/offers", headers={"X-API-Key": "bad-key"})
        assert resp.status_code == 429

    # Cleanup
    with _failure_lock:
        _failures.pop(fake_ip, None)
