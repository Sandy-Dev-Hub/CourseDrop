"""Admin job trigger and monitoring routes."""
from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import require_admin_key
from app.jobs.check_delisting import run_check_delisting
from app.jobs.purge import run_purge
from app.jobs.reverify import run_reverify
from app.jobs.sync_catalog import run_sync_catalog
from app.jobs.sync_offers import run_sync_offers
from app.models.models import AuditEvent, SyncRun
from app.schemas.schemas import AuditEventOut, SyncRunOut

logger = logging.getLogger(__name__)

router = APIRouter(tags=["admin_jobs"], dependencies=[Depends(require_admin_key)])

_JOB_HANDLERS = {
    "sync_catalog": run_sync_catalog,
    "check_delisting": run_check_delisting,
    "sync_offers": run_sync_offers,
    "reverify": run_reverify,
    "purge": run_purge,
}


@router.post("/jobs/{job_name}/run")
async def trigger_job(
    job_name: str,
    db: AsyncSession = Depends(get_db),
):
    """Manually run a background maintenance or sync job."""
    if job_name not in _JOB_HANDLERS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown job '{job_name}'. Valid jobs: {list(_JOB_HANDLERS.keys())}",
        )

    handler = _JOB_HANDLERS[job_name]
    try:
        await handler(db)
        return {"status": "success", "job": job_name, "message": f"Job '{job_name}' completed successfully."}
    except Exception as exc:
        logger.exception(f"Job {job_name} failed: {exc}")
        raise HTTPException(status_code=500, detail=f"Job execution failed: {exc}")


@router.get("/sync-runs", response_model=list[SyncRunOut])
async def list_sync_runs(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List recent job sync runs and statuses."""
    result = await db.execute(
        select(SyncRun).order_by(SyncRun.started_at.desc()).limit(limit)
    )
    return result.scalars().all()


@router.get("/audit-events", response_model=list[AuditEventOut])
async def list_audit_events(
    offer_id: Optional[int] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """List recent audit log events."""
    query = select(AuditEvent).order_by(AuditEvent.created_at.desc())
    if offer_id is not None:
        query = query.where(AuditEvent.offer_id == offer_id)
    query = query.limit(limit)
    result = await db.execute(query)
    return result.scalars().all()
