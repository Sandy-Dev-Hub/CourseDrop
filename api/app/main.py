"""CourseDrop API — Application entry point."""
from __future__ import annotations

import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes import (
    admin_collections,
    admin_jobs,
    admin_offers,
    health,
    public_categories,
    public_courses,
    public_offers,
)


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    try:
        settings = get_settings()
    except Exception as exc:
        print(f"[CourseDrop] Configuration error: {exc}", file=sys.stderr)
        sys.exit(1)

    app = FastAPI(
        title="CourseDrop API",
        version="1.0.0",
        docs_url="/api/docs" if settings.APP_ENV != "production" else None,
        redoc_url=None,
    )

    # CORS configuration
    origins = [o.strip() for o in settings.CORS_ALLOWED_ORIGINS.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
        allow_headers=["Content-Type", "X-API-Key"],
    )

    # Health check
    app.include_router(health.router, prefix="/api")

    # Public API (v1)
    app.include_router(public_offers.router, prefix="/api/v1")
    app.include_router(public_categories.router, prefix="/api/v1")
    app.include_router(public_courses.router, prefix="/api/v1")

    # Admin API (v1)
    app.include_router(admin_offers.router, prefix="/api/v1/admin")
    app.include_router(admin_jobs.router, prefix="/api/v1/admin")
    app.include_router(admin_collections.router, prefix="/api/v1/admin")

    return app


app = create_app()
