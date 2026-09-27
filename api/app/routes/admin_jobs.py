"""Admin job trigger endpoints."""
from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.security import require_admin_key

router = APIRouter(tags=["admin"], dependencies=[Depends(require_admin_key)])
