"""Offer validator — enforces business rules, discount math sanity, and tracking host security."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from urllib.parse import urlparse

from app.core.config import get_settings


@dataclass
class ValidationResult:
    is_valid: bool
    status: str  # "ACTIVE", "SCHEDULED", "EXPIRED", "NEEDS_REVIEW", "INVALID"
    invalid_reason: str | None = None
    discount_percentage: float | None = None


def validate_tracking_url(url: str, allowed_hosts: list[str]) -> tuple[bool, str | None]:
    """Validate tracking URL scheme and host."""
    if not url:
        return False, "missing_tracking_url"
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False, "invalid_url_scheme"
        if not parsed.netloc:
            return False, "invalid_url_host"
        hostname = parsed.hostname or ""
        # Check against allowed tracking hosts
        matched = False
        for allowed in allowed_hosts:
            allowed = allowed.strip().lower()
            if not allowed:
                continue
            if hostname.lower() == allowed or hostname.lower().endswith("." + allowed):
                matched = True
                break
        if not matched:
            return False, f"untrusted_tracking_host:{hostname}"
    except Exception as exc:
        return False, f"invalid_tracking_url:{exc}"
    return True, None


def validate_offer(
    *,
    offer_type: str,
    tracking_url: str,
    original_price: Decimal | float | None = None,
    discounted_price: Decimal | float | None = None,
    discount_percentage: float | None = None,
    valid_from: datetime | None = None,
    valid_to: datetime | None = None,
    clock_now: datetime,
    allowed_hosts: list[str] | None = None,
) -> ValidationResult:
    """Validate offer constraints, math, dates, and security."""
    if allowed_hosts is None:
        settings = get_settings()
        allowed_hosts = [h.strip() for h in settings.ALLOWED_TRACKING_HOSTS.split(",") if h.strip()]

    # 1. Validate tracking URL host
    url_ok, url_err = validate_tracking_url(tracking_url, allowed_hosts)
    if not url_ok:
        return ValidationResult(
            is_valid=False,
            status="INVALID",
            invalid_reason=url_err,
        )

    # 2. Validate price / discount logic
    orig = float(original_price) if original_price is not None else None
    disc = float(discounted_price) if discounted_price is not None else None
    pct = discount_percentage

    if orig is not None and orig < 0:
        return ValidationResult(
            is_valid=False,
            status="INVALID",
            invalid_reason="negative_original_price",
        )

    if disc is not None and disc < 0:
        return ValidationResult(
            is_valid=False,
            status="INVALID",
            invalid_reason="negative_discounted_price",
        )

    if orig is not None and disc is not None:
        if disc > orig:
            return ValidationResult(
                is_valid=False,
                status="INVALID",
                invalid_reason="discounted_price_greater_than_original",
            )
        if orig > 0:
            computed_pct = round(((orig - disc) / orig) * 100, 2)
            if pct is not None and abs(pct - computed_pct) > 1.0:
                return ValidationResult(
                    is_valid=False,
                    status="NEEDS_REVIEW",
                    invalid_reason=f"discount_percentage_mismatch:given={pct},computed={computed_pct}",
                    discount_percentage=computed_pct,
                )
            pct = computed_pct

    if pct is not None:
        if pct < 0 or pct > 100:
            return ValidationResult(
                is_valid=False,
                status="INVALID",
                invalid_reason=f"invalid_discount_percentage:{pct}",
            )

    # 3. Date validation
    if valid_from and valid_to and valid_from > valid_to:
        return ValidationResult(
            is_valid=False,
            status="INVALID",
            invalid_reason="valid_from_after_valid_to",
        )

    # 4. Status determination based on clock_now
    status = "ACTIVE"
    if valid_from and clock_now < valid_from:
        status = "SCHEDULED"
    elif valid_to and clock_now > valid_to:
        status = "EXPIRED"

    return ValidationResult(
        is_valid=True,
        status=status,
        invalid_reason=None,
        discount_percentage=pct,
    )
