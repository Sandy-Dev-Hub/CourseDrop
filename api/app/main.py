"""CourseDrop API — Application entry point."""
from __future__ import annotations

import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import engine, Base
from app.routes import health, admin_offers, admin_jobs, admin_collections, public_courses


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    # Validate settings at startup — will sys.exit(1) on failure
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

    # CORS
    origins = [o.strip() for o in settings.CORS_ALLOWED_ORIGINS.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
        allow_headers=["Content-Type", "X-API-Key"],
    )

    # Routes
    app.include_router(health.router, prefix="/api")
    app.include_router(public_courses.router, prefix="/api")
    app.include_router(admin_offers.router, prefix="/api/admin")
    app.include_router(admin_jobs.router, prefix="/api/admin")
    app.include_router(admin_collections.router, prefix="/api/admin")

    return app


app = create_app()
