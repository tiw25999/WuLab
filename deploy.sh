#!/bin/bash
# deploy.sh — pull latest code and rebuild containers
set -e

echo "==> Pulling latest code..."
git pull origin main

echo "==> Rebuilding app container..."
docker compose build --no-cache app

echo "==> Restarting services..."
docker compose up -d

echo "==> Status:"
docker compose ps

echo ""
echo "Done. Logs: docker compose logs -f app"
