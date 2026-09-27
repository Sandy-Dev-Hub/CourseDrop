"""Public categories API routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.models import Category, Course, CourseCategory, Offer
from app.schemas.schemas import CategoryOut

router = APIRouter(tags=["categories"])


@router.get("/categories", response_model=list[CategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db)):
    """List all categories along with count of currently active offers."""
    query = (
        select(
            Category,
            func.count(Offer.id).label("offer_count"),
        )
        .outerjoin(CourseCategory, Category.id == CourseCategory.category_id)
        .outerjoin(Course, CourseCategory.course_id == Course.id)
        .outerjoin(
            Offer,
            (Course.id == Offer.course_id) & (Offer.status == "ACTIVE"),
        )
        .group_by(Category.id)
        .order_by(Category.name.asc())
    )
    result = await db.execute(query)
    rows = result.all()

    cats: list[CategoryOut] = []
    for cat, count in rows:
        cats.append(
            CategoryOut(
                id=cat.id,
                slug=cat.slug,
                name=cat.name,
                description=cat.description,
                offer_count=count or 0,
            )
        )
    return cats
