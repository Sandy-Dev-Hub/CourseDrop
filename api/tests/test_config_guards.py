"""Tests for the 5 production startup guards in config.py."""
from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.core.config import Settings


def _prod_base() -> dict:
    """Minimal valid production settings."""
    return {
        "APP_ENV": "production",
        "ALLOWED_TRACKING_HOSTS": "track.real-domain.com",
        "ADMIN_API_KEY": "a" * 32,
        "OFFER_SOURCES": "manual",
        "CORS_ALLOWED_ORIGINS": "https://coursedrop.com",
        "SITE_URL": "https://coursedrop.com",
        "DATABASE_URL": "postgresql+asyncpg://localhost/prod",
    }


def test_valid_production_config():
    """Valid production config does not raise."""
    s = Settings(**_prod_base())
    assert s.APP_ENV == "production"


def test_guard_1_empty_tracking_hosts():
    """Guard (1): ALLOWED_TRACKING_HOSTS empty → ValidationError."""
    base = _prod_base()
    base["ALLOWED_TRACKING_HOSTS"] = ""
    with pytest.raises(ValidationError) as exc_info:
        Settings(**base)
    assert "ALLOWED_TRACKING_HOSTS" in str(exc_info.value)


def test_guard_2_test_tracking_host():
    """Guard (2): .test host → ValidationError."""
    base = _prod_base()
    base["ALLOWED_TRACKING_HOSTS"] = "track.example.test"
    with pytest.raises(ValidationError) as exc_info:
        Settings(**base)
    assert "non-production host" in str(exc_info.value)


def test_guard_2_invalid_tracking_host():
    """Guard (2): .invalid TLD → ValidationError."""
    base = _prod_base()
    base["ALLOWED_TRACKING_HOSTS"] = "track.example.invalid"
    with pytest.raises(ValidationError):
        Settings(**base)


def test_guard_2_example_prefix():
    """Guard (2): example. prefix → ValidationError."""
    base = _prod_base()
    base["ALLOWED_TRACKING_HOSTS"] = "example.com"
    with pytest.raises(ValidationError):
        Settings(**base)


def test_guard_2_localhost():
    """Guard (2): localhost → ValidationError."""
    base = _prod_base()
    base["ALLOWED_TRACKING_HOSTS"] = "localhost"
    with pytest.raises(ValidationError):
        Settings(**base)


def test_guard_3_short_admin_key():
    """Guard (3): ADMIN_API_KEY < 32 chars → ValidationError."""
    base = _prod_base()
    base["ADMIN_API_KEY"] = "short"
    with pytest.raises(ValidationError) as exc_info:
        Settings(**base)
    assert "ADMIN_API_KEY" in str(exc_info.value)


def test_guard_3_exact_32_chars():
    """Guard (3): exactly 32 chars is allowed."""
    base = _prod_base()
    base["ADMIN_API_KEY"] = "a" * 32
    s = Settings(**base)
    assert len(s.ADMIN_API_KEY) == 32


def test_guard_4_seed_in_offer_sources():
    """Guard (4): OFFER_SOURCES includes 'seed' → ValidationError."""
    base = _prod_base()
    base["OFFER_SOURCES"] = "seed,manual"
    with pytest.raises(ValidationError) as exc_info:
        Settings(**base)
    assert "seed" in str(exc_info.value)


def test_guard_5_wildcard_cors():
    """Guard (5): CORS_ALLOWED_ORIGINS contains '*' → ValidationError."""
    base = _prod_base()
    base["CORS_ALLOWED_ORIGINS"] = "*"
    with pytest.raises(ValidationError) as exc_info:
        Settings(**base)
    assert "CORS_ALLOWED_ORIGINS" in str(exc_info.value) or "wildcard" in str(exc_info.value).lower() or "*" in str(exc_info.value)
