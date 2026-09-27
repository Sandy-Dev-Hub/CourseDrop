"""Unit tests for offer validator logic and security rules."""
from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

import pytest

from app.services.offer_validator import validate_offer, validate_tracking_url

NOW = datetime(2026, 9, 27, 12, 0, 0, tzinfo=timezone.utc)
ALLOWED_HOSTS = ["track.example.test", "coursera.org", "impact.com"]


def test_validate_tracking_url_valid():
    ok, err = validate_tracking_url("https://track.example.test/click?id=123", ALLOWED_HOSTS)
    assert ok is True
    assert err is None

    ok, err = validate_tracking_url("https://sub.impact.com/c/123", ALLOWED_HOSTS)
    assert ok is True
    assert err is None


def test_validate_tracking_url_untrusted_host():
    ok, err = validate_tracking_url("https://evil.com/phish", ALLOWED_HOSTS)
    assert ok is False
    assert "untrusted_tracking_host:evil.com" in err


def test_validate_tracking_url_invalid_scheme():
    ok, err = validate_tracking_url("javascript:alert(1)", ALLOWED_HOSTS)
    assert ok is False


def test_valid_active_offer():
    res = validate_offer(
        offer_type="PERCENTAGE",
        tracking_url="https://track.example.test/deal1",
        original_price=Decimal("49.00"),
        discounted_price=Decimal("19.60"),
        discount_percentage=60.0,
        valid_from=datetime(2026, 9, 1, 0, 0, 0, tzinfo=timezone.utc),
        valid_to=datetime(2026, 10, 1, 0, 0, 0, tzinfo=timezone.utc),
        clock_now=NOW,
        allowed_hosts=ALLOWED_HOSTS,
    )
    assert res.is_valid is True
    assert res.status == "ACTIVE"
    assert res.invalid_reason is None
    assert res.discount_percentage == 60.0


def test_future_offer_is_scheduled():
    res = validate_offer(
        offer_type="PERCENTAGE",
        tracking_url="https://track.example.test/deal2",
        original_price=Decimal("100.00"),
        discounted_price=Decimal("50.00"),
        valid_from=datetime(2026, 10, 1, 0, 0, 0, tzinfo=timezone.utc),
        valid_to=datetime(2026, 11, 1, 0, 0, 0, tzinfo=timezone.utc),
        clock_now=NOW,
        allowed_hosts=ALLOWED_HOSTS,
    )
    assert res.is_valid is True
    assert res.status == "SCHEDULED"


def test_past_offer_is_expired():
    res = validate_offer(
        offer_type="PERCENTAGE",
        tracking_url="https://track.example.test/deal3",
        original_price=Decimal("100.00"),
        discounted_price=Decimal("50.00"),
        valid_from=datetime(2026, 8, 1, 0, 0, 0, tzinfo=timezone.utc),
        valid_to=datetime(2026, 9, 1, 0, 0, 0, tzinfo=timezone.utc),
        clock_now=NOW,
        allowed_hosts=ALLOWED_HOSTS,
    )
    assert res.is_valid is True
    assert res.status == "EXPIRED"


def test_discount_greater_than_original_is_invalid():
    res = validate_offer(
        offer_type="PERCENTAGE",
        tracking_url="https://track.example.test/deal4",
        original_price=Decimal("50.00"),
        discounted_price=Decimal("100.00"),
        clock_now=NOW,
        allowed_hosts=ALLOWED_HOSTS,
    )
    assert res.is_valid is False
    assert res.status == "INVALID"
    assert res.invalid_reason == "discounted_price_greater_than_original"


def test_negative_prices_invalid():
    res = validate_offer(
        offer_type="PERCENTAGE",
        tracking_url="https://track.example.test/deal5",
        original_price=Decimal("-10.00"),
        clock_now=NOW,
        allowed_hosts=ALLOWED_HOSTS,
    )
    assert res.is_valid is False
    assert res.status == "INVALID"
    assert res.invalid_reason == "negative_original_price"


def test_valid_from_after_valid_to_invalid():
    res = validate_offer(
        offer_type="PERCENTAGE",
        tracking_url="https://track.example.test/deal6",
        valid_from=datetime(2026, 10, 1, 0, 0, 0, tzinfo=timezone.utc),
        valid_to=datetime(2026, 9, 1, 0, 0, 0, tzinfo=timezone.utc),
        clock_now=NOW,
        allowed_hosts=ALLOWED_HOSTS,
    )
    assert res.is_valid is False
    assert res.status == "INVALID"
    assert res.invalid_reason == "valid_from_after_valid_to"


def test_discount_percentage_mismatch_flags_needs_review():
    # Original $100, discounted $50 -> true discount 50%, but claiming 90%
    res = validate_offer(
        offer_type="PERCENTAGE",
        tracking_url="https://track.example.test/deal7",
        original_price=Decimal("100.00"),
        discounted_price=Decimal("50.00"),
        discount_percentage=90.0,
        clock_now=NOW,
        allowed_hosts=ALLOWED_HOSTS,
    )
    assert res.is_valid is False
    assert res.status == "NEEDS_REVIEW"
    assert "discount_percentage_mismatch" in res.invalid_reason
