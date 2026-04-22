# Mini Issue Tracker

A simple full-stack issue tracking app built as a realistic test bed for [ApiLens](https://github.com/MariaC27/api-lens).

The goal is to have a real CRUD app with a meaningful FastAPI backend so ApiLens snapshot and diff workflows have something genuine to run against.

---

## Stack

- **Backend**: FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2, PostgreSQL
- **Auth**: Clerk (JWT verification on backend, `@clerk/nextjs` on frontend)
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Infrastructure**: Docker Compose (Postgres)

---

## What it does

- Create, view, edit, and delete issues
- Assign status (`open`, `in_progress`, `closed`) and priority (`low`, `medium`, `high`)
- Create color-coded labels and attach them to issues
- Filter the issue list by status or priority
- All actions require authentication via Clerk

---

## Project structure

```
mini-issue-tracker/
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── issues/    # Issue CRUD (models, service, router)
│   │   └── labels/    # Label CRUD (models, service, router)
│   └── alembic/       # Database migrations
├── frontend/          # Next.js app
│   ├── app/           # Pages (issue list, detail, create)
│   └── components/    # UI components
└── docker-compose.yml # Postgres
```

---

## Running locally

**Prerequisites**: Docker Desktop, Python 3.10+, Node.js 18+, a [Clerk](https://clerk.com) application.

**1. Database**
```bash
docker compose up -d
```

**2. Backend**
```bash
cd backend
cp .env.example .env          # fill in CLERK_JWKS_URL from Clerk dashboard
python3 -m venv .venv && source .venv/bin/activate
pip install -e "."
alembic upgrade head
uvicorn app.main:app --reload  # http://localhost:8000
```

**3. Frontend**
```bash
cd frontend
cp .env.local.example .env.local   # fill in Clerk publishable key + secret key
npm install
npm run dev                         # http://localhost:3000
```
