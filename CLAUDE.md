# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

HASH is a cloud-based video streaming learning project with an AI chatbot. It is a monorepo with two apps:

- `backend/` — FastAPI (Python 3.12), Supabase Postgres via SQLAlchemy (async) + Alembic, Supabase Storage, OpenAI chatbot integration.
- `frontend/` — React 18 + TypeScript, Vite, Tailwind CSS, Rematch (Redux) + React Query.

Both are Dockerized and run together via `docker-compose.yml`.

## Commands

### Docker (whole stack)
```
make build_up   # build + start both containers (backend :5000, frontend :3000)
make down       # stop containers
make logs       # tail logs
make restart    # docker compose down && up -d
make clean      # remove containers, networks, images, volumes
```

### Backend (from repo root)
```
pip install -r backend/requirements.txt
alembic -c backend/alembic.ini upgrade head     # apply DB migrations, run from repo root
uvicorn backend.main:app --reload --port 5000   # run from repo root, not backend/
```
New migration after changing a model: `alembic -c backend/alembic.ini revision --autogenerate -m "..."`, then review the generated file before applying it.

There is no configured linter, formatter, or test suite for the backend — don't assume `pytest`, `ruff`, `black`, etc. are available unless you check `requirements.txt` first.

### Frontend (from `frontend/`)
```
npm install
npm run dev          # vite dev server on :3000
npm run build         # tsc && vite build
npm run lint          # eslint . --ext ts,tsx
npm run type-check    # tsc --noEmit
```
There is no test suite configured for the frontend either.

### Environment
Copy `.env.example` to `.env` at the repo root (not inside `backend/` or `frontend/`) before running anything. Required: `DATABASE_URL` (Supabase Postgres, `postgresql+asyncpg://...`, via the Session pooler — not the Transaction pooler, which breaks asyncpg's prepared statements), `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `OPENAI_API_KEY`. See `backend/core/config.py` for the full settings model.

Supabase setup (one-time, in the dashboard): create a project, create two Storage buckets — `images` (public) and `videos` (private) — and copy the Session pooler connection string, service role key, and project URL into `.env`. Schema is entirely Alembic-managed; no manual table or RLS setup is needed since the backend talks to Postgres directly with the service-role connection.

## Backend architecture

- **Entry point**: `backend/main.py` builds the FastAPI app via a `lifespan` context manager (DB connectivity check on startup, engine/HTTP-client disposal on shutdown), wires CORS (wide open, `allow_origins=["*"]`), and mounts `api_router`.
- **Routing**: `backend/api/api.py` mounts one router per domain under the `/api` prefix: `categories`, `chatbot`, `movies`, `upload`, `users` (each in `backend/api/endpoints/`).
- **Database access**: `backend/core/database.py` holds the async SQLAlchemy engine/sessionmaker and a `get_db()` FastAPI dependency; every endpoint takes `db: AsyncSession = Depends(get_db)`. Models live in `backend/models/` (`User`, `Category`, `Movie`, `MovieCast`, `Review`, `Favorite`), all with Python-side UUID primary keys and `created_at`/`updated_at` via `TimestampMixin` (`backend/models/base.py`). Migrations live in `backend/alembic/`, driven by `backend/alembic.ini` (invoke as `alembic -c backend/alembic.ini <cmd>` from repo root).
- **Auth**: JWT bearer tokens (`backend/core/security.py`, HS256, 1-day expiry) — unchanged by the Supabase rework, it's just Postgres-backed now. `backend/dependencies.py` provides `get_current_user` / `get_current_admin` as FastAPI dependencies — they decode the token and load the `User` ORM object via `db.get()`. Admin-only routes depend on `get_current_admin`, either via `dependencies=[Depends(get_current_admin)]` on the route decorator (when the handler doesn't need the admin's data) or injected as a handler param (when it does) — see `movies.py`/`users.py` for both patterns.
- **Schemas** (`backend/schemas/`): Pydantic v2 models. `backend/schemas/base.py`'s `CamelModel` (`alias_generator=to_camel`, `populate_by_name=True`, `from_attributes=True`) is the base for every schema with a multi-word field — it lets snake_case ORM columns serialize as the camelCase JSON keys the frontend expects (`fullName`, `titleImage`, …) while still accepting snake_case on input. Any new schema field with more than one word needs this base, or the frontend contract silently breaks.
- **Storage** (`backend/supabase_storage.py`): plain `httpx` calls to the Supabase Storage REST API, authorized with the service-role key. Two buckets: `images` (public — `get_public_url()` is pure string construction) and `videos` (private — `create_signed_url()` makes a signing call, expiry from `SUPABASE_SIGNED_URL_EXPIRY_SECONDS`). **Models/DB store the storage *path*, never a URL** — signed URLs expire, so they're resolved at read time, not persisted. Movie video URLs are only signed on `GET /movies/{id}`; list endpoints (`/movies`, `/movies/rated/top`, `/movies/random/all`, `/users/favorites`) return `video: null` to avoid N signing calls per page.
- **Upload**: split into `POST /upload/image` and `POST /upload/video` (`backend/api/endpoints/upload.py`) rather than one generic endpoint, since each targets a different bucket with its own content-type guard. Response is `{path, url}` — `path` is what gets persisted into movie/user/cast fields; `url` is a transient preview link only (expires for video).
- **Chatbot** (`backend/api/endpoints/chatbot.py`): thin wrapper around the OpenAI chat completions API (`gpt-3.5-turbo`), no DB involvement — untouched by the Supabase rework.

## Frontend architecture

- **Path aliases**: `@`, `@components`, `@pages`, `@services`, `@redux`, `@contexts`, `@utils`, `@hooks`, `@types` are defined in **both** `vite.config.ts` and `tsconfig.json`. If you add a new alias, update both files or the build/type-check will disagree.
- **Routing**: React Router v6 in `src/App.tsx`, all pages lazy-loaded via `React.lazy`. `/dashboard/*` and `/chatbot` are wrapped in `ProtectedRoute`.
- **Auth**: `src/contexts/AuthContext.tsx` holds `user`/`token` in React state, persisted to `localStorage` (`token`, `user` keys). `ProtectedRoute` (`src/components/ProtectedRoute.tsx`) redirects to `/login` when unauthenticated, and supports a `requiredRoles` check against `user.isAdmin`.
- **HTTP layer**: `src/services/api.ts` is a single Axios instance (`VITE_API_URL`, default `http://localhost:5000/api`). A request interceptor injects `Authorization: Bearer <token>` from `localStorage`; a response interceptor centralizes error handling — 401 clears storage and hard-redirects to `/login`, 403/5xx/network errors show a `react-hot-toast` toast. Don't duplicate this error handling in individual components/services.
- **Data fetching**: domain-specific service modules in `src/services/` (`movies.ts`, `users.ts`, `categories.ts`, `chatbot.ts`) wrap the Axios instance with typed methods. `src/hooks/useApi.ts` wraps these in `@tanstack/react-query`'s `useQuery`/`useMutation`. `QueryClientProvider` is set up in `src/main.tsx`.
- **Global/client state**: Rematch (Redux wrapper) with the immer plugin, not React Query — used for state that isn't server data (e.g. modals, notifications, movie UI state). Models live in `src/redux/models/*.ts` and are combined in `src/redux/store.ts`; add new slices there.
- **Styling**: Tailwind CSS (`tailwind.config.ts`).
