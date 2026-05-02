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

### Phase 1 — MVP (5–7 วัน)

#### Setup
- [ ] `T1.1` สร้าง Next.js 14 + Tailwind CSS + TypeScript
- [ ] `T1.2` ติดตั้ง Prisma + SQLite + สร้าง schema
- [ ] `T1.3` เขียน seed data (3 สินค้า, 1 admin)
- [ ] `T1.4` ติดตั้ง next-intl + สร้าง th.json / en.json โครงสร้าง
- [ ] `T1.5` สร้าง Navbar + Footer component
- [ ] `T1.6` Push ขึ้น GitHub + ตั้งค่า Vercel (preview deploy)

#### Landing Page
- [ ] `T1.7` HeroSection — headline, subtext, CTA buttons, stats
- [ ] `T1.8` StrengthsSection — 4 cards (มอก., Hollow Core, กำลังผลิต, คุณภาพ)
- [ ] `T1.9` ProductsPreview — 3 product cards mini
- [ ] `T1.10` CTABand — full-width amber band

#### About Page
- [ ] `T1.11` ประวัติบริษัท 30 ปี + วิสัยทัศน์
- [ ] `T1.12` ใบรับรอง มอก. section

#### Product Catalog
- [ ] `T1.13` หน้ารายการสินค้า — grid + filter sidebar
- [ ] `T1.14` หน้ารายละเอียดสินค้า — spec table + use cases + รูปภาพ
- [ ] `T1.15` ปุ่ม Download Datasheet (PDF)
- [ ] `T1.16` API `GET /api/products` + `GET /api/products/[slug]`

#### RFQ Form
- [ ] `T1.17` ฟอร์ม 3 tab (ทั่วไป / เอกชน / ภาครัฐ)
- [ ] `T1.18` Client-side validation
- [ ] `T1.19` API `POST /api/rfq` + สร้าง refCode
- [ ] `T1.20` ส่งอีเมลแจ้งเตือน Admin (Resend)
- [ ] `T1.21` ส่งอีเมลยืนยัน Customer
- [ ] `T1.22` หน้า Success + แสดง refCode

#### i18n
- [ ] `T1.23` แปลเนื้อหาทุกหน้าเป็นไทย-อังกฤษ
- [ ] `T1.24` Language toggle ใน Navbar
- [ ] `T1.25` middleware.ts — locale detection

#### Deploy
- [ ] `T1.26` ทดสอบ mobile + desktop ทุกหน้า
- [ ] `T1.27` ทดสอบ RFQ form end-to-end
- [ ] `T1.28` Deploy to Vercel production
- [ ] `T1.29` ตั้งค่า Environment Variables บน Vercel

---

### Phase 2 — Cart + Sales System (10–14 วัน)

#### Inquiry Cart
- [ ] `T2.1` สร้าง `CartContext` + `useCart` hook
- [ ] `T2.2` บันทึก/อ่าน cart จาก localStorage
- [ ] `T2.3` `CartIcon` component — badge แสดงจำนวน
- [ ] `T2.4` `CartPanel` — slide-out drawer
- [ ] `T2.5` `CartItem` — เพิ่ม/ลด/ลบ + หมายเหตุแต่ละรายการ
- [ ] `T2.6` `AddToCartBtn` ใน ProductCard + ProductDetail
- [ ] `T2.7` Cart → RFQ — pre-fill สินค้าจาก cart
- [ ] `T2.8` บันทึก `items` JSON ลงใน Inquiry model

#### Admin Dashboard
- [ ] `T2.9` Admin login page + API `POST /api/admin/login`
- [ ] `T2.10` JWT middleware — protect `/admin/*` routes
- [ ] `T2.11` หน้า Inquiry list — ดู filter ตามสถานะ/วันที่/กลุ่ม
- [ ] `T2.12` API `PATCH /api/admin/inquiries/[id]` — เปลี่ยนสถานะ
- [ ] `T2.13` หน้า Inquiry detail — ดูรายละเอียด + items
- [ ] `T2.14` Admin Product CRUD — เพิ่ม/แก้ไข/ลบสินค้า
- [ ] `T2.15` อัปโหลดรูปสินค้า (Cloudinary หรือ local)

#### Tracking
- [ ] `T2.16` หน้า Track inquiry — กรอก refCode
- [ ] `T2.17` API `GET /api/rfq/[ref]` — คืน status + สรุป

#### Portfolio
- [ ] `T2.18` PortfolioItem model + seed data
- [ ] `T2.19` หน้า Portfolio — filter ตามประเภทงาน
- [ ] `T2.20` Admin CRUD portfolio items

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
