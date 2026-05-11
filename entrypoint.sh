#!/bin/sh
set -e

echo "[entrypoint] Syncing database schema..."
npx prisma db push --accept-data-loss

echo "[entrypoint] Seeding database if empty..."
npx prisma db seed

echo "[entrypoint] Starting Next.js..."
exec node_modules/.bin/next start -p 3000 -H 0.0.0.0
