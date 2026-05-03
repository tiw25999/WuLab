# WuLab — Project Master Plan
## Siam Master Concrete Co., Ltd. (บริษัท สยามมาสเตอร์คอนกรีต จำกัด)

> **Version:** 2.0 | **Updated:** 2026-05-03  
> เอกสารนี้คือ single source of truth สำหรับทีม — อธิบายว่าโปรเจคนี้คืออะไร ทำอะไรบ้าง ทำไมถึงทำแบบนี้

---

## 1. โปรเจคนี้คืออะไร

**WuLab** คือเว็บไซต์บริษัทและระบบรับ RFQ (ใบเสนอราคา) ออนไลน์ของ **สยามมาสเตอร์คอนกรีต** ผู้ผลิตคอนกรีตอัดแรงมากว่า 30 ปี

**ปัญหาที่แก้:** ตอนนี้ลูกค้าต้องโทรหรือมาพบเพื่อขอใบเสนอราคา — เป้าหมายคือให้ลูกค้าเข้าเว็บ ดูสินค้า แล้วส่ง RFQ ออนไลน์ได้เลย ทีมได้รับ email แจ้งเตือน และลูกค้า track สถานะได้

### ผู้ใช้งาน

| กลุ่ม | ใครคือ | ต้องการอะไร |
|-------|--------|------------|
| **ลูกค้าทั่วไป** | บุคคล / ช่างก่อสร้าง | ดูสินค้า ส่ง RFQ ง่ายๆ |
| **ลูกค้าเอกชน** | บริษัท / ผู้รับเหมา | แนบข้อมูลโครงการ งบประมาณ |
| **ลูกค้าภาครัฐ** | หน่วยงานราชการ | แนบเลขที่หนังสือราชการ |
| **Admin (ทีมงาน)** | เซลล์ / ผู้จัดการ | รับแจ้งเตือน ดู/เปลี่ยนสถานะ inquiry |

---

## 2. สินค้า 3 ประเภท

| สินค้า | ประเภท | สั่งขั้นต่ำ | การคำนวณราคา | UI behavior |
|--------|--------|-----------|-------------|------------|
| **เสาไฟฟ้าคอนกรีตอัดแรง** | `standard` | ไม่มีขั้นต่ำ | Fixed ต่อความยาว (ราคา กฟภ) | เพิ่มลงตะกร้าได้ |
| **เสาเข็มคอนกรีตอัดแรง** | `preorder` | **6 ม./ต้น** | ราคาต่อเมตร × ความยาว | ปุ่ม "ขอใบเสนอราคา" โดยตรง |
| **แผ่นพื้น Hollow Core** | `preorder` | **120 ตร.ม.** | ราคาต่อ ตร.ม. × จำนวน ตร.ม. | ปุ่ม "ขอใบเสนอราคา" โดยตรง |

### ตารางราคาเสาไฟฟ้า (Standard — ราคา กฟภ)

| ความยาว | ราคาต่อต้น |
|--------|-----------|
| 8 ม. | 4,000 บาท |
| 9 ม. | 4,500 บาท |
| 12 ม. | 6,000 บาท |
| 12.2 ม. | 8,000 บาท |

### ตารางราคาเสาเข็ม (Pre-order — ราคาต่อเมตร × ความยาว)

**หน้าตัดสี่เหลี่ยมต้น:**

| ขนาด (ม.) | ราคา/เมตร | ตัวอย่าง: 6 ม. |
|----------|----------|--------------|
| 0.22×0.22 | 250 บาท | 1,500 บาท/ต้น |
| 0.26×0.26 | 280 บาท | 1,680 บาท/ต้น |
| 0.30×0.30 | 310 บาท | 1,860 บาท/ต้น |
| 0.35×0.35 | 340 บาท | 2,040 บาท/ต้น |
| 0.40×0.40 | 370 บาท | 2,220 บาท/ต้น |

**หน้าตัดรูปตัวไอ:**

| ขนาด (ม.) | ราคา/เมตร | ตัวอย่าง: 6 ม. |
|----------|----------|--------------|
| 0.22×0.22 | 230 บาท | 1,380 บาท/ต้น |
| 0.26×0.26 | 260 บาท | 1,560 บาท/ต้น |
| 0.30×0.30 | 290 บาท | 1,740 บาท/ต้น |
| 0.35×0.35 | 320 บาท | 1,920 บาท/ต้น |
| 0.40×0.40 | 350 บาท | 2,100 บาท/ต้น |

> สูตร: **ราคาต่อต้น = ราคาต่อเมตร × ความยาว(m)**  
> ตัวอย่าง: 0.26×0.26 สี่เหลี่ยม ยาว 12 ม. = 280 × 12 = **3,360 บาท/ต้น**

### ตารางราคาแผ่นพื้น Hollow Core (Pre-order — มอก. 828-2549)

| # | ความหนา | ราคาต่อ ตร.ม. | ตัวอย่าง 300 ตร.ม. |
|---|--------|--------------|------------------|
| 1 | 8 ซม.  | 370 บาท | 111,000 บาท |
| 2 | 10 ซม. | 390 บาท | 117,000 บาท |
| 3 | 12 ซม. | 410 บาท | 123,000 บาท |
| 4 | 15 ซม. | 450 บาท | 135,000 บาท |
| 5 | 20 ซม. | 470 บาท | 141,000 บาท |
| 6 | 25 ซม. | 490 บาท | 147,000 บาท |
| 7 | 30 ซม. | 510 บาท | 153,000 บาท |

> สูตร: **ราคารวม = ราคาต่อ ตร.ม. × จำนวน ตร.ม.** | สั่งขั้นต่ำ 120 ตร.ม.

### ความแตกต่าง standard vs preorder

```
Standard (เสาไฟฟ้า):
  → มีในสต็อก พร้อมส่ง
  → ราคาคงที่ตาม กฟภ แสดงในตารางบนเว็บ
  → เพิ่มลงตะกร้าได้ → รวม RFQ หลายรายการ

Preorder (เสาเข็ม + แผ่นพื้น):
  → ผลิตตามสั่ง ระยะเวลา 7–14 วัน
  → เสาเข็ม: แสดงตารางราคาต่อเมตร ลูกค้าเลือกขนาด+ความยาว → ระบบคำนวณราคาประมาณ
  → แผ่นพื้น: แสดงตารางราคาต่อ ตร.ม. ตามความหนา ลูกค้าเลือกความหนา + กรอกพื้นที่ → ระบบคำนวณราคาประมาณ
  → ปุ่ม "ขอใบเสนอราคา" ไปฟอร์มโดยตรง ไม่ผ่าน cart
  → badge "สั่งผลิตพิเศษ" (amber) + "7–14 วัน"
```

---

## 3. Timeline ทั้งโปรเจค

```
Day 1         MVP ใช้งานได้จริง
              ดูสินค้า + ส่ง RFQ + email แจ้ง + track สถานะ

Day 2–3       เพิ่ม Cart + i18n (TH/EN toggle)

Day 4–5       About page + Landing page polish + Deploy Vercel

Day 6–10      Phase 2: Admin Dashboard
              login + ดู/จัดการ inquiry + CRUD สินค้า

Day 11–15     Phase 2: Portfolio + Excel export + bug fixes

Day 16+       Phase 3 (optional)
              Customer portal, SVG configurator
```

**รวมทั้งโปรเจค:**
- Phase 1 (ใช้งานได้ + deploy): **5 วัน**
- Phase 2 (Admin dashboard ครบ): **+10 วัน** (รวม 15 วัน)
- Phase 3 (optional): **+7–10 วัน**

---

## 4. Scope แต่ละ Phase

---

### Day 1 — MVP (8 ชั่วโมง)

> **เป้าหมาย:** ลูกค้าใช้งานได้จริงทันที  
> เปิดเว็บ → ดูสินค้า → ส่ง RFQ → ได้รหัสอ้างอิง → track สถานะ → admin ได้รับ email

**✅ ทำ Day 1**

| Feature | รายละเอียด |
|---------|-----------|
| Landing page (minimal) | Hero + Strengths + CTA — ไม่มี animation ก่อน |
| Product catalog | รายการสินค้า 3 ตัว + search + filter category/type |
| Product detail | spec table + use cases + download datasheet |
| RFQ form | 3 tabs (ทั่วไป / เอกชน / ภาครัฐ) + validation |
| RFQ submit | บันทึก DB + สร้าง refCode (SMC-YYYYMMDD-XXXX) |
| Email notification | Resend แจ้ง admin + ยืนยันลูกค้า (ถ้ามีอีเมล) |
| RFQ success page | แสดง refCode + ปุ่ม copy + link ไป track |
| Track page | กรอก refCode → แสดง status + รายการสินค้า |

**❌ ข้าม Day 1 — ทำ Day 2–3**

| Feature | เหตุผล |
|---------|--------|
| Cart system (CartContext, CartPanel, badge) | ซับซ้อน ไม่ block การส่ง RFQ |
| Thai/English toggle (next-intl) | setup หนัก ภาษาไทยพอสำหรับ Day 1 |
| About page | ไม่ block flow หลัก |
| Animation / micro-interaction | ทำทีหลัง |

---

### Day 2–3 — Phase 1 ต่อ

| Feature | รายละเอียด |
|---------|-----------|
| Cart system | CartContext + localStorage + CartPanel + AddToCartBtn |
| Cart → RFQ pre-fill | items จาก cart ถูก pre-fill ลง RFQ form อัตโนมัติ |
| Thai/English toggle | next-intl + [locale] routing + th.json / en.json |
| About page | ประวัติ 30 ปี + วิสัยทัศน์ + มอก. certs |

---

### Day 4–5 — Phase 1 Finish + Deploy

| Feature | รายละเอียด |
|---------|-----------|
| Landing page polish | TrustStrip + UseCaseSection + ProductsPreview strip |
| ทดสอบ end-to-end | Search → Cart → RFQ → email → track ทุก flow |
| Deploy Vercel | Env vars + Vercel Postgres + live URL |

---

### Day 6–15 — Phase 2: Admin Dashboard

| Feature | รายละเอียด |
|---------|-----------|
| Admin login | bcrypt + JWT cookie (8h) |
| Protected routes | middleware ตรวจ JWT ก่อน render /admin/* |
| Inquiry list | filter สถานะ / วันที่ / ประเภทลูกค้า |
| Inquiry detail + status update | เปลี่ยน new → in_progress → completed |
| Product CRUD | เพิ่ม/แก้/ลบสินค้า + upload image + PDF |
| Portfolio page + CRUD | รูปผลงาน + filter |
| Excel export | ดาวน์โหลด inquiry list .xlsx |

---

### Day 16+ — Phase 3 (Optional)

| Feature | รายละเอียด |
|---------|-----------|
| Customer accounts | register + login + ประวัติ inquiry |
| Interactive SVG configurator | กด diagram 2D → เลือก spec → เปิด RFQ |
| Government docs section | เอกสารราชการ downloadable |

---

### ❌ ไม่ทำเลย (Out of Scope)

| Feature | เหตุผล |
|---------|--------|
| Online payment | ไม่ได้ขายตรง — ราคาแจ้งทีหลังโดย admin |
| ERP / SAP integration | ไม่ได้ร้องขอ |
| Customer chat / Line OA integration | Phase 3+ |

---

## 5. Day 1 Timeline (8 ชั่วโมง)

| เวลา | งาน | ไฟล์ที่สร้าง |
|------|-----|-------------|
| 08:00–09:00 | seed data + lib/* + globals.css | `prisma/seed.ts`, `lib/prisma.ts`, `lib/ref-code.ts`, `lib/email.ts`, `app/globals.css` |
| 09:00–09:45 | Navbar + Footer | `components/layout/Navbar.tsx`, `Footer.tsx` |
| 09:45–11:00 | Products API | `app/api/products/route.ts`, `app/api/products/[slug]/route.ts` |
| 11:00–12:30 | หน้า products list + detail + components | `app/products/page.tsx`, `[slug]/page.tsx`, `components/products/` |
| 12:30–13:30 | พัก | |
| 13:30–14:30 | RFQ API (submit + track) | `app/api/rfq/route.ts`, `app/api/rfq/[ref]/route.ts` |
| 14:30–16:30 | หน้า RFQ form (3 tabs + validation) | `app/rfq/page.tsx` |
| 16:30–17:00 | Success + Track pages | `app/rfq/success/page.tsx`, `app/rfq/track/page.tsx` |
| 17:00–17:30 | Landing page minimal | `app/page.tsx` |

**ผลลัพธ์ Day 1:** เว็บรันบน localhost:3000 — ลูกค้าส่ง RFQ ได้จริง admin รับ email ได้จริง

---

## 6. ไฟล์ที่ต้องสร้าง (Day 1)

```
wulab/
├── prisma/seed.ts                       ← seed 3 products + admin + 5 portfolio
│
├── lib/
│   ├── prisma.ts                        ← PrismaClient singleton
│   ├── ref-code.ts                      ← generate SMC-YYYYMMDD-XXXX
│   └── email.ts                         ← Resend: admin alert + customer confirm
│
├── app/
│   ├── globals.css                      ← CSS vars (--navy, --gold, --chalk, etc.)
│   ├── layout.tsx                       ← root HTML + fonts + Navbar + Footer
│   ├── page.tsx                         ← Landing page (Hero, Strengths, CTA)
│   │
│   ├── api/
│   │   ├── products/route.ts            ← GET ?q=&category=&type=
│   │   ├── products/[slug]/route.ts     ← GET single product
│   │   ├── rfq/route.ts                 ← POST submit inquiry
│   │   └── rfq/[ref]/route.ts           ← GET track by refCode
│   │
│   ├── products/
│   │   ├── page.tsx                     ← list + search + filter (client)
│   │   └── [slug]/page.tsx              ← detail + spec table (server)
│   │
│   └── rfq/
│       ├── page.tsx                     ← form 3 tabs (client)
│       ├── success/page.tsx             ← show refCode
│       └── track/page.tsx              ← lookup status
│
└── components/
    ├── layout/
    │   ├── Navbar.tsx
    │   └── Footer.tsx
    ├── products/
    │   ├── ProductCard.tsx              ← badges + ปุ่มตามประเภท
    │   └── ProductSpec.tsx              ← spec JSON → table
    └── rfq/
        └── RFQForm.tsx                  ← 3 tabs form
```

---

## 7. ไฟล์ที่เพิ่มใน Phase 1 (หลัง Day 1)

```
wulab/
├── middleware.ts                        ← next-intl locale detection
├── next.config.ts                       ← withNextIntl wrapper
│
├── messages/
│   ├── th.json                          ← ข้อความภาษาไทยทุกหน้า
│   └── en.json                          ← English strings
│
├── app/
│   └── [locale]/                        ← wrap ทุก page ด้วย locale
│       ├── layout.tsx                   ← NextIntlClientProvider
│       ├── page.tsx
│       ├── about/page.tsx               ← ประวัติ 30 ปี + มอก.
│       ├── products/...
│       └── rfq/...
│
└── components/
    ├── layout/
    │   ├── CartIcon.tsx                  ← badge counter
    │   └── LangToggle.tsx               ← TH/EN switch
    └── cart/
        ├── CartPanel.tsx                 ← slide-out drawer
        └── CartItem.tsx                  ← qty input + note + delete
│
└── lib/
    └── cart-context.tsx                  ← CartContext + useCart + localStorage
```

---

## 8. Tech Stack

| Layer | Technology | เหตุผล |
|-------|-----------|--------|
| Framework | **Next.js 16.2.4** (App Router + Turbopack) | Single repo pages + API routes, fast HMR |
| Language | **TypeScript** | Type safety, fewer runtime errors |
| Styling | **Tailwind CSS 4** | Utility-first, rapid UI |
| ORM | **Prisma 7** | Type-safe DB queries, easy migration |
| DB (dev) | **SQLite** | Zero setup, no Docker |
| DB (prod) | **PostgreSQL** (Vercel Postgres) | Scalable, managed |
| i18n | **next-intl 4** | Thai/English routing `/th/` `/en/` |
| Email | **Resend** | Reliable transactional email, simple API |
| Admin auth | **bcryptjs + JWT** (Phase 2) | Stateless, secure |
| Deploy | **Vercel** | Auto-deploy from GitHub, free tier |
| Mockup dev | **Vite** | HMR สำหรับ HTML mockup ก่อน code จริง |

---

## 9. Database Schema

```
Product
  id, slug (unique), nameTh, nameEn, descTh, descEn
  category: "slab" | "pile" | "pole"
  productType: "standard" | "preorder"
  leadTimeDays: Int? (null สำหรับ standard)
  minOrderQty: String?
  imageUrl, datasheetUrl
  specs: JSON string, useCases: JSON string

Inquiry
  id, refCode (unique, format: SMC-YYYYMMDD-XXXX)
  customerType: "general" | "private" | "government"
  name, phone, email?, lineId?
  company?, projectType?, province?, delivery?, budget?
  govRef? (government only)
  message?
  items: JSON string (รายการสินค้าที่ขอ)
  attachments?: JSON string
  status: "new" | "in_progress" | "completed" | "cancelled"

Admin
  id, username (unique), passwordHash

PortfolioItem
  id, titleTh, titleEn, descTh, descEn
  category, year, imageUrl
```

---

## 10. Reference Code Format

```
SMC-YYYYMMDD-XXXX

ตัวอย่าง: SMC-20260503-0001

Logic:
  1. นับ inquiry ที่สร้างวันนั้น
  2. +1 แล้ว padStart(4, '0')
  3. prefix = "SMC-" + "yyyyMMdd" + "-"
```

---

## 11. Email Flow

```
ลูกค้า submit RFQ
    → POST /api/rfq
    → บันทึก inquiry + สร้าง refCode
    → [fire-and-forget] Resend email → admin@siammasterconcrete.com
    → [fire-and-forget] Resend email → ลูกค้า (ถ้ามีอีเมล)
    → return { refCode }
    → redirect /rfq/success?ref=SMC-...

Admin กดอ่าน email
    → เปิด Prisma Studio หรือ Admin Dashboard (Phase 2)
    → เปลี่ยน status → "in_progress" → "completed"

ลูกค้า track
    → GET /api/rfq/[ref]
    → แสดง status + รายการสินค้า
```

---

## 12. Design System

### Theme: White BG + Navy + Yellow

> พื้นหลักขาวสะอาด — element หลักใช้น้ำเงินเข้ม + เหลืองสด

### Color Tokens

| Token | Value | ใช้ที่ไหน |
|-------|-------|---------|
| `--white` | `#FFFFFF` | Background หลักทุกหน้า |
| `--bg-soft` | `#F4F7FB` | Section alt background (เทาฟ้าอ่อน) |
| `--navy` | `#1A2F6E` | Header, footer, hero section, primary text |
| `--navy-dark` | `#0F1E4A` | Hover states สำหรับ navy |
| `--navy-light` | `#2A4499` | Secondary blue elements |
| `--yellow` | `#F5C200` | Primary CTA buttons, accents, badges |
| `--yellow-dark` | `#D9A800` | Hover state สำหรับ yellow |
| `--yellow-light` | `#FFF3B0` | Yellow tint background (light badge) |
| `--text-dark` | `#1A1A2E` | Body text หลัก |
| `--text-mid` | `#4A5568` | Secondary text, descriptions |
| `--text-muted` | `#9CA3AF` | Placeholder, disabled |
| `--border` | `#E2E8F0` | Dividers, card borders |
| `--green` | `#16A34A` | มอก. badge, success status |
| `--amber` | `#D97706` | Preorder badge, in-progress status |
| `--red` | `#DC2626` | Error, cancelled status |

### การใช้สี

```
Background:     --white  (ทุกหน้า)
Section alt:    --bg-soft (สลับกับ white)

Navbar:         bg --navy | text white | logo yellow
Hero:           bg --navy (full-width) | text white | CTA button yellow
Footer:         bg --navy | text white/muted

Cards:          bg white | border --border | shadow subtle
Primary button: bg --yellow | text --navy | font-bold
Secondary btn:  border --navy | text --navy | hover bg --navy text white
Link:           text --navy | hover text --yellow-dark

Heading (h1):   --navy | Playfair Display
Heading (h2+):  --navy | Sarabun SemiBold
Body:           --text-dark | Sarabun
Code/refCode:   --navy | DM Mono

Badges:
  มอก.:        bg --green text white
  preorder:    bg --amber text white
  standard:    bg --navy-light text white
  
Status colors:
  new:         bg blue-100 text blue-700
  in_progress: bg amber-100 text amber-700
  completed:   bg green-100 text green-700
  cancelled:   bg red-100 text red-700
```

### Typography

| Role | Font | Weight |
|------|------|--------|
| Display / Hero | **Playfair Display** | 700, 900 |
| Heading | **Sarabun** | 600, 700 |
| Body | **Sarabun** | 300, 400 |
| Mono (refCode, specs) | **DM Mono** | 400 |

---

## 13. สิ่งที่ทำเสร็จแล้ว (Setup ✅)

| รายการ | สถานะ |
|--------|-------|
| Next.js 16.2.4 + TypeScript + Tailwind 4 | ✅ |
| Turbopack (`npm run dev`) | ✅ |
| Prisma 7 + SQLite + migration | ✅ |
| Schema: Product, Inquiry, Admin, PortfolioItem | ✅ |
| Fields: productType, leadTimeDays, minOrderQty | ✅ |
| Dependencies: next-intl, resend, bcryptjs, jsonwebtoken | ✅ |
| Vite mockup server (`npm run mockup`) | ✅ |
| Mockups: v2-01 landing, v2-02 products, v2-03 rfq | ✅ |
| .gitignore + push GitHub | ✅ |
| Docs: seed-data, content, architecture, action-plan | ✅ |
| Product types ถูกต้อง (standard/preorder) | ✅ |

---

## 14. Environment Variables

```env
# .env (development)
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-to-32-char-random-string"
RESEND_API_KEY="re_xxxxxxx"
ADMIN_EMAIL="admin@siammasterconcrete.com"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

```
# Vercel (production)
DATABASE_URL          → postgresql://... (Vercel Postgres)
JWT_SECRET            → random 32+ chars
RESEND_API_KEY        → จาก resend.com dashboard
ADMIN_EMAIL           → อีเมลรับแจ้งเตือน RFQ
NEXT_PUBLIC_BASE_URL  → https://xxx.vercel.app
```

---

## 15. Phase 2 — Admin Dashboard

> ทำหลังจาก Phase 1 ใช้งานได้แล้ว

| Feature | รายละเอียด |
|---------|-----------|
| Admin login | POST /api/admin/login, bcrypt verify, JWT cookie (8h) |
| Protected routes | middleware.ts ตรวจ JWT ก่อน render /admin/* |
| Inquiry list | filter สถานะ / วันที่ / ประเภทลูกค้า, pagination |
| Inquiry detail | ดูรายละเอียดทั้งหมด + เปลี่ยน status |
| Product CRUD | เพิ่ม/แก้/ลบสินค้า + upload image + upload PDF |
| Portfolio CRUD | เพิ่ม/แก้/ลบผลงาน |
| Excel export | ดาวน์โหลด inquiry list เป็น .xlsx |
| Dashboard stats | จำนวน inquiry วันนี้ / เดือนนี้ / status breakdown |

---

## 16. Phase 3 — Optional

| Feature | รายละเอียด |
|---------|-----------|
| Customer accounts | register + login + profile |
| Inquiry history | ดูประวัติ RFQ ทั้งหมดของ account |
| Interactive SVG configurator | กด diagram 2D → เลือก spec → เปิด RFQ form |
| Government docs | section เอกสารสำหรับภาครัฐ |

---

## คำสั่งที่ใช้บ่อย

```bash
# Development
npm run dev              # Next.js + Turbopack (http://localhost:3000)
npm run mockup           # Vite HTML mockups (http://localhost:5173)

# Database
npx prisma studio        # GUI ดู/แก้ไข data
npx prisma migrate dev   # สร้าง migration ใหม่
npx prisma db seed       # ใส่ seed data
npx prisma generate      # regenerate Prisma client

# Pre-deploy
npm run build
npm run lint
```

---

> **หมายเหตุสำหรับทีม:**  
> - ไม่มีระบบชำระเงิน — เว็บนี้รับ RFQ เท่านั้น ราคาแจ้งทีหลังโดย admin  
> - ไม่ต่อ ERP/SAP ภายนอก  
> - Admin login ยังไม่อยู่ใน MVP — ใช้ Prisma Studio ดู inquiry ก่อนได้

