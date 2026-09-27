"""Public offers API routes."""
from __future__ import annotations

import hashlib
import logging
import math
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.clock import get_clock
from app.core.config import get_settings
from app.core.database import get_db
from app.models.models import Category, ClickEvent, Course, CourseCategory, Offer
from app.schemas.schemas import ClickOut, OfferListResponse, OfferOut
from app.services.offer_validator import validate_tracking_url

logger = logging.getLogger(__name__)

router = APIRouter(tags=["offers"])


def _hash_ip(ip: str | None) -> str | None:
    if not ip:
        return None
    # Anonymize IP by hashing with a salt
    return hashlib.sha256(f"coursedrop_ip_{ip}".encode("utf-8")).hexdigest()[:32]


@router.get("/offers", response_model=OfferListResponse)
async def list_offers(
    category: Optional[str] = Query(None, description="Category slug"),
    search: Optional[str] = Query(None, description="Search keyword in title or headline"),
    is_free: Optional[bool] = Query(None, description="Filter for 100% free / free access offers"),
    min_discount: Optional[float] = Query(None, description="Minimum discount percentage"),
    sort: str = Query("featured", description="Sort order: featured, newest, discount_desc, rating"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
):
    """List active offers with filtering, search, and pagination."""
    query = (
        select(Offer)
        .join(Offer.course, isouter=True)
        .where(Offer.status == "ACTIVE")
        .options(
            selectinload(Offer.course).selectinload(Course.categories)
        )
    )

    if category:
        query = query.join(Course.course_categories).join(CourseCategory.category).where(Category.slug == category)

    if is_free:
        query = query.where(or_(Offer.offer_type == "FREE_ACCESS", Offer.discount_percentage == 100.0))

    if min_discount is not None:
        query = query.where(Offer.discount_percentage >= min_discount)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.where(
            or_(
                Offer.headline.ilike(term),
                Offer.coupon_code.ilike(term),
                Course.title.ilike(term),
                Course.description.ilike(term),
            )
        )

    # Sorting
    if sort == "newest":
        query = query.order_by(Offer.created_at.desc())
    elif sort == "discount_desc":
        query = query.order_by(Offer.discount_percentage.desc().nullslast())
    elif sort == "rating":
        query = query.order_by(Course.rating.desc().nullslast())
    else:  # featured
        query = query.order_by(Offer.discount_percentage.desc().nullslast(), Offer.created_at.desc())

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_res = await db.execute(count_query)
    total = total_res.scalar_one() or 0

    # Paginate
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


@router.get("/offers/{offer_id}", response_model=OfferOut)
async def get_offer(offer_id: int, db: AsyncSession = Depends(get_db)):
    """Get single offer details."""
    query = (
        select(Offer)
        .where(Offer.id == offer_id)
        .options(
            selectinload(Offer.course).selectinload(Course.categories)
        )
    )
    result = await db.execute(query)
    offer = result.scalar_one_or_none()
    if offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer


@router.get("/offers/{offer_id}/click")
async def click_offer(
    offer_id: int,
    request: Request,
    redirect: bool = Query(True, description="Whether to return 307 redirect or JSON with redirect_url"),
    db: AsyncSession = Depends(get_db),
):
    """Click tracking endpoint: logs anonymous ClickEvent and redirects to verified tracking URL."""
    query = select(Offer).where(Offer.id == offer_id)
    result = await db.execute(query)
    offer = result.scalar_one_or_none()
    if offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")

    settings = get_settings()
    allowed_hosts = [h.strip() for h in settings.ALLOWED_TRACKING_HOSTS.split(",") if h.strip()]

    # Security check: verify destination
    ok, err = validate_tracking_url(offer.tracking_url, allowed_hosts)
    if not ok:
        logger.warning(f"Blocked untrusted click redirect for offer {offer_id}: {err}")
        raise HTTPException(status_code=400, detail="Invalid or untrusted tracking URL")

    # Record anonymous click event
    clock_now = get_clock().now()
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    referer = request.headers.get("referer")

    click_event = ClickEvent(
        offer_id=offer.id,
        clicked_at=clock_now,
        user_agent=user_agent[:512] if user_agent else None,
        referer=referer[:512] if referer else None,
        ip_hash=_hash_ip(client_ip),
    )
    db.add(click_event)
    await db.commit()

    if redirect:
        return RedirectResponse(url=offer.tracking_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT)
    else:
        return ClickOut(redirect_url=offer.tracking_url)
