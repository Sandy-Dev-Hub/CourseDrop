# CourseDrop V1 — Build Progress

**STATUS: ALL PHASES COMPLETE (100%)**

## Phase Checklist

- [x] **Phase 1** — Foundation
  - Config guards (10 tests ✅)
  - Clock abstraction (6 tests ✅)
  - AffiliateDisclosure & Legal components (4 tests ✅)
  - Database schema & Alembic migrations setup

- [x] **Phase 2** — Coursera Catalog
  - `CourseraCatalogClient` with `courses.v1` public API support (7 tests ✅)
  - Catalog mapper & category matcher with `cs007` edge case handling (13 tests ✅)
  - `sync_catalog` pagination job with capped sync protections
  - `check_delisting` by-slug lookup with 3-miss threshold & offer invalidation cascade
  - `purge` retention policy job

- [x] **Phase 3** — Offer Engine & Scheduler
  - `OfferValidator` for math sanity, discount %, date logic, tracking host security (10 tests ✅)
  - `ImpactFeedOfferSource` & `ManualOfferSource` (1 test ✅)
  - `OfferIngester` deduplication, fingerprinting, course resolution, and audit logging
  - `reverify` expiry & schedule sweep job
  - `scheduler.py` loop with PostgreSQL advisory locks

- [x] **Phase 4** — Affiliate, Events, Security
  - Click tracking endpoint (`/api/v1/offers/{id}/click`) with 307 redirect and anonymous SHA-256 IP hashing
  - Untrusted destination domain blocking via `ALLOWED_TRACKING_HOSTS`
  - Constant-time `ADMIN_API_KEY` verification with per-IP rate-limiting throttle
  - Strict production CORS guards

- [x] **Phase 5** — Public API & Frontend
  - Public `/offers`, `/offers/{id}`, `/categories`, `/courses/{slug}` endpoints
  - Admin management routes (`/admin/offers`, `/admin/jobs/{job_name}/run`, `/admin/sync-runs`, `/admin/audit-events`)
  - Next.js 15 App Router frontend:
    - Navbar, CategoryNav, SearchBar
    - `OfferCard` with pricing, discount badges, affiliate notices, and copy coupon button
    - Home (`/`), 100% Free (`/free`), Category pages (`/categories/[slug]`), Legal (`/legal`), Privacy (`/privacy`), Admin (`/admin`)
    - 10 Vitest frontend tests ✅

- [x] **Phase 6** — Hardening & Docs
  - 404 (`not-found.tsx`) and Error boundary (`error.tsx`) pages
  - SEO optimization (`robots.ts`, `sitemap.ts`, OpenGraph metadata)
  - Deployment assets: `Dockerfile` for API and Web, `docker-compose.yml`, `render.yaml`
  - Complete `README.md` documentation
