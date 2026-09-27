"""Public courses API routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import Course, Offer
from app.schemas.schemas import CourseOut, OfferOut

router = APIRouter(tags=["courses"])


@router.get("/courses/{slug}", response_model=CourseOut)
async def get_course_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """Get single course by slug with active offers."""
    query = (
        select(Course)
        .where(Course.slug == slug)
        .options(selectinload(Course.categories))
    )
    result = await db.execute(query)
    course = result.scalar_one_or_none()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
