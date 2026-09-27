"""Admin offers management routes."""
from __future__ import annotations

import math
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.clock import get_clock
from app.core.database import get_db
from app.core.security import require_admin_key
from app.models.models import Course, Offer
from app.schemas.schemas import OfferCreateIn, OfferListResponse, OfferOut, OfferUpdateIn
from app.services.audit import AuditService
from app.services.offer_ingester import OfferIngester
from app.services.offer_sources.base import RawOfferItem

router = APIRouter(tags=["admin_offers"], dependencies=[Depends(require_admin_key)])


@router.get("/offers", response_model=OfferListResponse)
async def admin_list_offers(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (ACTIVE, NEEDS_REVIEW, INVALID, SCHEDULED, EXPIRED)"),
    search: Optional[str] = Query(None, description="Search keyword"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Admin offer list with status filtering."""
    query = (
        select(Offer)
        .join(Offer.course, isouter=True)
        .options(selectinload(Offer.course).selectinload(Course.categories))
    )

    if status_filter:
        query = query.where(Offer.status == status_filter.upper())

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.where(
            Offer.headline.ilike(term) | Offer.coupon_code.ilike(term) | Course.title.ilike(term)
        )

    query = query.order_by(Offer.created_at.desc())

    count_query = select(func.count()).select_from(query.subquery())
    total_res = await db.execute(count_query)
    total = total_res.scalar_one() or 0

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    offers = result.scalars().all()

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return OfferListResponse(
        items=offers,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("/offers", response_model=OfferOut, status_code=status.HTTP_201_CREATED)
async def admin_create_offer(
    payload: OfferCreateIn,
    db: AsyncSession = Depends(get_db),
):
    """Admin manual offer creation."""
    clock_now = get_clock().now()
    raw_item = RawOfferItem(
        source_name="manual_admin",
        source_item_id=None,
        course_slug=payload.course_slug,
        course_title=payload.course_title,
        course_url=payload.course_url,
        offer_type=payload.offer_type,
        headline=payload.headline,
        description=payload.description,
        coupon_code=payload.coupon_code,
        tracking_url=payload.tracking_url,
        original_price=payload.original_price,
        discounted_price=payload.discounted_price,
        discount_percentage=payload.discount_percentage,
        currency=payload.currency,
        valid_from=payload.valid_from,
        valid_to=payload.valid_to,
    )

    ingester = OfferIngester(db, clock_now=clock_now)
    stats = await ingester.ingest_items([raw_item])

    if stats["invalid"] > 0:
        raise HTTPException(
            status_code=400,
            detail="Offer validation failed (check prices, dates, or tracking URL domain).",
        )

    # Find the created offer
    res = await db.execute(
        select(Offer)
        .where(Offer.tracking_url == payload.tracking_url)
        .order_by(Offer.id.desc())
        .options(selectinload(Offer.course).selectinload(Course.categories))
    )
    created = res.scalars().first()
    await db.commit()
    return created


@router.patch("/offers/{offer_id}", response_model=OfferOut)
async def admin_update_offer(
    offer_id: int,
    payload: OfferUpdateIn,
    db: AsyncSession = Depends(get_db),
):
    """Admin override / status change for an offer."""
    clock_now = get_clock().now()
    query = (
        select(Offer)
        .where(Offer.id == offer_id)
        .options(selectinload(Offer.course).selectinload(Course.categories))
    )
    result = await db.execute(query)
    offer = result.scalar_one_or_none()
    if offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")

    audit = AuditService(db=db, clock_now=clock_now)
    old_status = offer.status

    if payload.headline is not None:
        offer.headline = payload.headline
    if payload.description is not None:
        offer.description = payload.description
    if payload.coupon_code is not None:
        offer.coupon_code = payload.coupon_code
    if payload.original_price is not None:
        offer.original_price = payload.original_price
    if payload.discounted_price is not None:
        offer.discounted_price = payload.discounted_price
    if payload.discount_percentage is not None:
        offer.discount_percentage = payload.discount_percentage
    if payload.valid_from is not None:
        offer.valid_from = payload.valid_from
    if payload.valid_to is not None:
        offer.valid_to = payload.valid_to

    if payload.status is not None and payload.status.upper() != old_status:
        offer.status = payload.status.upper()
        if offer.status == "ACTIVE":
            offer.invalid_reason = None
        await audit.log(
            entity_type="offer",
            entity_id=offer.id,
            offer_id=offer.id,
            event_type="admin_status_override",
            old_status=old_status,
            new_status=offer.status,
            event_metadata={"admin_override": True},
        )

    offer.updated_at = clock_now
    await db.commit()
    await db.refresh(offer)
    return offer
