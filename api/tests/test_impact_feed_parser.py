"""Unit tests for Impact feed parser."""
from __future__ import annotations

from decimal import Decimal

from app.services.offer_sources.impact_feed import parse_impact_feed_payload


def test_parse_impact_feed_payload():
    raw_deals = [
        {
            "id": "deal_001",
            "name": "50% off Python Specialization",
            "description": "Learn python at half price",
            "promo_code": "PYTHON50",
            "tracking_url": "https://track.example.test/python",
            "course_slug": "python-for-everybody",
            "OriginalPrice": "$79.00",
            "DiscountPrice": "$39.50",
            "DiscountPercent": "50%",
            "start_date": "2026-09-01T00:00:00Z",
            "end_date": "2026-10-01T00:00:00Z",
        },
        {
            "CampaignId": "free_002",
            "headline": "Free Machine Learning Course",
            "TrackingUrl": "https://track.example.test/ml",
            "slug": "machine-learning",
            "DiscountPercent": "100",
        },
    ]

    items = parse_impact_feed_payload(raw_deals)
    assert len(items) == 2

    # Item 1
    i1 = items[0]
    assert i1.source_item_id == "deal_001"
    assert i1.headline == "50% off Python Specialization"
    assert i1.coupon_code == "PYTHON50"
    assert i1.course_slug == "python-for-everybody"
    assert i1.original_price == Decimal("79.00")
    assert i1.discounted_price == Decimal("39.50")
    assert i1.discount_percentage == 50.0
    assert i1.valid_from is not None
    assert i1.valid_to is not None

    # Item 2 (Free access)
    i2 = items[1]
    assert i2.source_item_id == "free_002"
    assert i2.offer_type == "FREE_ACCESS"
    assert i2.discount_percentage == 100.0
    assert i2.course_slug == "machine-learning"
