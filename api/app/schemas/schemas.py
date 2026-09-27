"""Pydantic schemas for CourseDrop API."""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class CategoryOut(BaseModel):
    id: int
    slug: str
    name: str
    description: str | None = None
    offer_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class CourseOut(BaseModel):
    id: int
    slug: str
    platform_id: int
    title: str
    description: str | None = None
    image_url: str | None = None
    course_url: str
    rating: float | None = None
    enrollment_count: int | None = None
    status: str
    categories: list[CategoryOut] = []

    model_config = ConfigDict(from_attributes=True)


class OfferOut(BaseModel):
    id: int
    course_id: int | None = None
    course: CourseOut | None = None
    source: str
    offer_type: str
    headline: str
    description: str | None = None
    coupon_code: str | None = None
    original_price: Decimal | None = None
    discounted_price: Decimal | None = None
    discount_percentage: float | None = None
    currency: str = "USD"
    valid_from: datetime | None = None
    valid_to: datetime | None = None
    status: str
    invalid_reason: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OfferListResponse(BaseModel):
    items: list[OfferOut]
    total: int
    page: int
    page_size: int
    total_pages: int


class OfferCreateIn(BaseModel):
    course_slug: str | None = None
    course_title: str | None = None
    course_url: str | None = None
    offer_type: str = "PERCENTAGE"
    headline: str
    description: str | None = None
    coupon_code: str | None = None
    tracking_url: str
    original_price: Decimal | None = None
    discounted_price: Decimal | None = None
    discount_percentage: float | None = None
    currency: str = "USD"
    valid_from: datetime | None = None
    valid_to: datetime | None = None


class OfferUpdateIn(BaseModel):
    headline: str | None = None
    description: str | None = None
    coupon_code: str | None = None
    status: str | None = None
    original_price: Decimal | None = None
    discounted_price: Decimal | None = None
    discount_percentage: float | None = None
    valid_from: datetime | None = None
    valid_to: datetime | None = None


class ClickOut(BaseModel):
    redirect_url: str


class SyncRunOut(BaseModel):
    id: int
    job_name: str
    status: str
    started_at: datetime
    finished_at: datetime | None = None
    rows_processed: int
    error_message: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AuditEventOut(BaseModel):
    id: int
    offer_id: int | None = None
    entity_type: str
    entity_id: int
    event_type: str
    old_status: str | None = None
    new_status: str | None = None
    event_metadata: dict[str, Any] | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
