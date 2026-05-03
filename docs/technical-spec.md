# WuLab — Technical Specification
## Siam Master Concrete Co., Ltd.

> **Version:** 2.0 | **Updated:** 2026-05-03
> **Repo:** https://github.com/tiw25999/WuLab
> **Stack:** Next.js 16.2.4 · Prisma 7 · SQLite/PostgreSQL · Tailwind CSS 4 · Vercel

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Project Structure](#2-project-structure)
3. [Database Schema](#3-database-schema)
4. [API Routes](#4-api-routes)
5. [Pages & Components](#5-pages--components)
6. [Environment Variables](#6-environment-variables)
7. [Dev Commands](#7-dev-commands)
8. [Deployment](#8-deployment)

---

## 1. Tech Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | Next.js App Router | 16.2.4 | Full-stack — pages + API routes in one repo |
| Bundler | Turbopack | built-in | HMR ~340ms cold start (use `--turbo` flag) |
| ORM | Prisma | 7.8.0 | Type-safe queries, auto-migration |
| DB (dev) | SQLite | — | Zero setup, file-based (`dev.db`) |
| DB (prod) | PostgreSQL | — | Scalable, managed (Vercel Postgres / Neon) |
| Styling | Tailwind CSS | 4 | Utility-first, no config file needed |
| i18n | next-intl | 4.x | Thai/English routing via `[locale]` segment |
| Admin auth | bcryptjs + jsonwebtoken | 3.x / 9.x | Stateless JWT, httpOnly cookie |
| Email | Resend | 6.x | RFQ notification + customer confirmation |
| Deploy | Vercel | — | Auto-deploy on push to main |
| Mockup dev | Vite | 8.x | HMR for plain HTML mockup files |

---

## 2. Project Structure

```
wulab/
├── app/
│   ├── generated/prisma/          ← Prisma client output (auto-generated, gitignored)
│   ├── [locale]/                  ← i18n routing: /th/... and /en/...
│   │   ├── layout.tsx             ← NextIntlClientProvider wrapper
│   │   ├── page.tsx               ← Landing page
│   │   ├── about/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx           ← Product catalog
│   │   │   └── [slug]/page.tsx    ← Product detail
│   │   ├── rfq/
│   │   │   ├── page.tsx           ← RFQ form (3 customer types)
│   │   │   ├── success/page.tsx   ← Show refCode after submit
│   │   │   └── track/page.tsx     ← Track by refCode
│   │   └── portfolio/page.tsx
│   ├── admin/                     ← Thai only, no locale
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── inquiries/page.tsx
│   │   └── products/page.tsx
│   └── api/
│       ├── products/route.ts
│       ├── products/[slug]/route.ts
│       ├── rfq/route.ts
│       ├── rfq/[ref]/route.ts
│       └── admin/
│           ├── login/route.ts
│           ├── inquiries/route.ts
│           ├── inquiries/[id]/route.ts
│           └── products/route.ts
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   ├── home/HeroSection.tsx
│   ├── home/TrustStrip.tsx
│   ├── home/StrengthsSection.tsx
│   ├── home/UseCaseSection.tsx
│   ├── home/CTABand.tsx
│   ├── products/ProductCard.tsx
│   ├── products/ProductSpec.tsx
│   └── rfq/RFQForm.tsx
├── lib/
│   ├── prisma.ts                  ← Prisma client singleton
│   ├── email.ts                   ← Resend helpers
│   ├── auth.ts                    ← JWT sign/verify
│   └── ref-code.ts                ← Generate SMC-YYYYMMDD-XXXX
├── messages/
│   ├── th.json                    ← Thai strings (see docs/content.md)
│   └── en.json                    ← English strings
├── prisma/
│   ├── schema.prisma              ← DB models
│   ├── migrations/                ← Auto-generated SQL migrations
│   └── seed.ts                    ← Seed 3 products + 1 admin
├── docs/                          ← Project documentation
├── mockups/                       ← HTML mockups (gitignored)
├── prisma.config.ts               ← Prisma v7 config (datasource URL)
├── middleware.ts                  ← next-intl locale detection
├── next.config.ts
└── tailwind.config.ts             ← (Tailwind v4: minimal config)
```

---

## 3. Database Schema

> ไฟล์จริง: `prisma/schema.prisma` | Client output: `app/generated/prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "sqlite"   // เปลี่ยนเป็น "postgresql" ตอน deploy prod
}

model Product {
  id           String   @id @default(cuid())
  slug         String   @unique
  nameTh       String
  nameEn       String
  descTh       String
  descEn       String
  category     String   // "slab" | "pile" | "pole" | "beam"
  imageUrl     String?
  datasheetUrl String?
  specs        String   // JSON string (SQLite ไม่มี Json type)
  useCases     String   // JSON string
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Inquiry {
  id           String   @id @default(cuid())
  refCode      String   @unique   // SMC-20260502-0001
  customerType String   // "general" | "private" | "government"
  name         String
  phone        String
  email        String?
  lineId       String?
  company      String?
  projectType  String?
  province     String?
  delivery     String?
  budget       String?
  govRef       String?
  message      String?
  items        String   // JSON string — cart items array
  attachments  String?  // JSON string
  status       String   @default("new")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Admin {
  id           String   @id @default(cuid())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model PortfolioItem {
  id        String   @id @default(cuid())
  titleTh   String
  titleEn   String
  descTh    String
  descEn    String
  category  String
  imageUrl  String?
  year      Int
  createdAt DateTime @default(now())
}
```

**หมายเหตุ:** SQLite ไม่รองรับ `Json` type → ใช้ `String` + `JSON.stringify/parse` ที่ application layer

---

## 4. API Routes

### Public

| Method | Route | Body / Params | Response |
|--------|-------|---------------|----------|
| `GET` | `/api/products` | `?category=slab` (optional) | `Product[]` |
| `GET` | `/api/products/[slug]` | — | `Product` |
| `POST` | `/api/rfq` | RFQ form data + items array | `{ refCode: string }` |
| `GET` | `/api/rfq/[ref]` | — | `{ refCode, status, name, items, createdAt }` |

### Admin (JWT cookie required)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/admin/login` | Returns signed JWT, sets httpOnly cookie |
| `GET` | `/api/admin/inquiries` | List with `?status=new&type=private` filters |
| `PATCH` | `/api/admin/inquiries/[id]` | `{ status }` — update inquiry status |
| `GET` | `/api/admin/inquiries/[id]` | Full inquiry detail |
| `GET` | `/api/admin/products` | Product list (admin view) |
| `POST` | `/api/admin/products` | Create product |
| `PUT` | `/api/admin/products/[id]` | Update product |
| `DELETE` | `/api/admin/products/[id]` | Delete product |

### POST `/api/rfq` — Request example

```json
{
  "customerType": "private",
  "name": "สมชาย ใจดี",
  "phone": "081-234-5678",
  "email": "somchai@email.com",
  "company": "บริษัท เจริญก่อสร้าง จำกัด",
  "projectType": "คลังสินค้า",
  "province": "ปทุมธานี",
  "message": "ต้องการแผ่นพื้น Hollow Core ความหนา 20 ซม.",
  "items": [
    { "id": "hollow-core-slab", "nameTh": "แผ่นพื้น Hollow Core", "quantity": "500", "unit": "ตร.ม.", "note": "ความหนา 20 ซม." }
  ]
}
```

```json
// Response 201
{ "refCode": "SMC-20260502-0001" }
```

---

## 5. Pages & Components

### Landing Page (`/[locale]`)

```
Navbar          sticky, backdrop-blur, cart icon + badge
HeroSection     2-col: headline left / animated product cards right
TrustStrip      มอก. · 30 ปี · 500+ โครงการ · ทั่วไทย
StrengthsSection 4 cards grid
UseCaseSection  4 categories
CTABand         full-width gold gradient + CTA button
Footer
```

### RFQ Form (`/[locale]/rfq`)

```
Progress bar    Step 1 (เลือกสินค้า ✓) → Step 2 (กรอกข้อมูล) → Step 3 (ยืนยัน)
Customer tabs   ทั่วไป | บริษัท/เอกชน | ภาครัฐ
Form fields     ดูรายละเอียดที่ docs/content.md section 6
Cart summary    Panel ขวา: รายการสินค้า + refCode preview + trust seals
Submit          POST /api/rfq → redirect /rfq/success?ref=SMC-...
```

Customer type → extra fields:

| Field | ทั่วไป | เอกชน | ภาครัฐ |
|-------|:-----:|:-----:|:------:|
| ชื่อ, โทร, อีเมล | ✓ | ✓ | ✓ |
| ชื่อบริษัท/หน่วยงาน | — | ✓ | ✓ |
| ประเภทโครงการ | — | ✓ | — |
| เลขที่หนังสือราชการ | — | — | ✓ |
| แนบไฟล์ | — | ✓ | ✓ |

---

## 6. Environment Variables

ไฟล์: `.env` (gitignored)

```env
# Database
DATABASE_URL="file:./dev.db"
# prod: DATABASE_URL="postgresql://user:pass@host/db"

# JWT
JWT_SECRET="random-32-char-string-minimum"

# Email
RESEND_API_KEY="re_xxxxxxxxxxxx"
ADMIN_EMAIL="sales@siammasterconcrete.com"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
# prod: NEXT_PUBLIC_BASE_URL="https://wulab.vercel.app"
```

---

## 7. Dev Commands

```bash
# Start dev server (Turbopack — ~340ms cold start)
npm run dev

# Open mockup HTML files with HMR
npm run mockup         # → vite mockups/ → localhost:5173

# Prisma
npx prisma studio      # GUI database browser
npx prisma migrate dev # Create and apply migration
npx prisma db seed     # Run prisma/seed.ts
npx prisma generate    # Regenerate client after schema change

# Build check
npm run build
npm run lint
```

---

## 8. Deployment

### Vercel Setup

```bash
# 1. push to GitHub
git push origin main

# 2. Connect repo in Vercel dashboard → Import project

# 3. Add build command override in Vercel:
#    Build Command: prisma generate && next build

# 4. Add all environment variables in Vercel → Settings → Environment Variables
#    (See section 6 above — use PostgreSQL URL for DATABASE_URL)

# 5. After first deploy, run seed on prod:
#    npx prisma migrate deploy
```

### Switching DB: SQLite → PostgreSQL

ใน `prisma/schema.prisma` เปลี่ยนแค่บรรทัดเดียว:

```prisma
datasource db {
  provider = "postgresql"   // เปลี่ยนจาก "sqlite"
}
```

แล้ว set `DATABASE_URL` บน Vercel เป็น PostgreSQL connection string → push → Vercel build auto-run migration

### Admin First Run

```bash
# admin account สร้างผ่าน seed.ts อัตโนมัติ
npx prisma db seed
# username: admin | password: Admin@SMC2024
# ⚠️ เปลี่ยน password ก่อน deploy production
```

---

> ดูข้อมูลเพิ่มเติม:
> - Copy ภาษาและ i18n keys → `docs/content.md`
> - Seed data และสเปคสินค้า → `docs/seed-data.md`
> - Implementation plan Phase 1 → `docs/implementation-plan-phase1.md`
> - Architecture diagram และ todo list → `docs/architecture-todo.md`
