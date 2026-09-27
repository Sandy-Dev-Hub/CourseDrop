"""Audit event service — writes audit_events rows on every status change."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import AuditEvent


class AuditService:
    def __init__(self, db: AsyncSession, clock_now: datetime) -> None:
        self._db = db
        self._now = clock_now

    async def log(
        self,
        *,
        entity_type: str,
        entity_id: int,
        event_type: str,
        offer_id: int | None = None,
        old_status: str | None = None,
        new_status: str | None = None,
        event_metadata: dict | None = None,
    ) -> AuditEvent:
        event = AuditEvent(
            offer_id=offer_id,
            entity_type=entity_type,
            entity_id=entity_id,
            event_type=event_type,
            old_status=old_status,
            new_status=new_status,
            event_metadata=event_metadata,
            created_at=self._now,
        )
        self._db.add(event)
        return event
