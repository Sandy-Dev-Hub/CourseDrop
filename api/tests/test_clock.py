"""Tests for the Clock abstraction."""
from __future__ import annotations

from datetime import datetime, timezone

import pytest

from app.core.clock import FixedClock, SystemClock, get_clock, set_clock


FIXED_DT = datetime(2026, 9, 26, 12, 0, 0, tzinfo=timezone.utc)


def test_system_clock_returns_aware_datetime():
    clock = SystemClock()
    now = clock.now()
    assert now.tzinfo is not None


def test_fixed_clock_returns_fixed_time():
    clock = FixedClock(FIXED_DT)
    assert clock.now() == FIXED_DT
    assert clock.now() == FIXED_DT  # idempotent


def test_fixed_clock_rejects_naive_datetime():
    naive = datetime(2026, 1, 1)
    with pytest.raises(ValueError):
        FixedClock(naive)


def test_get_clock_returns_system_by_default():
    set_clock(None)
    clock = get_clock()
    assert isinstance(clock, SystemClock)


def test_set_clock_override():
    fixed = FixedClock(FIXED_DT)
    set_clock(fixed)
    try:
        clock = get_clock()
        assert clock is fixed
        assert clock.now() == FIXED_DT
    finally:
        set_clock(None)


def test_set_clock_restore():
    set_clock(FixedClock(FIXED_DT))
    set_clock(None)
    assert isinstance(get_clock(), SystemClock)
