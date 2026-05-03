#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
npx prisma migrate deploy

echo "[entrypoint] Starting Next.js..."
exec node_modules/.bin/next start -p 3000 -H 0.0.0.0
