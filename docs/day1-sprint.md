# WuLab — Day 1 Sprint Plan
## เช้า 2 ชม. (DB + API) | บ่าย 2 ชม. (Frontend)

> **เป้าหมาย:** ลูกค้าเปิดเว็บ → ดูสินค้า → ส่ง RFQ → ได้ refCode → track สถานะ ✅  
> **ตัดออกทั้งหมด:** Landing page, Cart, i18n, About, Animation

---

## ✅ เช้า — 2 ชั่วโมง (DB + API)

### ชม. 1 — Foundation

**0:00–0:30** `prisma/seed.ts` + รัน seed
```bash
npx prisma db seed
# ตรวจ: npx prisma studio → ต้องเห็น 3 products
```

**0:30–0:45** `lib/prisma.ts` + `lib/ref-code.ts` + `lib/email.ts`

**0:45–1:00** `app/layout.tsx` (root) + `app/globals.css` (CSS vars + fonts)

---

### ชม. 2 — API Routes (4 ไฟล์)

**1:00–1:20** `app/api/products/route.ts`
```ts
GET /api/products?q=&category=&type=
```

**1:20–1:30** `app/api/products/[slug]/route.ts`
```ts
GET /api/products/[slug]
```

**1:30–1:50** `app/api/rfq/route.ts`
```ts
POST /api/rfq → บันทึก DB + refCode + email
```

**1:50–2:00** `app/api/rfq/[ref]/route.ts`
```ts
GET /api/rfq/[ref] → คืน status + items
```

**เช็คจบเช้า:**
```bash
curl http://localhost:3000/api/products
# ต้องได้ JSON 3 สินค้า
```

---

## ✅ บ่าย — 2 ชั่วโมง (Frontend)

### ชม. 1 — Navbar + Products

#### 0:00–0:15 · `components/layout/Navbar.tsx`
- [ ] สร้างไฟล์ `components/layout/Navbar.tsx`
- [ ] ใส่ `<Image src="/logo.png">` ลิงก์กลับ `/products`
- [ ] เมนู: สินค้า (`/products`) | ติดต่อเรา (`/contact`)
- [ ] ปุ่ม "ขอใบเสนอราคา" → ลิงก์ไป `/rfq` (สีเหลือง `#F5C200`, ตัวหนังสือ Navy)
- [ ] Responsive: hamburger menu บน mobile
- [ ] ยังไม่มี cart icon

#### 0:00–0:15 · `components/layout/Footer.tsx`
- [ ] สร้างไฟล์ `components/layout/Footer.tsx`
- [ ] ที่อยู่: 222 หมู่ที่ 5 ตำบลนาสาร อำเภอพระพรหม จังหวัดนครศรีธรรมราช 80000
- [ ] โทร: 075-330-777-9, 075-846-048
- [ ] อีเมล: siammasters@gmail.com
- [ ] Line: @sicon
- [ ] Copyright © 2024 Siam Master Concrete Co., Ltd.

#### 0:15–0:45 · `components/products/ProductCard.tsx`
- [ ] สร้างไฟล์ `components/products/ProductCard.tsx`
- [ ] รับ props: `product` (id, name, slug, type, imageUrl, category, specs)
- [ ] แสดง: รูปสินค้า (next/image) + ชื่อสินค้า + badge ประเภท
- [ ] Badge: `standard` → "พร้อมส่ง" (สีเขียว) | `preorder` → "Pre-order 7-14 วัน" (สีส้ม)
- [ ] ปุ่ม: ถ้า `type === "preorder"` → "ขอใบเสนอราคา" ลิงก์ `/rfq?product={slug}`
- [ ] ปุ่ม: ถ้า `type === "standard"` → "ขอใบเสนอราคา" ลิงก์ `/rfq?product={slug}` (Day 2 ค่อยทำ cart)

#### 0:15–0:45 · `app/products/page.tsx`
- [ ] สร้างไฟล์ `app/products/page.tsx` (Server Component)
- [ ] `fetch("/api/products")` ดึงสินค้าทั้งหมด
- [ ] Search bar: `<input>` → filter ชื่อสินค้า (client-side หรือ query param)
- [ ] Filter type: dropdown "ทั้งหมด / พร้อมส่ง / Pre-order"
- [ ] Grid 3 คอลัมน์ (desktop) / 1 คอลัมน์ (mobile)
- [ ] loop `products.map(p => <ProductCard key={p.id} product={p} />)`
- [ ] ถ้าไม่มีสินค้า: แสดงข้อความ "ไม่พบสินค้า"

#### 0:45–1:00 · `components/products/ProductSpec.tsx`
- [ ] สร้างไฟล์ `components/products/ProductSpec.tsx`
- [ ] รับ props: `specs: Record<string, string | number>`
- [ ] render เป็น `<table>` 2 คอลัมน์: key | value
- [ ] ใช้ DM Mono font สำหรับ value ที่เป็นตัวเลข
- [ ] style: border-bottom แต่ละแถว, bg สลับสี (Navy 5% opacity)

---

### ชม. 2 — RFQ Form + Success + Track

#### 1:00–1:30 · `app/rfq/page.tsx`
- [ ] สร้างไฟล์ `app/rfq/page.tsx` (Client Component `"use client"`)
- [ ] State: `tab` = "individual" | "company" | "government"
- [ ] **Tab bar** 3 ปุ่ม: ทั่วไป / เอกชน / ภาครัฐ (active = Navy bg + white text)
- [ ] **Fields ทั่วไปทุก tab:**
  - [ ] ชื่อ-นามสกุล (required)
  - [ ] เบอร์โทรศัพท์ (required, pattern `[0-9]{9,10}`)
  - [ ] อีเมล (optional)
  - [ ] หมายเหตุ/รายละเอียดเพิ่มเติม (textarea)
- [ ] **Fields เฉพาะ tab เอกชน/ภาครัฐ:**
  - [ ] ชื่อบริษัท/หน่วยงาน (required)
  - [ ] เลขประจำตัวผู้เสียภาษี (optional)
- [ ] **รายการสินค้า:**
  - [ ] `items` state = array of `{ productId, productName, quantity, unit, note }`
  - [ ] ถ้ามี `?product=slug` ใน URL → pre-fill สินค้าแรก
  - [ ] ปุ่ม "+ เพิ่มสินค้า" → append item ว่างใหม่
  - [ ] แต่ละ item: dropdown เลือกสินค้า + input จำนวน + input หน่วย + ปุ่มลบ
  - [ ] ต้องมีอย่างน้อย 1 รายการ (validation)
- [ ] **Validation ก่อน submit:**
  - [ ] ชื่อ, เบอร์โทร ต้องไม่ว่าง
  - [ ] ต้องมีสินค้าอย่างน้อย 1 รายการ
  - [ ] จำนวนต้องเป็นตัวเลข > 0
  - [ ] แสดง error message ใต้ field ที่ผิด
- [ ] **Submit:** `POST /api/rfq` → body `{ type, name, phone, email, company, taxId, items, note }`
- [ ] สำเร็จ → `router.push("/rfq/success?ref=" + data.refCode)`
- [ ] ล้มเหลว → แสดง error toast

#### 1:30–1:45 · `app/rfq/success/page.tsx`
- [ ] สร้างไฟล์ `app/rfq/success/page.tsx` (Client Component)
- [ ] ดึง `ref` จาก `useSearchParams()`
- [ ] แสดง refCode ขนาดใหญ่ font DM Mono (เช่น `SMC-20260503-0001`)
- [ ] ข้อความ: "เราได้รับคำขอใบเสนอราคาของคุณแล้ว ทีมงานจะติดต่อกลับภายใน 1-2 วันทำการ"
- [ ] ปุ่ม "คัดลอก refCode" → `navigator.clipboard.writeText(ref)` + แสดง "คัดลอกแล้ว ✓"
- [ ] ปุ่ม "ติดตามสถานะ" → ลิงก์ `/rfq/track?ref={ref}`
- [ ] ปุ่ม "กลับหน้าสินค้า" → ลิงก์ `/products`

#### 1:45–2:00 · `app/rfq/track/page.tsx`
- [ ] สร้างไฟล์ `app/rfq/track/page.tsx` (Client Component)
- [ ] State: `inputRef`, `result`, `loading`, `error`
- [ ] ถ้ามี `?ref=` ใน URL → pre-fill input + fetch ทันที
- [ ] Input refCode + ปุ่ม "ค้นหา"
- [ ] `GET /api/rfq/{ref}` → แสดงผล
- [ ] **Status badge:**
  - [ ] `pending` → "รับคำขอแล้ว" 🔵 (Navy)
  - [ ] `processing` → "กำลังดำเนินการ" 🟡 (Yellow)
  - [ ] `completed` → "เสร็จสิ้น" 🟢 (Green)
  - [ ] `cancelled` → "ยกเลิก" 🔴 (Red)
- [ ] แสดงตาราง: รายการสินค้า + จำนวน + หน่วย
- [ ] แสดง: วันที่ยื่น + ชื่อลูกค้า + เบอร์โทร
- [ ] ถ้าหา ref ไม่เจอ → "ไม่พบรหัส กรุณาตรวจสอบ refCode อีกครั้ง"

---

### เช็คจบบ่าย (ก่อนปิดวัน)
- [ ] `/products` → เห็น 3 สินค้า + search ทำงาน + filter ทำงาน
- [ ] กดปุ่ม "ขอใบเสนอราคา" → ไปหน้า `/rfq`
- [ ] กรอกฟอร์ม + submit → redirect `/rfq/success?ref=SMC-...`
- [ ] copy refCode ได้
- [ ] ไปหน้า `/rfq/track` → พิมพ์ refCode → เห็น status badge

---

## ไฟล์ทั้งหมด Day 1 (19 ไฟล์)

```
prisma/
  seed.ts                          ← เช้า ชม.1

lib/
  prisma.ts                        ← เช้า ชม.1
  ref-code.ts                      ← เช้า ชม.1
  email.ts                         ← เช้า ชม.1

app/
  globals.css                      ← เช้า ชม.1
  layout.tsx                       ← เช้า ชม.1
  api/
    products/route.ts              ← เช้า ชม.2
    products/[slug]/route.ts       ← เช้า ชม.2
    rfq/route.ts                   ← เช้า ชม.2
    rfq/[ref]/route.ts             ← เช้า ชม.2
  products/
    page.tsx                       ← บ่าย ชม.1
  rfq/
    page.tsx                       ← บ่าย ชม.2
    success/page.tsx               ← บ่าย ชม.2
    track/page.tsx                 ← บ่าย ชม.2

components/
  layout/
    Navbar.tsx                     ← บ่าย ชม.1
    Footer.tsx                     ← บ่าย ชม.1
  products/
    ProductCard.tsx                ← บ่าย ชม.1
    ProductSpec.tsx                ← บ่าย ชม.1
```

---

## ❌ ข้ามทั้งหมด (ทำ Day 2+)

| ข้าม | ทำวันไหน |
|------|---------|
| Landing page (`app/page.tsx`) | Day 2 — `/` redirect ไป `/products` แทน |
| Product detail (`/products/[slug]`) | Day 2 |
| Cart (CartContext, CartPanel, CartIcon) | Day 2 |
| i18n / next-intl / [locale] | Day 3 |
| About page | Day 3 |
| Animation ทั้งหมด | Day 4+ |

---

## User Flow ที่ต้องทำงานได้จบ Day 1

```
/products
  → เห็น 3 สินค้า (search ได้, filter ได้)
  → กดปุ่ม "ขอใบเสนอราคา"

/rfq
  → เลือก tab ประเภทลูกค้า
  → กรอก ชื่อ + เบอร์ + สินค้า + ปริมาณ
  → กด submit → POST /api/rfq

/rfq/success?ref=SMC-20260503-0001
  → เห็น refCode

/rfq/track
  → พิมพ์ SMC-20260503-0001
  → เห็น status "รับคำขอแล้ว" 🔵
```

---

## Environment Variables (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-change-this-in-production-min32chars"

RESEND_API_KEY="re_xxxx"                        # ← สมัคร resend.com (ฟรี)
ADMIN_EMAIL="admin@siammasterconcrete.com"      # ← อีเมลรับแจ้ง RFQ
RESEND_FROM_EMAIL="noreply@siammasterconcrete.com"  # ← ต้อง verify domain

NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**ถ้ายังไม่มี Resend API key:**
- email จะ fail แบบ silent (fire-and-forget — ไม่ crash ระบบ)
- RFQ ยังบันทึก DB + refCode ปกติ
- ทดสอบ flow ได้ครบ แค่ไม่มี email ส่ง

**ขั้นตอนขอ Resend API key (5 นาที):**
1. สมัคร resend.com (ฟรี 3,000 email/เดือน)
2. Settings → API Keys → Create API Key
3. ใส่ใน `.env` → `RESEND_API_KEY="re_xxx..."`
4. Domains → Add Domain → verify DNS (ถ้าต้องการ from email จริง)

## หมายเหตุ

- รูปสินค้าอยู่ที่ `public/images/` พร้อมแล้ว
- Logo อยู่ที่ `public/logo.png` พร้อมแล้ว
