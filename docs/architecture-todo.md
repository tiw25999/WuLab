# WuLab — Architecture & Todo List
## Siam Master Concrete Co., Ltd.

> **Updated:** 2026-05-02

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│                                                              │
│   Landing → Products → Cart → RFQ → Track                   │
│   Admin: Login → Dashboard → Inquiries → Products           │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼───────────────────────────────────────┐
│                    NEXT.JS 14 (Vercel)                        │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐  │
│  │   App Router    │    │         API Routes               │  │
│  │   (Pages/UI)    │    │                                  │  │
│  │                 │    │  /api/products          GET      │  │
│  │  [locale]/      │    │  /api/products/[slug]   GET      │  │
│  │    page         │    │  /api/rfq               POST     │  │
│  │    about        │    │  /api/rfq/[ref]         GET      │  │
│  │    products     │    │  /api/admin/login       POST     │  │
│  │    rfq          │    │  /api/admin/inquiries   GET/PATCH │  │
│  │    rfq/track    │    │  /api/admin/products    CRUD     │  │
│  │  admin/         │    └─────────────────────────────────┘  │
│  │    dashboard    │                   │                      │
│  │    inquiries    │    ┌──────────────▼──────────────────┐  │
│  │    products     │    │          Prisma ORM              │  │
│  └─────────────────┘    └──────────────┬───────────────────┘  │
└─────────────────────────────────────────┼────────────────────┘
                                          │
          ┌───────────────────────────────┼────────────────┐
          │  dev: SQLite                  │  prod: Postgres │
          └───────────────────────────────┴────────────────┘

  External Services
  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
  │   Resend     │  │  Cloudinary  │  │  Vercel Postgres  │
  │  (Email)     │  │  (Images)    │  │  (Prod DB)        │
  └──────────────┘  └──────────────┘  └──────────────────┘
```

---

## Folder Structure

```
wulab/
│
├── app/
│   ├── [locale]/                   # i18n: /th/... และ /en/...
│   │   ├── page.tsx                # Landing page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx            # รายการสินค้า
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # รายละเอียดสินค้า
│   │   ├── rfq/
│   │   │   ├── page.tsx            # ฟอร์มขอใบเสนอราคา
│   │   │   └── track/
│   │   │       └── page.tsx        # ติดตามสถานะ
│   │   └── portfolio/
│   │       └── page.tsx
│   │
│   ├── admin/                      # ไม่มี locale (ใช้ภาษาไทยเท่านั้น)
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── inquiries/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── products/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   │
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
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Nav + Cart icon + Lang toggle
│   │   ├── Footer.tsx
│   │   └── CartIcon.tsx            # Badge counter
│   │
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StrengthsSection.tsx
│   │   ├── ProductsPreview.tsx
│   │   ├── UseCaseSection.tsx
│   │   ├── PortfolioStrip.tsx
│   │   └── CTABand.tsx
│   │
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductSpec.tsx
│   │   ├── AddToCartBtn.tsx
│   │   └── DownloadBtn.tsx
│   │
│   ├── cart/
│   │   ├── CartPanel.tsx           # Slide-out drawer
│   │   └── CartItem.tsx
│   │
│   ├── rfq/
│   │   ├── RFQForm.tsx
│   │   ├── GeneralForm.tsx
│   │   ├── PrivateForm.tsx
│   │   └── GovernmentForm.tsx
│   │
│   └── admin/
│       ├── InquiryTable.tsx
│       ├── StatusBadge.tsx
│       ├── ProductForm.tsx
│       └── DashboardStats.tsx
│
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth.ts                     # JWT sign/verify
│   ├── email.ts                    # Send email (Resend)
│   ├── cart-context.tsx            # Cart global state (React Context)
│   └── ref-code.ts                 # Generate SMC-YYYYMMDD-XXXX
│
├── messages/
│   ├── th.json                     # ข้อความภาษาไทย
│   └── en.json                     # English strings
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│   └── images/                     # Product images (gitignored)
│
└── middleware.ts                   # i18n locale detection
```

---

## Database Schema (ER)

```
┌──────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│   Product    │     │      Inquiry         │     │      Admin       │
├──────────────┤     ├─────────────────────┤     ├──────────────────┤
│ id           │     │ id                  │     │ id               │
│ slug         │     │ refCode  (unique)   │     │ username         │
│ nameTh       │     │ customerType        │     │ passwordHash     │
│ nameEn       │     │ name                │     │ createdAt        │
│ descTh       │     │ phone               │     └──────────────────┘
│ descEn       │     │ email               │
│ category     │     │ company?            │     ┌──────────────────┐
│ imageUrl     │     │ projectType?        │     │  PortfolioItem   │
│ datasheetUrl │     │ govRef?             │     ├──────────────────┤
│ specs (JSON) │     │ message             │     │ id               │
│ useCases(JSON│     │ items (JSON) ←──cart│     │ titleTh          │
│ createdAt    │     │ attachments (JSON)  │     │ titleEn          │
│ updatedAt    │     │ status              │     │ descTh           │
└──────────────┘     │ createdAt           │     │ descEn           │
                     │ updatedAt           │     │ category         │
                     └─────────────────────┘     │ imageUrl         │
                                                  │ year             │
                     status values:              └──────────────────┘
                       "new"
                       "in_progress"
                       "completed"
                       "cancelled"
```

---

## Data Flow

### Cart → RFQ Flow
```
User คลิก AddToCartBtn
    → CartContext.addItem(product)
    → localStorage.setItem('cart', ...)
    → CartIcon badge +1

User คลิก "ขอใบเสนอราคา" ใน CartPanel
    → navigate /rfq?from=cart
    → RFQForm อ่าน CartContext.items
    → Pre-fill สินค้าที่เลือกไว้

User submit RFQ
    → POST /api/rfq
    → prisma.inquiry.create({ items: cartItems })
    → Send email to admin (Resend)
    → Send confirmation to customer
    → Return { refCode: "SMC-20260502-0001" }
    → CartContext.clear()
    → Redirect /rfq/success?ref=SMC-...
```

### Admin Auth Flow
```
POST /api/admin/login
    → bcrypt.compare(password, hash)
    → jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '8h' })
    → Set httpOnly cookie

Admin pages
    → middleware checks cookie
    → jwt.verify(token)
    → redirect /admin/login if invalid
```

---

## Todo List

### Phase 1 — MVP (7–10 วัน)

> **Core MVP:** Search + Cart + RFQ ต้องครบทุกอย่าง

#### Setup ✅ Done
- [x] `T1.1` สร้าง Next.js 16 + Tailwind CSS 4 + TypeScript + Turbopack
- [x] `T1.2` ติดตั้ง Prisma 7 + SQLite + schema (Product, Inquiry, Admin, Portfolio)
- [x] `T1.3` เพิ่ม `productType` (standard/preorder), `leadTimeDays`, `minOrderQty`
- [x] `T1.4` ติดตั้ง next-intl, Resend, bcryptjs, jsonwebtoken, Vite (mockup dev)
- [x] `T1.5` Push ขึ้น GitHub + gitignore ครบ

#### Foundation
- [ ] `T1.6` เขียน seed data — 3 สินค้า (2 standard, 1 preorder) + 1 admin + 5 portfolio
- [ ] `T1.7` ตั้งค่า next-intl — middleware, th.json, en.json, [locale]/layout.tsx
- [ ] `T1.8` สร้าง `lib/prisma.ts` singleton
- [ ] `T1.9` สร้าง Navbar (logo, links, lang toggle, cart icon+badge) + Footer
- [ ] `T1.10` CSS variables ใน globals.css (--navy, --gold, --chalk, ฯลฯ)

#### Landing Page
- [ ] `T1.11` HeroSection — headline, animated product cards, CTA buttons, stats
- [ ] `T1.12` TrustStrip — มอก. / 30 ปี / โครงการ / ทั่วไทย
- [ ] `T1.13` StrengthsSection — 4 cards
- [ ] `T1.14` UseCaseSection — 4 ประเภทงาน
- [ ] `T1.15` CTABand — full-width gold gradient

#### Product Catalog + Search ⭐ MVP core
- [ ] `T1.16` API `GET /api/products?q=&category=&type=` — search + filter
- [ ] `T1.17` API `GET /api/products/[slug]`
- [ ] `T1.18` หน้ารายการสินค้า — search bar + filter sidebar + grid
- [ ] `T1.19` หน้ารายละเอียดสินค้า — spec table + use cases + รูปภาพ + lead time badge
- [ ] `T1.20` ปุ่ม Download Datasheet + ปุ่ม AddToCart (standard) / RFQ โดยตรง (preorder)

#### Inquiry Cart ⭐ MVP core
- [ ] `T1.21` `lib/cart-context.tsx` — CartContext + useCart hook + localStorage
- [ ] `T1.22` `CartIcon` ใน Navbar — badge แสดงจำนวน
- [ ] `T1.23` `CartPanel` — slide-out drawer
- [ ] `T1.24` `CartItem` — ปรับปริมาณ/หมายเหตุ/ลบ
- [ ] `T1.25` `AddToCartBtn` ใน ProductCard + ProductDetail (standard เท่านั้น)

#### RFQ Form ⭐ MVP core
- [ ] `T1.26` `lib/ref-code.ts` — generate SMC-YYYYMMDD-XXXX
- [ ] `T1.27` `lib/email.ts` — Resend: admin notification + customer confirmation
- [ ] `T1.28` API `POST /api/rfq` — save Inquiry + refCode + email
- [ ] `T1.29` หน้า RFQ — 3 tabs (ทั่วไป/เอกชน/ภาครัฐ) + cart summary panel
- [ ] `T1.30` Cart → RFQ — pre-fill items จาก CartContext
- [ ] `T1.31` หน้า Success — แสดง refCode + ปุ่ม Track
- [ ] `T1.32` API `GET /api/rfq/[ref]` + หน้า Track status

#### About Page
- [ ] `T1.33` ประวัติบริษัท 30 ปี + วิสัยทัศน์ + ใบรับรอง มอก.

#### i18n
- [ ] `T1.34` แปลเนื้อหาทุกหน้าเป็นไทย-อังกฤษ (ดู docs/content.md)
- [ ] `T1.35` Language toggle ใน Navbar

#### Deploy
- [ ] `T1.36` ทดสอบ Search, Cart, RFQ end-to-end บน mobile + desktop
- [ ] `T1.37` Deploy to Vercel production + ตั้งค่า Environment Variables

---

### Phase 2 — Admin + Sales System (10–14 วัน)

#### Admin Dashboard
- [ ] `T2.1` Admin login page + API `POST /api/admin/login` (JWT)
- [ ] `T2.2` JWT middleware — protect `/admin/*` routes
- [ ] `T2.3` หน้า Inquiry list — filter ตามสถานะ/วันที่/กลุ่ม
- [ ] `T2.4` API `PATCH /api/admin/inquiries/[id]` — เปลี่ยนสถานะ
- [ ] `T2.5` หน้า Inquiry detail — ดูรายละเอียด + items
- [ ] `T2.6` Admin Product CRUD — เพิ่ม/แก้ไข/ลบสินค้า
- [ ] `T2.7` อัปโหลดรูปสินค้า (Cloudinary หรือ local)

#### Portfolio + Export
- [ ] `T2.8` หน้า Portfolio — filter ตามประเภทงาน
- [ ] `T2.9` Admin CRUD portfolio items
- [ ] `T2.10` Export inquiry list เป็น Excel (xlsx)

#### Export
- [ ] `T2.21` Export inquiry list เป็น Excel (xlsx)

---

### Phase 3 — Customer Portal (7–10 วัน)

- [ ] `T3.1` Customer register / login (separate from admin)
- [ ] `T3.2` Customer account page
- [ ] `T3.3` ประวัติ inquiry per account
- [ ] `T3.4` เอกสารลูกค้าภาครัฐ — ดาวน์โหลดได้
- [ ] `T3.5` ทดสอบ + deploy production

---

## Priority Summary

```
ทำทันที (Phase 1 MVP):
  T1.1 → T1.29  ←  5–7 วัน

ทำต่อ (Phase 2):
  T2.1–T2.8   Cart system
  T2.9–T2.15  Admin dashboard
  T2.16–T2.17 Tracking
  T2.18–T2.21 Portfolio + Export

ทำทีหลัง (Phase 3):
  T3.1–T3.5   Customer portal
```

---

## Environment Checklist

- [ ] `DATABASE_URL` — SQLite (dev) / PostgreSQL (prod)
- [ ] `JWT_SECRET` — min 32 chars
- [ ] `RESEND_API_KEY` — email service
- [ ] `ADMIN_EMAIL` — รับแจ้งเตือน RFQ
- [ ] `CLOUDINARY_*` — image upload (Phase 2)
- [ ] `NEXT_PUBLIC_BASE_URL` — app URL

---

> tick `- [x]` เมื่อเสร็จแต่ละ task
