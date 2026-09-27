# CourseDrop — Coursera Deals & Free Courses Platform

CourseDrop is an automated platform for discovering, verifying, and tracking discounts, promotion codes, and 100% free courses on Coursera.

Built with **FastAPI** (Python async backend), **Next.js 15 & React** (modern frontend), **PostgreSQL**, and background jobs for continuous catalog sync, delisting verification, and affiliate offer sweeps.

---

## Key Architecture & Features

- **Automated Coursera Catalog Integration**: Uses the public Coursera Catalog API (`courses.v1`) to sync course titles, slugs, descriptions, and categories.
- **Delisting & Availability Checks**: Actively queries course slugs. If a course returns 3 consecutive 404s, it is automatically marked `DELISTED` and all associated active/scheduled deals are cascaded to `INVALID(course_delisted)`.
- **Offer Engine & Math Sanity**: Validates discount math (`discounted_price <= original_price`, `0 <= discount_percentage <= 100`, free deals mapped to 100% / $0).
- **FTC Affiliate Compliance**: Clear affiliate disclosures across the site footer, offer cards, and dedicated `/legal` policy pages.
- **Security & Tracking Domain Safeguards**:
  - `ALLOWED_TRACKING_HOSTS`: Outbound redirects are strictly checked against allowed tracking hostnames to prevent open redirect vulnerabilities.
  - Constant-time secret comparison and IP brute-force throttling for `ADMIN_API_KEY`.
  - Anonymized click event logging (salted SHA-256 IP hashing, user agent, referer).
  - Strict production CORS guards preventing wildcard configurations.

---

## Tech Stack

- **Backend**: FastAPI (Python 3.12+), SQLAlchemy 2.0 (async), Alembic, Pydantic v2, APScheduler.
- **Frontend**: Next.js 15 (App Router), React, TypeScript, TailwindCSS, Vitest.
- **Database**: PostgreSQL 15+.
- **Deployment**: Docker, Docker Compose, Render (`render.yaml`).

---

## Getting Started Locally

### Prerequisites
- Docker & Docker Compose (or Python 3.12+ and Node.js 20+)

### Running with Docker Compose

1. Clone the repository and copy the environment template:
```bash
cp .env.example .env
```

2. Start all services (Postgres, FastAPI API, Next.js Web):
```bash
docker compose up --build
```

3. Open the web interface at `http://localhost:3000` and API documentation at `http://localhost:8000/api/docs`.

### Running Tests

#### Backend Test Suite (Pytest)
```bash
cd api
python -m pytest
```

#### Frontend Test Suite (Vitest)
```bash
cd web
npm test
```

---

## Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Async PostgreSQL connection string | `postgresql+asyncpg://...` |
| `APP_ENV` | Application environment (`development`, `test`, `production`) | `development` |
| `ADMIN_API_KEY` | Secret key for administrative endpoints | Minimum 32 chars in production |
| `ALLOWED_TRACKING_HOSTS` | Comma-separated list of approved affiliate redirect domains | `track.example.test, coursera.org` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed CORS origins | `http://localhost:3000` |
| `SCHEDULER_ENABLED` | Enable background scheduler | `true` / `false` |

---

## License & Compliance

CourseDrop is operated in compliance with the FTC Affiliate Marketing guidelines. Coursera and associated logos are trademarks of Coursera, Inc.
