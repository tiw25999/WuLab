# WuLab — Technical Specification
## Siam Master Concrete Co., Ltd.

> **Version:** 1.0  
> **Updated:** 2026-05-02  
> **Repo:** https://github.com/tiw25999/WuLab  
> **Stack:** Next.js 14 · Prisma · SQLite/PostgreSQL · Tailwind CSS · Vercel

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [API Routes](#5-api-routes)
6. [Pages & Components](#6-pages--components)
7. [Environment Variables](#7-environment-variables)
8. [MVP Action Plan (Day 1)](#8-mvp-action-plan-day-1)
9. [Full Roadmap](#9-full-roadmap)
10. [Deployment](#10-deployment)

---

## 1. Project Overview

**Business:** Manufactures and sells prestressed concrete products (เสาไฟฟ้า · Hollow Core · เสาเข็ม)  
**Goal:** Company showcase site + RFQ (Request for Quotation) system — no customer login required  
**Languages:** Thai (default) + English toggle  
**Customer groups:** General public · Private companies · Government agencies

---

## 2. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 App Router | Full-stack in one repo — pages + API routes |
| ORM | Prisma | Type-safe DB queries, easy migration |
| DB (dev) | SQLite | Zero setup, file-based — ไม่ต้องติดตั้ง Docker |
| DB (prod) | PostgreSQL (Vercel Postgres) | Scalable, managed |
| Styling | Tailwind CSS | Utility-first, fast to build |
| Images | Cloudinary or `/public/images` | Product photos + portfolio |
| Auth (admin) | bcryptjs + JWT (jose) | Stateless session for admin panel |
| Email | Resend or Nodemailer | RFQ notification to admin + confirmation to customer |
| Deploy | Vercel | Git-connected, auto-deploy on push |
| i18n | next-intl | Thai/English language switch |

---

## 3. Project Structure

```
wulab/
├── app/
│   ├── [locale]/                  # i18n routing (th / en)
│   │   ├── page.tsx               # Landing page
│   │   ├── about/page.tsx         # About us
│   │   ├── products/
│   │   │   ├── page.tsx           # Product catalog
│   │   │   └── [slug]/page.tsx    # Product detail
│   │   ├── rfq/page.tsx           # RFQ form (3 customer types)
│   │   ├── rfq/track/page.tsx     # Track inquiry by reference no.
│   │   └── portfolio/page.tsx     # Project references
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── inquiries/page.tsx     # Manage RFQ submissions
│   │   └── products/page.tsx      # CRUD products
│   └── api/
│       ├── rfq/route.ts           # POST — submit RFQ
│       ├── rfq/[ref]/route.ts     # GET — track by reference
│       ├── products/route.ts      # GET list
│       ├── products/[slug]/route.ts # GET detail
│       ├── admin/login/route.ts   # POST — admin auth
│       ├── admin/inquiries/route.ts          # GET list + PATCH status
│       ├── admin/inquiries/[id]/route.ts     # GET detail
│       └── admin/products/route.ts           # POST / PUT / DELETE
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Top nav with language toggle
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx        # โลโก้ สโลแกน CTA button
│   │   ├── StrengthsSection.tsx   # จุดแข็ง 4 ข้อ
│   │   ├── CertSection.tsx        # ใบรับรอง มอก.
│   │   └── StatsSection.tsx       # 30 ปี จำนวนโปรเจกต์ ฯลฯ
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   └── ProductSpec.tsx        # Spec table + download button
│   ├── rfq/
│   │   ├── RFQForm.tsx            # Form with customer type selector
│   │   ├── GeneralForm.tsx
│   │   ├── PrivateForm.tsx
│   │   └── GovernmentForm.tsx
│   └── admin/
│       ├── InquiryTable.tsx
│       └── StatusBadge.tsx
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── auth.ts                    # JWT sign/verify helpers
│   ├── email.ts                   # Send email helpers
│   └── refCode.ts                 # Generate reference code (SMC-YYYYMMDD-XXXX)
├── messages/
│   ├── th.json                    # Thai strings
│   └── en.json                    # English strings
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── images/                    # Product photos (11 files from client)
└── middleware.ts                  # i18n locale detection
```

---

## 4. Database Schema

```prisma
// prisma/schema.prisma

model Product {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  nameTh      String
  nameEn      String
  descTh      String
  descEn      String
  category    String   // "pole" | "hollow-core" | "pile"
  imageUrl    String
  datasheetUrl String?
  specs       Json     // { length, diameter, load, weight, ... }
  useCases    Json     // array of use case strings
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Inquiry {
  id           Int      @id @default(autoincrement())
  refCode      String   @unique   // SMC-20260502-0001
  customerType String   // "general" | "private" | "government"
  name         String
  phone        String
  email        String
  company      String?  // private / government only
  projectType  String?
  message      String
  attachments  Json?    // array of file URLs
  status       String   @default("new")
  // "new" | "in_progress" | "completed" | "cancelled"
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Admin {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model PortfolioItem {
  id          Int      @id @default(autoincrement())
  titleTh     String
  titleEn     String
  descTh      String
  descEn      String
  category    String   // "infrastructure" | "building" | "industrial" | ...
  imageUrl    String
  year        Int
  createdAt   DateTime @default(now())
}
```

> **หมายเหตุ:** ใช้ `String` แทน `enum` เพราะ SQLite ไม่รองรับ enum — ตรวจสอบค่าที่ application layer แทน

---

## 5. API Routes

### Public

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/[slug]` | Product detail + specs |
| `POST` | `/api/rfq` | Submit RFQ — returns `refCode` |
| `GET` | `/api/rfq/[ref]` | Track inquiry status by reference code |

### Admin (JWT required)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/admin/login` | Returns signed JWT |
| `GET` | `/api/admin/inquiries` | List inquiries with filters |
| `PATCH` | `/api/admin/inquiries/[id]` | Update status |
| `GET` | `/api/admin/inquiries/[id]` | Inquiry detail |
| `GET` | `/api/admin/products` | List products (admin view) |
| `POST` | `/api/admin/products` | Create product |
| `PUT` | `/api/admin/products/[id]` | Update product |
| `DELETE` | `/api/admin/products/[id]` | Delete product |

### Request / Response Examples

**POST `/api/rfq`** — general customer
```json
// Request
{
  "customerType": "general",
  "name": "สมชาย ใจดี",
  "phone": "081-234-5678",
  "email": "somchai@email.com",
  "products": ["hollow-core"],
  "quantity": "500 ตร.ม.",
  "message": "สนใจใช้งานในอาคาร 5 ชั้น"
}

// Response 201
{
  "refCode": "SMC-20260502-0001",
  "message": "ส่งคำขอเรียบร้อย ทีมงานจะติดต่อกลับภายใน 1-2 วันทำการ"
}
```

**PATCH `/api/admin/inquiries/[id]`**
```json
// Request
{ "status": "in_progress" }

// Response 200
{ "id": 1, "status": "in_progress", "updatedAt": "2026-05-02T..." }
```

---

## 6. Pages & Components

### Landing Page (`/`)

```
HeroSection        → โลโก้ + สโลแกน "คอนกรีตอัดแรงคุณภาพ มาตรฐาน มอก." + CTA buttons
StrengthsSection   → 4 cards (มอก. / Hollow Core / กำลังผลิต / คุณภาพ)
ProductsPreview    → 3 product cards with link to /products
StatsSection       → 30+ ปี / X โปรเจกต์ / X ลูกค้า
CertSection        → ใบรับรอง มอก. badges
CTASection         → "ขอใบเสนอราคา" full-width CTA
```

### RFQ Form (`/rfq`)

```
Step 1: Select customer type (tab: ทั่วไป / เอกชน / ภาครัฐ)
Step 2: Fill form based on type
Step 3: Submit → POST /api/rfq
Step 4: Success page with refCode + summary
```

Customer type determines form fields:

| Field | ทั่วไป | เอกชน | ภาครัฐ |
|-------|:-----:|:-----:|:------:|
| ชื่อ-นามสกุล | ✓ | ✓ | ✓ |
| เบอร์โทรศัพท์ | ✓ | ✓ | ✓ |
| อีเมล | ✓ | ✓ | ✓ |
| ชื่อบริษัท/หน่วยงาน | — | ✓ | ✓ |
| ประเภทโปรเจกต์ | — | ✓ | — |
| เลขที่จัดซื้อจัดจ้าง | — | — | ✓ |
| แนบไฟล์ | — | ✓ | ✓ |
| สินค้าที่สนใจ | ✓ | ✓ | ✓ |
| ปริมาณ/ขนาดโปรเจกต์ | ✓ | ✓ | ✓ |

---

## 7. Environment Variables

```bash
# .env.local

# Database
DATABASE_URL="file:./dev.db"                      # SQLite (dev)
# DATABASE_URL="postgresql://..."                 # PostgreSQL (prod)

# JWT
JWT_SECRET="your-secret-min-32-chars"
JWT_EXPIRES_IN="8h"

# Email (choose one)
RESEND_API_KEY="re_xxxxxxxxxxxx"
# or
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@siammasterconcrete.com"
SMTP_PASS="app-password"

# Admin email — รับแจ้งเตือนเมื่อมีคำขอใหม่
ADMIN_EMAIL="sales@siammasterconcrete.com"

# Cloudinary (optional — ถ้าใช้ cloud storage)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"      # dev
# NEXT_PUBLIC_BASE_URL="https://wulab.vercel.app" # prod
```

---

## 8. MVP Action Plan (Day 1)

> **Target:** Working website online with product catalog + RFQ form in 8 hours

| Time | Task | Details | Done when |
|------|------|---------|-----------|
| 08:00–09:00 | **T1 Scaffold** | `npx create-next-app@latest` + Tailwind + Prisma + SQLite + seed 3 products | App runs on localhost:3000 |
| 09:00–11:00 | **T2 Landing + About** | HeroSection, StrengthsSection, CertSection, StatsSection, About page | Pages render correctly on mobile & desktop |
| 11:00–13:00 | **T3 Product Catalog** | Product list page, product detail page, real images from `images/`, spec table, PDF download button | All 3 products display with images |
| 13:00–14:00 | **Lunch** | — | — |
| 14:00–16:00 | **T4 RFQ Form** | 3-type form, validation, save to DB, generate refCode, send email to admin, success page | Form submits, admin receives email |
| 16:00–17:00 | **T5 Deploy** | Test on mobile, push to GitHub, deploy to Vercel, smoke test live URL | Live URL works end-to-end |

### T1 Scaffold — step by step

```bash
npx create-next-app@latest wulab --typescript --tailwind --app --src-dir
cd wulab
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite
```

Add schema → `npx prisma migrate dev --name init` → `npx prisma db seed`

### T4 RFQ — reference code format

```
SMC-YYYYMMDD-XXXX
     └─ date  └─ 4-digit zero-padded sequence (per day)
Example: SMC-20260502-0001
```

---

## 9. Full Roadmap

### Phase 1 — MVP Showcase `5–7 days`

| # | Task | Est. |
|---|------|------|
| 1 | Scaffold + DB + seed | 0.5d |
| 2 | Landing page | 0.5d |
| 3 | About page | 0.5d |
| 4 | Product catalog (list + detail + PDF) | 1.5d |
| 5 | RFQ form (3 types) + email notification | 1d |
| 6 | i18n — Thai / English | 1d |
| 7 | Test + Deploy to Vercel | 0.5d |

### Phase 2 — Sales System `10–14 days`

| # | Task | Est. |
|---|------|------|
| 1 | Admin login (JWT) | 0.5d |
| 2 | Admin — inquiry list + status update | 1.5d |
| 3 | Admin — product CRUD + image upload | 2d |
| 4 | Inquiry tracking by refCode | 1d |
| 5 | Portfolio page | 2d |
| 6 | Export inquiries to Excel | 1d |
| 7 | Test + bug fixes | 2–4d |

### Phase 3 — Customer Portal `7–10 days` *(optional)*

| # | Task | Est. |
|---|------|------|
| 1 | Customer account (register / login) | 2d |
| 2 | Inquiry history per account | 2d |
| 3 | Government docs section | 2d |
| 4 | Test + deploy | 1–4d |

---

## 10. Deployment

### Vercel Setup

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repo in Vercel dashboard
# 3. Add environment variables in Vercel → Settings → Environment Variables
# 4. For prod DB — use Vercel Postgres or Neon
#    DATABASE_URL = postgresql://...
# 5. Add build command override if needed:
#    Build: prisma generate && next build
```

### Switching DB from SQLite to PostgreSQL

```prisma
// prisma/schema.prisma — change only this line:
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

```bash
npx prisma migrate deploy   # apply migrations on prod
```

### Admin Setup (first run)

```bash
# สร้าง admin account แรกผ่าน seed หรือ script
npx tsx scripts/create-admin.ts --username admin --password "changeme"
```

---

## Acceptance Criteria per Phase

### Phase 1 ✓
- [ ] All 3 products display with real images and downloadable datasheet
- [ ] RFQ form submits for all 3 customer types
- [ ] Admin receives email on new submission
- [ ] Pages render correctly on mobile and desktop
- [ ] Live URL accessible on Vercel

### Phase 2 ✓
- [ ] Admin can log in and manage inquiries (change status)
- [ ] Admin can CRUD products via dashboard
- [ ] Customer can track inquiry by reference code
- [ ] Excel export works

### Phase 3 ✓
- [ ] Customer can register and log in
- [ ] Inquiry history visible per account
- [ ] Government documents section functional

---

> **Constraints:**  
> No ERP/pricing system integration — prices managed manually  
> No online payment in Phase 1  
> English content to be provided by the client team
