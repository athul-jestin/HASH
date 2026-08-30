#!/bin/sh
set -e

echo "Applying database migrations..."
alembic -c backend/alembic.ini upgrade head

echo "Seeding admin user..."
python -m backend.scripts.seed_admin

echo "Starting server..."
exec uvicorn backend.main:app --host 0.0.0.0 --port 5000
