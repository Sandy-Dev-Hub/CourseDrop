"""Tests for the Coursera catalog mapper (no DB required)."""
from __future__ import annotations

import pytest

from app.services.catalog_mapper import map_catalog_page, map_coursera_course
from app.services.category_matcher import extract_categories
from tests.fixtures.catalog_fixtures import (
    CATALOG_PAGE_7_COURSES,
    CS007_LOOKUP,
    MISSING_ELEMENTS_PAGE,
)


class TestCategoryMatcher:
    def test_known_domain(self):
        slugs = extract_categories([{"domainId": "data-science", "subdomainId": ""}])
        assert "data-science" in slugs

    def test_subdomain_takes_priority(self):
        slugs = extract_categories([{"domainId": "data-science", "subdomainId": "machine-learning"}])
        assert "machine-learning" in slugs
        # data-science should not appear when subdomain maps
        assert "data-science" not in slugs

    def test_unknown_domain_logged_not_fatal(self, caplog):
        import logging
        with caplog.at_level(logging.DEBUG, logger="app.services.category_matcher"):
            slugs = extract_categories([{"domainId": "unknown-domain", "subdomainId": "unknown-sub"}])
        assert slugs == []  # Nothing mapped, but no exception

    def test_empty_domain_types(self):
        slugs = extract_categories([])
        assert slugs == []

    def test_deduplication(self):
        slugs = extract_categories([
            {"domainId": "data-science", "subdomainId": "machine-learning"},
            {"domainId": "data-science", "subdomainId": "machine-learning"},
        ])
        assert slugs.count("machine-learning") == 1


class TestCatalogMapper:
    def test_maps_7_courses(self):
        courses = map_catalog_page(CATALOG_PAGE_7_COURSES)
        assert len(courses) == 7

    def test_cs007_null_fields_safe(self):
        """cs007 has null description, null image, empty domainTypes — must not crash."""
        courses = map_catalog_page(CATALOG_PAGE_7_COURSES)
        cs007 = next(c for c in courses if c.slug == "intro-python-programming-sample")
        assert cs007.description is None
        assert cs007.image_url is None
        assert cs007.category_slugs == []
        assert cs007.title == "Intro to Python Programming"

    def test_cs007_unknown_field_not_fatal(self, caplog):
        """Extra field 'unknownExtraField' on cs007 should be logged, not raise."""
        import logging
        with caplog.at_level(logging.DEBUG, logger="app.services.catalog_mapper"):
            courses = map_catalog_page(CATALOG_PAGE_7_COURSES)
        # Should still return cs007
        slugs = [c.slug for c in courses]
        assert "intro-python-programming-sample" in slugs

    def test_missing_elements_key_graceful(self):
        """Page with no 'elements' key returns empty list."""
        courses = map_catalog_page(MISSING_ELEMENTS_PAGE)
        assert courses == []

    def test_categories_mapped(self):
        """Machine learning course has 'machine-learning' category."""
        courses = map_catalog_page(CATALOG_PAGE_7_COURSES)
        ml_course = next(c for c in courses if c.slug == "machine-learning-specialization")
        assert "machine-learning" in ml_course.category_slugs

    def test_course_url_constructed(self):
        courses = map_catalog_page(CATALOG_PAGE_7_COURSES)
        py_course = next(c for c in courses if c.slug == "python-for-everybody")
        assert py_course.course_url == "https://www.coursera.org/learn/python-for-everybody"

    def test_missing_required_fields(self):
        """Course missing slug returns None."""
        result = map_coursera_course({"id": "x", "name": "no slug"})
        assert result is None

    def test_cs007_lookup_mapped(self):
        """Single-element elements array maps correctly."""
        # cs007 lookup response has one element in elements list
        from tests.fixtures.catalog_fixtures import CS007_LOOKUP
        course = map_coursera_course(CS007_LOOKUP["elements"][0])
        assert course is not None
        assert course.slug == "intro-python-programming-sample"
        assert course.description is None
