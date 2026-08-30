# HASH

A cloud-based video streaming learning platform with an AI chatbot.

- **Backend** — FastAPI (Python 3.12), Supabase Postgres via async SQLAlchemy + Alembic, Supabase Storage for images/video, OpenAI-powered chatbot.
- **Frontend** — React 18 + TypeScript, Vite, Tailwind CSS, Rematch (Redux) + React Query.

Both apps are Dockerized and run together via `docker-compose.yml`.

## Prerequisites

- Docker + Docker Compose (for the containerized path), or Python 3.12 and Node.js (for local dev)
- A [Supabase](https://supabase.com) project (see below)
- An OpenAI API key

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) and set a database password.
2. **Database → Project Settings → Database**: copy the **Session pooler** connection string (not the Transaction pooler — the backend uses `asyncpg`, which needs prepared-statement support the transaction pooler doesn't provide). Change its scheme to `postgresql+asyncpg://` and substitute your password.
3. **Project Settings → API**: copy the `Project URL` and the `service_role` key (not `anon`).
4. **Storage**: create two buckets — `images` (**public**) and `videos` (**private**).

No manual table or RLS setup is needed — the schema is entirely Alembic-managed, and the backend connects with the service-role key directly.

## 2. Configure environment variables

Copy the example env file at the repo root (not inside `backend/` or `frontend/`):

```
cp .env.example .env
```

Fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase Postgres connection string, `postgresql+asyncpg://...`, via the Session pooler |
| `SUPABASE_URL` | Project URL from Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key from Project Settings → API |
| `SUPABASE_BUCKET_IMAGES` | Storage bucket for images (default `images`) |
| `SUPABASE_BUCKET_VIDEOS` | Storage bucket for videos (default `videos`) |
| `SUPABASE_SIGNED_URL_EXPIRY_SECONDS` | TTL for signed video URLs (default `3600`) |
| `JWT_SECRET` | Any random secret string, e.g. `openssl rand -hex 32` |
| `OPENAI_API_KEY` | OpenAI API key for the chatbot |
| `VITE_API_URL` | Frontend's API base URL, default `http://localhost:5000/api` |
| `ADMIN_FULL_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Optional — if all three are set, an admin user is seeded automatically on first startup (see below). Leave blank to skip. |

## 3. Run with Docker

```
make build_up    # build + start both containers (backend :5000, frontend :3000)
make down        # stop containers
make logs        # tail logs
make restart     # docker compose down && up -d
make clean       # remove containers, networks, images, volumes
make reset-data  # DESTRUCTIVE: wipe all DB rows and all Supabase storage files
```

That's it — `make build_up` is the only command needed. On startup, the backend container runs `backend/prestart.sh`, which:

1. Applies all pending Alembic migrations (`alembic upgrade head`).
2. Seeds the admin user from `ADMIN_FULL_NAME`/`ADMIN_EMAIL`/`ADMIN_PASSWORD`, if set and not already present (idempotent — safe to restart the stack repeatedly).
3. Starts uvicorn.

So a new dev can clone the repo, fill in `.env`, and run `make build_up` — no manual migration step or admin bootstrapping required.

`make reset-data` truncates every table and empties both Supabase storage buckets — useful for getting back to a clean slate during development. It's irreversible and asks for interactive `yes` confirmation before doing anything; the schema itself is untouched (no need to re-run migrations after), but you will need to reseed the admin user afterward (`make restart` does this automatically since the seed step runs on every container start).

## 4. Local development (without Docker)

**Backend** (from repo root):

```
pip install -r backend/requirements.txt
alembic -c backend/alembic.ini upgrade head   # prestart.sh isn't used outside Docker — run this manually
python -m backend.scripts.seed_admin          # optional, seeds the admin user from .env
uvicorn backend.main:app --reload --port 5000
```

After changing a model, generate a new migration and review it before applying:

```
alembic -c backend/alembic.ini revision --autogenerate -m "..."
```

**Frontend** (from `frontend/`):

```
npm install
npm run dev          # vite dev server on :3000
npm run build         # tsc && vite build
npm run lint          # eslint . --ext ts,tsx
npm run type-check    # tsc --noEmit
```

There is no configured test suite for either app yet.

## Project structure

```
backend/
  api/endpoints/   # categories, chatbot, movies, upload, users
  core/            # settings, database engine, security
  models/          # SQLAlchemy models (User, Category, Movie, MovieCast, Review, Favorite)
  schemas/         # Pydantic v2 schemas (camelCase JSON contract via CamelModel)
  alembic/         # migrations
  supabase_storage.py

frontend/
  src/
    pages/, components/, contexts/, services/, redux/, hooks/
```

See `CLAUDE.md` for a deeper architectural walkthrough.
