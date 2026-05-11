#!/bin/sh
set -e

echo "[entrypoint] Syncing database schema..."
npx prisma db push --accept-data-loss

echo "[entrypoint] Checking seed..."
node -e "
const { PrismaClient } = require('./app/generated/prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const dbUrl = (process.env.DATABASE_URL || 'file:./data/prod.db').replace('file://', '').replace('file:', '');
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });
prisma.product.count().then(count => {
  if (count === 0) {
    console.log('[entrypoint] DB empty — running seed...');
    process.exit(2);
  } else {
    console.log('[entrypoint] DB has ' + count + ' products, skip seed.');
    process.exit(0);
  }
}).catch(() => process.exit(0)).finally(() => prisma.\$disconnect());
" && SEED_NEEDED=0 || SEED_NEEDED=$?

if [ "$SEED_NEEDED" = "2" ]; then
  npx prisma db seed
fi

echo "[entrypoint] Starting Next.js..."
exec node_modules/.bin/next start -p 3000 -H 0.0.0.0
