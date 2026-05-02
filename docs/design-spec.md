# WuLab — Design Spec
## Landing Page & Inquiry Cart System

> **Version:** 1.0 | **Updated:** 2026-05-02

---

## 1. Design Direction — Landing Page

### แนวคิดหลัก

> **"Industrial Precision"** — แข็งแกร่ง น่าเชื่อถือ ทันสมัย สะอาด

บริษัทคอนกรีตอัดแรงต้องสื่อถึง **ความแข็งแกร่ง ความแม่นยำ และความเชื่อถือได้** ไม่ใช่แค่สวยงาม แต่ต้องให้ลูกค้ารู้สึกว่า "บริษัทนี้ไว้ใจได้"

---

### ชุดสี

```
Primary (หลัก)
  --concrete-dark   #1A1F2E   ← Navy-Charcoal ให้ความหนักแน่น น่าเชื่อถือ
  --concrete-mid    #2C3347   ← Surface / card background
  --concrete-light  #3D4460   ← Border, divider

Accent (เน้น)
  --gold            #C8922A   ← Gold เข้มกว่า amber — สื่อถึงคุณภาพ/premium
  --gold-light      #E8A838   ← Hover state / highlight

Neutral
  --stone           #8A8F9E   ← Body text secondary
  --chalk           #F0EDE8   ← Body text primary (warm white ไม่เย็นเกินไป)
  --concrete-gray   #B0AFA8   ← Subtle text

Success / Trust
  --mok-green       #2A9D5C   ← มอก. badge / certified
```

**ทำไมถึงใช้สีนี้?**

| สี | เหตุผล |
|----|--------|
| Navy-Charcoal | อุตสาหกรรมหนัก, น่าเชื่อถือ, เป็นทางการ — เหมาะกับลูกค้าเอกชนและรัฐ |
| Gold (ไม่ใช่ yellow) | คุณภาพสูง, premium, โดดเด่นบนพื้นเข้ม |
| Warm White | อ่านง่าย ไม่เย็นชา เหมาะกับ font ไทย |
| Green (เฉพาะ มอก.) | สัญลักษณ์ "ผ่านมาตรฐาน" — สีเดียวที่สื่อถึง safety/trust |

---

### Typography

```
Display / Heading (TH):  Playfair Display — serif, editorial, หนักแน่น
Body (TH):               Sarabun — อ่านง่าย, clean, official
Mono / Label:            DM Mono — spec chips, badge, reference code
```

---

### Landing Page Structure

```
┌─────────────────────────────────────────┐
│  NAVBAR                                  │
│  Logo | เมนู | TH/EN | ตะกร้า 🛒 | CTA  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  HERO (full-width, 100vh)               │
│                                          │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │              │  │                  │ │
│  │  Headline    │  │  3 Product Cards │ │
│  │  Subtext     │  │  (float animate) │ │
│  │  CTA buttons │  │                  │ │
│  │  Stats       │  │                  │ │
│  │              │  │                  │ │
│  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  TRUST STRIP                             │
│  มอก. · 30 ปี · โปรเจกต์ที่ผ่านมา      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  PRODUCTS PREVIEW (3 cards)             │
│  ชื่อ + สเปคสั้น + ปุ่ม "เพิ่มลงตะกร้า"│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  STRENGTHS (4 grid)                     │
│  มอก. | Hollow Core หายาก | กำลังผลิต  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  USE CASES                               │
│  Infrastructure | Building | Industrial  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  PORTFOLIO STRIP (ภาพผลงานอ้างอิง)     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  CTA BAND                                │
│  "เริ่มโปรเจกต์ของคุณ" → ขอใบเสนอราคา  │
└─────────────────────────────────────────┘
```

---

## 2. ระบบตะกร้าสินค้า (Inquiry Cart)

### แนวคิด

**ไม่ใช่ตะกร้าซื้อ-ขาย** — แต่เป็น **"ตะกร้าขอใบเสนอราคา"**  
ลูกค้าเลือกสินค้าหลายรายการพร้อมกัน แล้วส่ง RFQ ในครั้งเดียว

```
เลือกสินค้า → ใส่ตะกร้า → กรอกข้อมูลครั้งเดียว → ส่ง RFQ ทีเดียว
```

### ฟีเจอร์

| Feature | รายละเอียด | Priority |
|---------|-----------|----------|
| เพิ่มสินค้าลงตะกร้า | จากหน้าสินค้า หรือหน้าแรก | สูง |
| ระบุปริมาณแต่ละรายการ | จำนวน/ขนาดที่ต้องการ | สูง |
| ไอคอนตะกร้าใน Navbar | แสดงจำนวนสินค้า (badge) | สูง |
| Slide-out Cart Panel | เปิดจาก navbar ไม่ต้องเปลี่ยนหน้า | สูง |
| ลบสินค้าออกจากตะกร้า | กดลบรายการ | สูง |
| ไปหน้า RFQ พร้อมข้อมูล | ตะกร้าถ่ายข้อมูลไปฟอร์มอัตโนมัติ | สูง |
| บันทึกตะกร้า (LocalStorage) | ไม่หายเมื่อ refresh | กลาง |
| จำนวนขั้นต่ำ / หน่วย | แสดง min order / หน่วยสินค้า | กลาง |

---

### Cart Item Structure

```json
{
  "cartItems": [
    {
      "id": "hollow-core",
      "nameTh": "แผ่นพื้นสำเร็จรูป Hollow Core",
      "nameEn": "Hollow Core Slab",
      "quantity": "500",
      "unit": "ตร.ม.",
      "note": "ความหนา 20 ซม."
    },
    {
      "id": "pile",
      "nameTh": "เสาเข็มคอนกรีตอัดแรง",
      "nameEn": "Prestressed Concrete Pile",
      "quantity": "120",
      "unit": "ต้น",
      "note": "ขนาด 0.22 ม. ยาว 12 ม."
    }
  ]
}
```

---

### Cart UI — Slide-out Panel

```
┌──────────────────────────────┐
│  🛒 รายการขอใบเสนอราคา  ×   │
│  ─────────────────────────── │
│                               │
│  [🏢] แผ่นพื้น Hollow Core   │
│       500 ตร.ม.  [−][+]  [🗑]│
│       หมายเหตุ: ความหนา 20ซม.│
│  ─────────────────────────── │
│  [⚓] เสาเข็มคอนกรีตอัดแรง  │
│       120 ต้น    [−][+]  [🗑]│
│  ─────────────────────────── │
│                               │
│  2 รายการ                    │
│                               │
│  [ ดูสินค้าเพิ่ม ]           │
│  [ ขอใบเสนอราคา → ]          │
└──────────────────────────────┘
```

---

### User Flow

```
หน้าแรก / หน้าสินค้า
    ↓ คลิก "เพิ่มลงตะกร้า"
ตะกร้า slide-out เปิด + badge +1
    ↓ เลือกครบแล้ว คลิก "ขอใบเสนอราคา"
หน้า RFQ — สินค้าถูกกรอกล่วงหน้า
    ↓ กรอกข้อมูลส่วนตัว + ประเภทลูกค้า
ส่งคำขอ → รับ Reference Code
```

---

### Component List

| Component | ไฟล์ | หน้าที่ |
|-----------|------|--------|
| `CartContext` | `lib/cart-context.tsx` | Global state — items, add, remove, clear |
| `CartIcon` | `components/layout/CartIcon.tsx` | Navbar icon + badge count |
| `CartPanel` | `components/cart/CartPanel.tsx` | Slide-out drawer |
| `CartItem` | `components/cart/CartItem.tsx` | แต่ละรายการในตะกร้า |
| `AddToCartBtn` | `components/products/AddToCartBtn.tsx` | ปุ่มเพิ่มลงตะกร้า |
| Cart → RFQ | `app/[locale]/rfq/page.tsx` | รับ cart items เป็น initial state |

---

### Database

ไม่ต้องบันทึก Cart ลง DB — ใช้ **localStorage** เท่านั้น  
เมื่อ submit RFQ ค่อยบันทึก Inquiry (พร้อม items array) ลง DB

```prisma
// เพิ่มใน Inquiry model
model Inquiry {
  ...
  items  Json   // [{ id, nameTh, quantity, unit, note }]
  ...
}
```

---

## 3. Navbar (อัปเดต)

```
ซ้าย:  Logo + ชื่อบริษัท
กลาง:  เกี่ยวกับเรา | สินค้า | ผลงาน | ติดต่อ
ขวา:   [TH/EN]  [🛒 2]  [ขอใบเสนอราคา]
                  ↑
              badge แดง แสดงจำนวน
```

---

## 4. Acceptance Criteria

- [ ] ปุ่ม "เพิ่มลงตะกร้า" ปรากฏในทุก Product card
- [ ] Navbar แสดง badge จำนวนสินค้าในตะกร้า
- [ ] Cart panel slide-out จาก navbar ได้
- [ ] เพิ่ม/ลด/ลบรายการในตะกร้าได้
- [ ] กรอกปริมาณและหมายเหตุแต่ละรายการได้
- [ ] กด "ขอใบเสนอราคา" จาก cart → ไปหน้า RFQ พร้อมสินค้าที่เลือก
- [ ] Cart บันทึกใน localStorage — refresh ไม่หาย
- [ ] RFQ บันทึก items array ลงฐานข้อมูล

---

> เอกสารนี้ใช้เป็น input สำหรับเขียน Implementation Plan ในขั้นตอนถัดไป
