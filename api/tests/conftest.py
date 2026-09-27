"""Pytest configuration and fixtures for CourseDrop API tests.

Requires a running PostgreSQL with 'coursedrop_test' database:
  createdb coursedrop_test
  # or: psql -c "CREATE DATABASE coursedrop_test;"

The connection string is taken from TEST_DATABASE_URL env var,
defaulting to postgresql+asyncpg://localhost/coursedrop_test.
"""
from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.core.clock import FixedClock, set_clock
from app.core.config import get_settings
from app.core.database import Base, get_db
from app.models import models as _models_import  # noqa: F401 — ensure all models registered

TEST_DB_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://localhost/coursedrop_test",
)

# Override the app settings to point to the test DB
os.environ.setdefault("DATABASE_URL", TEST_DB_URL)
os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("ADMIN_API_KEY", "test-admin-key-for-tests-only")
os.environ.setdefault("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
os.environ.setdefault("ALLOWED_TRACKING_HOSTS", "track.example.test")

# Must import after env vars are set
from app.main import app  # noqa: E402


# ---------------------------------------------------------------------------
# Async engine and session fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    """Session-scoped engine pointing at coursedrop_test."""
    engine = create_async_engine(TEST_DB_URL, echo=False, pool_size=3)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture
async def db(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Per-test session with automatic rollback."""
    factory = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)
    async with factory() as session:
        async with session.begin():
            yield session
            await session.rollback()


@pytest_asyncio.fixture
async def client(db: AsyncSession):
    """Async HTTP test client with the DB session injected."""
    async def _override_db():
        yield db

    app.dependency_overrides[get_db] = _override_db

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Clock fixture
# ---------------------------------------------------------------------------

FIXED_NOW = datetime(2026, 9, 26, 0, 0, 0, tzinfo=timezone.utc)


@pytest.fixture
def fixed_clock():
    """Inject a fixed clock at 2026-09-26T00:00:00Z."""
    clock = FixedClock(FIXED_NOW)
    set_clock(clock)
    yield clock
    set_clock(None)  # restore SystemClock


# ---------------------------------------------------------------------------
# Admin headers
# ---------------------------------------------------------------------------

@pytest.fixture
def admin_headers():
    return {"X-API-Key": os.environ["ADMIN_API_KEY"]}
