# WuLab — Seed Data Spec
## Siam Master Concrete Co., Ltd.

> **Updated:** 2026-05-03
> ข้อมูลนี้ใช้เป็น input สำหรับ `prisma/seed.ts` — ข้อมูลจริงทุกรายการ

---

## Admin Account (1 record)

```ts
{
  username: "admin",
  password: "Admin@SMC2024",   // bcrypt hash ใน seed จริง
}
```

> เปลี่ยน password ก่อน deploy production

---

## Products (3 records)

### Product 1 — แผ่นพื้น Hollow Core

```ts
{
  slug: "hollow-core-slab",
  nameTh: "แผ่นพื้นสำเร็จรูป Hollow Core",
  nameEn: "Hollow Core Slab",
  category: "slab",
  descTh: "แผ่นพื้นสำเร็จรูปที่มีช่องกลวงภายใน (Hollow Core) ผลิตด้วยเครื่อง Extruder มาตรฐานยุโรป ลดน้ำหนักโครงสร้างได้ถึง 40% เมื่อเทียบกับแผ่นพื้นทึบ กำลังรับน้ำหนักสูง ช่วงพาดยาวได้ถึง 18 เมตรโดยไม่ต้องมีเสากลาง เหมาะสำหรับคลังสินค้า อาคารพาณิชย์ และโครงการขนาดใหญ่",
  descEn: "Hollow Core Slabs manufactured with a European-standard Extruder machine. Reduces structural dead load by up to 40% compared to solid slabs. High load-bearing capacity with spans up to 18 m without intermediate columns. Ideal for warehouses, commercial buildings, and large-scale projects.",
  imageUrl: "/images/hollow-core-slab.jpg",
  datasheetUrl: "/datasheets/hollow-core-slab.pdf",
  specs: {
    standard: "มอก. 828-2531",
    thickness: ["15 ซม.", "20 ซม.", "25 ซม.", "30 ซม."],
    width: "1.20 ม.",
    maxLength: "18 ม.",
    concreteGrade: "fck = 40 MPa",
    prestressType: "Pre-tensioned",
    minOrder: "100 ตร.ม.",
    unit: "ตร.ม."
  },
  useCases: [
    { th: "คลังสินค้า / ศูนย์กระจายสินค้า", en: "Warehouses / Distribution Centers" },
    { th: "อาคารพาณิชย์ / สำนักงาน", en: "Commercial Buildings / Offices" },
    { th: "โรงงานอุตสาหกรรม", en: "Industrial Factories" },
    { th: "อาคารจอดรถ", en: "Parking Structures" },
    { th: "อาคารที่พักอาศัยขนาดใหญ่", en: "Large Residential Buildings" }
  ]
}
```

---

### Product 2 — เสาเข็มคอนกรีตอัดแรง

```ts
{
  slug: "prestressed-concrete-pile",
  nameTh: "เสาเข็มคอนกรีตอัดแรง",
  nameEn: "Prestressed Concrete Pile",
  category: "pile",
  descTh: "เสาเข็มคอนกรีตอัดแรงหน้าตัดสี่เหลี่ยม ผ่านมาตรฐาน มอก. 396 รับแรงกดอัดและแรงดึงได้สูง เหมาะสำหรับงานรากฐานอาคารพักอาศัย อาคารพาณิชย์ โรงงาน และโครงสร้างพื้นฐาน",
  descEn: "Square cross-section prestressed concrete pile certified to TIS 396. High compressive and tensile strength. Suitable for foundations of residential, commercial, industrial, and infrastructure projects.",
  imageUrl: "/images/prestressed-pile.jpg",
  datasheetUrl: "/datasheets/prestressed-pile.pdf",
  specs: {
    standard: "มอก. 396-2549",
    sizes: ["0.18 × 0.18 ม.", "0.22 × 0.22 ม.", "0.26 × 0.26 ม.", "0.30 × 0.30 ม.", "0.35 × 0.35 ม."],
    lengths: ["6 ม.", "8 ม.", "10 ม.", "12 ม.", "14 ม.", "16 ม.", "18 ม.", "20 ม.", "24 ม."],
    concreteGrade: "fck = 35 MPa",
    prestressType: "Pre-tensioned",
    minOrder: "50 ต้น",
    unit: "ต้น"
  },
  useCases: [
    { th: "รากฐานอาคารพักอาศัย", en: "Residential Building Foundations" },
    { th: "รากฐานอาคารพาณิชย์และโรงงาน", en: "Commercial & Factory Foundations" },
    { th: "งานโครงสร้างพื้นฐาน", en: "Infrastructure Works" },
    { th: "งานท่าเรือและเขื่อน", en: "Port & Dam Structures" }
  ]
}
```

---

### Product 3 — เสาไฟฟ้าคอนกรีตอัดแรง

```ts
{
  slug: "prestressed-concrete-pole",
  nameTh: "เสาไฟฟ้าคอนกรีตอัดแรง",
  nameEn: "Prestressed Concrete Utility Pole",
  category: "pole",
  descTh: "เสาไฟฟ้าคอนกรีตอัดแรงทรงกลม (Spun Pile) ผ่านมาตรฐาน มอก. 397 ผลิตด้วยระบบหมุนเหวี่ยงแรงเหวี่ยงสูง (High-speed Centrifugal Casting) ทำให้คอนกรีตแน่น กำลังอัดสูง ทนต่อสภาพอากาศและแรงลม เหมาะสำหรับระบบสายส่งไฟฟ้า",
  descEn: "Spun prestressed concrete utility pole certified to TIS 397. Manufactured using high-speed centrifugal casting for dense, high-strength concrete. Weather and wind resistant. Designed for power transmission and distribution systems.",
  imageUrl: "/images/concrete-pole.jpg",
  datasheetUrl: "/datasheets/concrete-pole.pdf",
  specs: {
    standard: "มอก. 397-2524",
    diameters: ["0.15 ม. (6 นิ้ว)", "0.20 ม. (8 นิ้ว)", "0.25 ม. (10 นิ้ว)"],
    lengths: ["8 ม.", "9 ม.", "10 ม.", "12 ม.", "14 ม.", "16 ม.", "18 ม."],
    concreteGrade: "fck = 45 MPa",
    prestressType: "Pre-tensioned (Spun)",
    minOrder: "20 ต้น",
    unit: "ต้น"
  },
  useCases: [
    { th: "สายส่งไฟฟ้าแรงสูง", en: "High-Voltage Transmission Lines" },
    { th: "ระบบจำหน่ายไฟฟ้า", en: "Power Distribution Systems" },
    { th: "เสาโทรศัพท์และสื่อสาร", en: "Telecom & Communication Poles" },
    { th: "ไฟถนนและไฟสาธารณะ", en: "Street Lighting" }
  ]
}
```

---

## Portfolio Items (5 records)

```ts
[
  {
    titleTh: "คลังสินค้า บริษัท ABC โลจิสติกส์",
    titleEn: "ABC Logistics Warehouse",
    descTh: "แผ่นพื้น Hollow Core ขนาด 20 ซม. พื้นที่ 8,000 ตร.ม.",
    descEn: "20 cm Hollow Core Slabs, 8,000 sqm floor area",
    category: "warehouse",
    year: 2024,
    imageUrl: "/images/portfolio/portfolio-01.jpg"
  },
  {
    titleTh: "อาคารพาณิชย์ เชียงใหม่",
    titleEn: "Chiang Mai Commercial Complex",
    descTh: "เสาเข็มคอนกรีตอัดแรง ขนาด 0.22 ม. จำนวน 320 ต้น",
    descEn: "220mm Prestressed Piles, 320 units",
    category: "commercial",
    year: 2023,
    imageUrl: "/images/portfolio/portfolio-02.jpg"
  },
  {
    titleTh: "โรงงานผลิตชิ้นส่วยยานยนต์",
    titleEn: "Automotive Parts Factory",
    descTh: "แผ่นพื้น Double-T และ Hollow Core รวม 12,000 ตร.ม.",
    descEn: "Double-T and Hollow Core combined 12,000 sqm",
    category: "industrial",
    year: 2024,
    imageUrl: "/images/portfolio/portfolio-03.jpg"
  },
  {
    titleTh: "ระบบไฟฟ้าชุมชน ภาคตะวันออก",
    titleEn: "Eastern Region Power Grid",
    descTh: "เสาไฟฟ้าคอนกรีตอัดแรง ขนาด 12 ม. จำนวน 450 ต้น",
    descEn: "12m Prestressed Concrete Poles, 450 units",
    category: "utility",
    year: 2023,
    imageUrl: "/images/portfolio/portfolio-04.jpg"
  },
  {
    titleTh: "ศูนย์กระจายสินค้า E-Commerce",
    titleEn: "E-Commerce Distribution Center",
    descTh: "แผ่นพื้น Hollow Core 2 ชั้น พื้นที่รวม 15,000 ตร.ม.",
    descEn: "2-story Hollow Core, 15,000 sqm total",
    category: "warehouse",
    year: 2025,
    imageUrl: "/images/portfolio/portfolio-05.jpg"
  }
]
```

---

## Reference Code Format

```
SMC-YYYYMMDD-XXXX

ตัวอย่าง:
  SMC-20260502-0001   ← inquiry แรกของวันที่ 2026-05-02
  SMC-20260502-0002   ← inquiry ที่สองของวันเดียวกัน

Logic:
  1. นับจำนวน inquiry ที่สร้างในวันนั้น
  2. เพิ่ม 1 แล้ว format เป็น 4 หลัก (padStart 4, '0')
  3. prefix = "SMC-" + format(today, "yyyyMMdd") + "-"
```

---

## Inquiry Status Values

| Value | Label TH | Label EN | สี |
|-------|----------|----------|-----|
| `new` | รับคำขอแล้ว | Received | Blue |
| `in_progress` | กำลังดำเนินการ | In Progress | Amber |
| `completed` | ส่งใบเสนอราคาแล้ว | Completed | Green |
| `cancelled` | ยกเลิก | Cancelled | Red |

---

## Customer Type Values

| Value | Label TH | ฟอร์มพิเศษ |
|-------|----------|-----------|
| `general` | ทั่วไป / บุคคล | — |
| `private` | บริษัท / เอกชน | + ชื่อบริษัท, ประเภทโครงการ |
| `government` | หน่วยงานภาครัฐ | + ชื่อหน่วยงาน, เลขที่หนังสือราชการ |
