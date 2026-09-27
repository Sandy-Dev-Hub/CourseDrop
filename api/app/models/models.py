"""SQLAlchemy ORM models — matches the CourseDrop data model exactly."""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    Index,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


# ---------------------------------------------------------------------------
# Platforms
# ---------------------------------------------------------------------------
class Platform(Base):
    __tablename__ = "platforms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    base_url: Mapped[str] = mapped_column(Text, nullable=False)
    affiliate_url_template: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    courses: Mapped[list["Course"]] = relationship("Course", back_populates="platform")


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------
class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    parent_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("categories.id"), nullable=True)

    parent: Mapped["Category | None"] = relationship("Category", remote_side="Category.id")
    courses: Mapped[list["CourseCategory"]] = relationship("CourseCategory", back_populates="category")


# ---------------------------------------------------------------------------
# Courses
# ---------------------------------------------------------------------------
class Course(Base):
    __tablename__ = "courses"
    __table_args__ = (
        UniqueConstraint("platform_id", "slug", name="uq_courses_platform_slug"),
        UniqueConstraint("platform_id", "platform_course_id", name="uq_courses_platform_course_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    platform_id: Mapped[int] = mapped_column(Integer, ForeignKey("platforms.id"), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), nullable=False)
    platform_course_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    course_url: Mapped[str] = mapped_column(Text, nullable=False)

    # Status
    status: Mapped[str] = mapped_column(
        String(32),
        CheckConstraint("status IN ('ACTIVE','DELISTED','UNKNOWN')", name="ck_courses_status"),
        nullable=False,
        default="ACTIVE",
    )

    # Delisting tracking
    consecutive_misses: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_checked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Timestamps — all set from injected clock
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    platform: Mapped["Platform"] = relationship("Platform", back_populates="courses")
    categories: Mapped[list["CourseCategory"]] = relationship("CourseCategory", back_populates="course")
    offers: Mapped[list["Offer"]] = relationship("Offer", back_populates="course")


class CourseCategory(Base):
    __tablename__ = "course_categories"
    __table_args__ = (
        UniqueConstraint("course_id", "category_id", name="uq_course_categories"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), nullable=False)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id"), nullable=False)

    course: Mapped["Course"] = relationship("Course", back_populates="categories")
    category: Mapped["Category"] = relationship("Category", back_populates="courses")


# ---------------------------------------------------------------------------
# Offers
# ---------------------------------------------------------------------------
class Offer(Base):
    __tablename__ = "offers"
    __table_args__ = (
        UniqueConstraint("source", "source_reference", name="uq_offers_source_ref"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), nullable=False)

    # Source
    source: Mapped[str] = mapped_column(
        String(32),
        CheckConstraint("source IN ('seed','manual','impact_feed')", name="ck_offers_source"),
        nullable=False,
    )
    source_reference: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # Status
    status: Mapped[str] = mapped_column(
        String(32),
        CheckConstraint(
            "status IN ('ACTIVE','SCHEDULED','EXPIRED','NEEDS_REVIEW','INVALID')",
            name="ck_offers_status",
        ),
        nullable=False,
        default="NEEDS_REVIEW",
    )
    invalid_reason: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Pricing — Numeric(12,2), never float
    original_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    offer_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    discount_percentage: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_free: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # Promo
    promo_code: Mapped[str | None] = mapped_column(String(128), nullable=True)

    # Tracking
    tracking_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Scheduling
    starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Timestamps — all set from injected clock
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    course: Mapped["Course"] = relationship("Course", back_populates="offers")
    audit_events: Mapped[list["AuditEvent"]] = relationship("AuditEvent", back_populates="offer")


# ---------------------------------------------------------------------------
# Click Events
# ---------------------------------------------------------------------------
class ClickEvent(Base):
    __tablename__ = "click_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    offer_id: Mapped[int] = mapped_column(Integer, ForeignKey("offers.id"), nullable=False)
    # NO ip_address, NO user_agent stored
    session_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    referrer_path: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


# ---------------------------------------------------------------------------
# Collections
# ---------------------------------------------------------------------------
class Collection(Base):
    __tablename__ = "collections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    items: Mapped[list["CollectionItem"]] = relationship("CollectionItem", back_populates="collection")


class CollectionItem(Base):
    __tablename__ = "collection_items"
    __table_args__ = (
        UniqueConstraint("collection_id", "course_id", name="uq_collection_items"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    collection_id: Mapped[int] = mapped_column(Integer, ForeignKey("collections.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    collection: Mapped["Collection"] = relationship("Collection", back_populates="items")
    course: Mapped["Course"] = relationship("Course")


# ---------------------------------------------------------------------------
# Audit Events
# ---------------------------------------------------------------------------
class AuditEvent(Base):
    __tablename__ = "audit_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    offer_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("offers.id"), nullable=True)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False)
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False)
    old_status: Mapped[str | None] = mapped_column(String(32), nullable=True)
    new_status: Mapped[str | None] = mapped_column(String(32), nullable=True)
    event_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    offer: Mapped["Offer | None"] = relationship("Offer", back_populates="audit_events")


# ---------------------------------------------------------------------------
# Sync Runs
# ---------------------------------------------------------------------------
class SyncRun(Base):
    __tablename__ = "sync_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    job_name: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(
        String(32),
        CheckConstraint("status IN ('running','success','failed')", name="ck_sync_runs_status"),
        nullable=False,
    )
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    rows_processed: Mapped[int | None] = mapped_column(Integer, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
