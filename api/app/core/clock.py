"""Injected clock abstraction — controls all business timestamps.

Usage:
    clock: Clock = Depends(get_clock)
    now = clock.now()
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Protocol

from fastapi import Depends


class Clock(Protocol):
    """Protocol for time sources."""

    def now(self) -> datetime:
        """Return current UTC datetime (timezone-aware)."""
        ...


class SystemClock:
    """Production clock — uses real wall time."""

    def now(self) -> datetime:
        return datetime.now(tz=timezone.utc)


class FixedClock:
    """Test clock — always returns the same instant."""

    def __init__(self, fixed: datetime) -> None:
        if fixed.tzinfo is None:
            raise ValueError("FixedClock requires a timezone-aware datetime")
        self._fixed = fixed

    def now(self) -> datetime:
        return self._fixed


# Module-level override used in tests
_clock_override: Clock | None = None


def set_clock(clock: Clock | None) -> None:
    """Override the clock (for tests). Pass None to restore SystemClock."""
    global _clock_override
    _clock_override = clock


def get_clock() -> Clock:
    """FastAPI dependency that returns the active clock."""
    return _clock_override if _clock_override is not None else SystemClock()
