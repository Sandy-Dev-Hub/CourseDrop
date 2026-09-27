# CourseDrop V1 — Architecture Decisions

| # | Decision | Reason |
|---|----------|--------|
| 1 | No Docker locally (Docker not installed) | Python 3.14.1 and Node 24.13.0 available natively; compose files written for CI/production |
| 2 | Python 3.14.1 used (spec says 3.12+) | 3.14 is compatible; no 3.12-specific syntax required |
| 3 | No SQLite anywhere; PostgreSQL for all DB tests | TEXT[], JSON, and unique indexes behave differently in SQLite (per spec) |
| 4 | Enums stored as VARCHAR with CHECK constraints | Keeps Alembic migrations simple, avoids native enum migration complexity |
| 5 | Prices as Decimal (Numeric 12,2); discount uses ROUND_HALF_UP | Spec requirement; never float |
| 6 | CORS_ALLOWED_ORIGINS never '*' in production | Guard condition enforced at startup |
| 7 | Node 24 LTS for frontend (already installed) | Spec requires Node 24 LTS |
| 8 | next.js via create-next-app@latest | Spec requirement; use whatever Tailwind it generates |
| 9 | Advisory locks per-job in scheduler | Two instances must never run the same job simultaneously |
| 10 | `fetch` with keepalive:true for click events instead of sendBeacon | sendBeacon with JSON causes CORS problems (per spec) |
