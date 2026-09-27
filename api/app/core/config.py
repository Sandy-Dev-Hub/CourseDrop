"""Application configuration with startup validation."""
from __future__ import annotations

import sys
from functools import lru_cache
from typing import Annotated

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


EXAMPLE_HOST_PATTERNS = (".test", ".example", ".invalid")
EXAMPLE_HOST_PREFIXES = ("example.",)
RESERVED_HOSTS = ("localhost",)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Application
    APP_ENV: str = "development"
    SITE_URL: str = "http://localhost:3000"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://coursedrop:coursedrop@localhost:5432/coursedrop"

    # Security
    ADMIN_API_KEY: str = "dev-admin-key-change-me-in-production"
    CORS_ALLOWED_ORIGINS: str = "http://localhost:3000"

    # Offer sources
    OFFER_SOURCES: str = "seed,manual"  # comma-separated: seed, manual, impact_feed

    # Tracking
    ALLOWED_TRACKING_HOSTS: str = "track.example.test"  # comma-sep, operator sets in prod

    # Coursera
    COURSERA_CATALOG_URL: str = "https://api.coursera.org/api/courses.v1"
    COURSERA_SYNC_MAX_COURSES: int = 500

    # Description
    DESCRIPTION_EXCERPT_CHARS: int = 300

    # Images
    SHOW_COURSE_IMAGES: bool = False

    # Scheduler
    SCHEDULER_ENABLED: bool = False
    SYNC_CATALOG_HOURS: int = 24
    DELIST_CHECK_HOURS: int = 24
    SYNC_OFFERS_MINUTES: int = 60
    REVERIFY_MINUTES: int = 30

    # Proxy
    TRUSTED_PROXY_COUNT: int = 0

    # Internal
    API_INTERNAL_URL: str = "http://localhost:8000"
    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"

    @model_validator(mode="after")
    def _validate_production_config(self) -> "Settings":
        if self.APP_ENV != "production":
            return self

        errors: list[str] = []

        # (1) ALLOWED_TRACKING_HOSTS must not be empty
        tracking_hosts = [h.strip() for h in self.ALLOWED_TRACKING_HOSTS.split(",") if h.strip()]
        if not tracking_hosts:
            errors.append("ALLOWED_TRACKING_HOSTS must not be empty in production")

        # (2) No example/test/invalid hosts
        for host in tracking_hosts:
            if (
                any(host.endswith(p) for p in EXAMPLE_HOST_PATTERNS)
                or any(host.startswith(p) for p in EXAMPLE_HOST_PREFIXES)
                or host in RESERVED_HOSTS
            ):
                errors.append(
                    f"ALLOWED_TRACKING_HOSTS contains a non-production host: '{host}'"
                )

        # (3) ADMIN_API_KEY must be at least 32 chars
        if len(self.ADMIN_API_KEY) < 32:
            errors.append("ADMIN_API_KEY must be at least 32 characters in production")

        # (4) OFFER_SOURCES must not include 'seed'
        sources = [s.strip() for s in self.OFFER_SOURCES.split(",") if s.strip()]
        if "seed" in sources:
            errors.append("OFFER_SOURCES must not include 'seed' in production")

        # (5) CORS_ALLOWED_ORIGINS must not contain '*'
        if "*" in self.CORS_ALLOWED_ORIGINS:
            errors.append("CORS_ALLOWED_ORIGINS must not contain '*' in production")

        if errors:
            raise ValueError("Production configuration errors:\n" + "\n".join(f"  - {e}" for e in errors))

        return self


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
