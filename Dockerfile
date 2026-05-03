# ── Stage 1: Install dependencies ────────────────────────────────────────
FROM node:22-bookworm-slim AS deps
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install

# ── Stage 2: Build Next.js ────────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dummy DATABASE_URL so prisma generate doesn't complain
ENV DATABASE_URL=file:/tmp/build.db
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build

# ── Stage 3: Production runner ────────────────────────────────────────────
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy everything needed to run (including node_modules for native deps)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/app/generated ./app/generated

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Persistent data directories
RUN mkdir -p /app/data /app/public/uploads \
    && chown -R node:node /app /app/data /app/public/uploads

USER node

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
