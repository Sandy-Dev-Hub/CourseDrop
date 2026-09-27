"""Admin authentication and throttle."""
from __future__ import annotations

import secrets
import time
from collections import defaultdict
from threading import Lock

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import APIKeyHeader

from app.core.config import get_settings

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

# In-memory per-IP failure tracker
_failure_lock = Lock()
_failures: dict[str, list[float]] = defaultdict(list)
_WINDOW_SECONDS = 60
_MAX_FAILURES = 10


def _get_client_ip(request: Request, trusted_proxy_count: int) -> str:
    """Extract client IP respecting trusted proxy count."""
    if trusted_proxy_count > 0:
        forwarded_for = request.headers.get("X-Forwarded-For", "")
        ips = [ip.strip() for ip in forwarded_for.split(",") if ip.strip()]
        if len(ips) > trusted_proxy_count:
            return ips[-(trusted_proxy_count + 1)]
    return request.client.host if request.client else "unknown"


def _record_failure(ip: str) -> None:
    now = time.monotonic()
    with _failure_lock:
        _failures[ip] = [t for t in _failures[ip] if now - t < _WINDOW_SECONDS]
        _failures[ip].append(now)


def _check_throttle(ip: str) -> None:
    now = time.monotonic()
    with _failure_lock:
        recent = [t for t in _failures.get(ip, []) if now - t < _WINDOW_SECONDS]
        _failures[ip] = recent
        if len(recent) >= _MAX_FAILURES:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many failed authentication attempts. Try again later.",
            )


async def require_admin_key(
    request: Request,
    api_key: str | None = Depends(_api_key_header),
) -> None:
    """Dependency that validates the admin API key with constant-time compare and throttle."""
    settings = get_settings()
    ip = _get_client_ip(request, settings.TRUSTED_PROXY_COUNT)

    # Check throttle before attempting compare
    _check_throttle(ip)

    expected = settings.ADMIN_API_KEY
    provided = api_key or ""

    # Constant-time compare (pad to same length to prevent timing side-channel)
    if not secrets.compare_digest(provided.encode(), expected.encode()):
        _record_failure(ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )
