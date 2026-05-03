# WuLab — Seed Data Spec
## Siam Master Concrete Co., Ltd.

> **Updated:** 2026-05-03
> ข้อมูลนี้ใช้เป็น input สำหรับ `prisma/seed.ts` — ข้อมูลจริงทุกรายการ

---

## ข้อมูลบริษัท (จากโบรชัวร์จริง)

```
ชื่อ:      บริษัท สยามมาสเตอร์คอนกรีต จำกัด (SICON)
ก่อตั้ง:   พ.ศ. 2537 (1994)
ที่อยู่:   222 หมู่ที่ 5 ตำบลนาสาร อำเภอพระพรหม
           จังหวัดนครศรีธรรมราช 80000
โทร:       075-330-777-9, 075-846-048
อีเมล:     siaммasters@gmail.com
Line:      @sicon
มาตรฐาน:  ISO 9001:2015 + มอก. หลายรายการ
```

## รูปภาพที่มี (public/images/)

| ไฟล์ | เนื้อหา | ใช้ใน |
|------|---------|-------|
| `logo.png` | โลโก้บริษัท | Navbar, Footer, Hero |
| `hollow-core-slab.jpg` | กองแผ่นพื้น HC ในโรงงาน | Product card + detail |
| `hollow-core-factory.jpg` | มุมกว้างโรงงาน HC | About / Hero background |
| `hollow-core-lifting.jpg` | ยกแผ่นพื้น HC ด้วยเครน | Product detail |
| `hollow-core-extruder.jpg` | เครื่อง Extruder กำลังผลิต | About / Process section |
| `prestressed-pile.jpg` | เสาเข็มแดง รอขนส่ง | Product card + detail |
| `prestressed-pile-factory.jpg` | โรงงานผลิตเสาเข็มตัวไอ | Product detail |
| `hollow-core-datasheet.jpg` | ตาราง Load + diagram HC | Datasheet reference |
| `pile-sq-datasheet.jpg` | Spec เสาเข็มสี่เหลี่ยมต้น | Datasheet reference |
| `pile-i-sh-datasheet.jpg` | Spec เสาเข็มตัวไอ + กลวง + รั้ว | Datasheet reference |
| `girder-datasheet.jpg` | Spec คานสะพาน | Datasheet reference |
| `company-brochure.jpg` | โบรชัวร์บริษัทเต็มใบ | About page |

---

## ประเภทสินค้า (productType)

| Value | ความหมาย | UI Label TH | UI Label EN |
|-------|---------|-------------|-------------|
| `standard` | สินค้ามาตรฐาน — ขนาดตายตัว ผลิตเป็น batch สม่ำเสมอ | สินค้ามาตรฐาน | Standard Product |
| `preorder` | Pre-order — ผลิตตามสั่ง ต้องติดต่อก่อน มี lead time | สั่งผลิตพิเศษ | Pre-Order / Custom |

**พฤติกรรม UI แตกต่างกัน:**

| | Standard | Pre-order |
|--|---------|---------|
| ปุ่มหน้าสินค้า | เพิ่มลงตะกร้า | ขอใบเสนอราคา (ไปฟอร์ม RFQ โดยตรง) |
| Cart | เพิ่มได้ปกติ | ไม่ผ่าน cart — RFQ โดยตรง |
| Badge | — | "สั่งผลิตพิเศษ" (amber) |
| Lead time | — | แสดง "ระยะเวลาผลิต X วัน" |
| Min order | แสดงปริมาณสั่งขั้นต่ำ | แสดงปริมาณสั่งขั้นต่ำ |

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

### Product 1 — แผ่นพื้น Hollow Core ✦ Pre-order

> ราคาต่อตารางเมตร แบ่งตามความหนา | มาตรฐาน มอก. 828-2549  
> สูตร: **ราคารวม = ราคาต่อ ตร.ม. × จำนวน ตร.ม. ที่สั่ง**

```ts
{
  slug: "hollow-core-slab",
  nameTh: "แผ่นพื้นสำเร็จรูป Hollow Core",
  nameEn: "Hollow Core Slab",
  category: "slab",
  productType: "preorder",
  minOrderQty: "120 ตร.ม.",
  leadTimeDays: 14,
  descTh: "แผ่นพื้นสำเร็จรูปที่มีช่องกลวงภายใน (Hollow Core) ผลิตด้วยเครื่อง Extruder มาตรฐานยุโรป ผ่านมาตรฐาน มอก. 828-2549 ลดน้ำหนักโครงสร้างได้ถึง 40% เมื่อเทียบกับแผ่นพื้นทึบ กำลังรับน้ำหนักสูง ช่วงพาดยาวได้ถึง 18 เมตรโดยไม่ต้องมีเสากลาง เหมาะสำหรับคลังสินค้า อาคารพาณิชย์ และโครงการขนาดใหญ่",
  descEn: "Hollow Core Slabs certified to TIS 828-2549 with European-standard Extruder. Reduces dead load by up to 40%. Spans up to 18 m. Made to order by thickness and area.",
  imageUrl: "/images/hollow-core-slab.jpg",
  datasheetUrl: "/datasheets/hollow-core-slab.pdf",
  specs: {
    standard: "มอก. 828-2549",
    width: "1.20 ม.",
    maxLength: "18 ม.",
    concreteGrade: "fck = 40 MPa",
    prestressType: "Pre-tensioned",
    unit: "ตร.ม.",
    pricingNote: "ราคารวม = ราคาต่อ ตร.ม. × จำนวน ตร.ม. ที่สั่ง",
    pricing: [
      { thicknessCm: "8 ซม.",  thickness: 0.08, pricePerSqm: 370 },
      { thicknessCm: "10 ซม.", thickness: 0.10, pricePerSqm: 390 },
      { thicknessCm: "12 ซม.", thickness: 0.12, pricePerSqm: 410 },
      { thicknessCm: "15 ซม.", thickness: 0.15, pricePerSqm: 450 },
      { thicknessCm: "20 ซม.", thickness: 0.20, pricePerSqm: 470 },
      { thicknessCm: "25 ซม.", thickness: 0.25, pricePerSqm: 490 },
      { thicknessCm: "30 ซม.", thickness: 0.30, pricePerSqm: 510 },
    ]
    // ตัวอย่าง: ความหนา 20 ซม. × 300 ตร.ม. = 470 × 300 = 141,000 บาท
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

### Product 2 — เสาเข็มคอนกรีตอัดแรง ✦ Pre-order

> มี 2 รูปทรง: **สี่เหลี่ยมต้น** และ **รูปตัวไอ** — ราคาต่างกัน  
> ราคา = ราคาต่อเมตร × ความยาว(m)

```ts
{
  slug: "prestressed-concrete-pile",
  nameTh: "เสาเข็มคอนกรีตอัดแรง",
  nameEn: "Prestressed Concrete Pile",
  category: "pile",
  productType: "preorder",
  minOrderQty: "6 ม./ต้น",     // ความยาวขั้นต่ำในการสั่ง = 6 เมตร
  leadTimeDays: 14,             // 7–14 วันหลังยืนยันออร์เดอร์
  descTh: "เสาเข็มคอนกรีตอัดแรง ผ่านมาตรฐาน มอก. 396-2549 มีให้เลือก 2 รูปทรง ได้แก่ หน้าตัดสี่เหลี่ยมต้น และรูปตัวไอ รับแรงกดอัดและแรงดึงได้สูง เหมาะสำหรับงานรากฐานอาคารพักอาศัย อาคารพาณิชย์ โรงงาน และโครงสร้างพื้นฐาน",
  descEn: "Prestressed concrete pile certified to TIS 396-2549. Available in square and I-shape cross-sections. High compressive and tensile strength. Suitable for residential, commercial, industrial, and infrastructure foundations.",
  imageUrl: "/images/prestressed-pile.jpg",
  datasheetUrl: "/datasheets/prestressed-pile.pdf",
  specs: {
    standard: "มอก. 396-2549",
    concreteGrade: "fck = 35 MPa",
    prestressType: "Pre-tensioned",
    unit: "ต้น",
    // ตารางราคา — ราคาต่อต้น = pricePerMeter × length
    pricingNote: "ราคาต่อต้น = ราคาต่อเมตร × ความยาว",
    // 3 รูปทรง — จาก datasheet จริง
    shapes: [
      {
        shape: "สี่เหลี่ยมต้น (SQ)",
        shapeEn: "Square Section",
        // ขนาดจาก datasheet: 15,18,22,26,30,35,40,45 cm
        sizes: ["15×15","18×18","22×22","26×26","30×30","35×35","40×40","45×45"],
        maxLength: { "15×15":6,"18×18":14,"22×22":19,"26×26":22,"30×30":24,"35×35":25,"40×40":27,"45×45":27 },
        // ราคาจาก PO list (ขนาดที่มีราคา 22–40 cm, ความยาว 6 ม.)
        pricing: [
          { size: "0.22×0.22", length: 6, pricePerMeter: 250, pricePerUnit: 1500 },
          { size: "0.26×0.26", length: 6, pricePerMeter: 280, pricePerUnit: 1680 },
          { size: "0.30×0.30", length: 6, pricePerMeter: 310, pricePerUnit: 1860 },
          { size: "0.35×0.35", length: 6, pricePerMeter: 340, pricePerUnit: 2040 },
          { size: "0.40×0.40", length: 6, pricePerMeter: 370, pricePerUnit: 2220 }
        ]
      },
      {
        shape: "รูปตัวไอ (I)",
        shapeEn: "I-Shape Section",
        sizes: ["15×15","18×18","22×22","26×26"],
        maxLength: { "15×15":6,"18×18":14,"22×22":18,"26×26":21 },
        pricing: [
          { size: "0.22×0.22", length: 6, pricePerMeter: 230, pricePerUnit: 1380 },
          { size: "0.26×0.26", length: 6, pricePerMeter: 260, pricePerUnit: 1560 },
          { size: "0.30×0.30", length: 6, pricePerMeter: 290, pricePerUnit: 1740 },
          { size: "0.35×0.35", length: 6, pricePerMeter: 320, pricePerUnit: 1920 },
          { size: "0.40×0.40", length: 6, pricePerMeter: 350, pricePerUnit: 2100 }
        ]
      },
      {
        shape: "สี่เหลี่ยมกลวง (SH)",
        shapeEn: "Hollow Square Section",
        sizes: ["15×15","18×18","22×22","26×26"],
        maxLength: { "15×15":6,"18×18":14,"22×22":19,"26×26":22 },
        pricing: [] // ราคาตามใบเสนอราคา — ติดต่อสอบถาม
      }
    ]
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

### Product 3 — เสาไฟฟ้าคอนกรีตอัดแรง ✦ Standard

> ราคามาตรฐาน กฟภ — fixed price ต่อความยาว

```ts
{
  slug: "prestressed-concrete-pole",
  nameTh: "เสาไฟฟ้าคอนกรีตอัดแรง",
  nameEn: "Prestressed Concrete Utility Pole",
  category: "pole",
  productType: "standard",
  minOrderQty: null,            // ไม่มีขั้นต่ำ
  leadTimeDays: null,
  descTh: "เสาไฟฟ้าคอนกรีตอัดแรงทรงกลม (Spun) ผ่านมาตรฐาน มอก. 397 และราคามาตรฐาน กฟภ ผลิตด้วยระบบหมุนเหวี่ยงแรงเหวี่ยงสูง (High-speed Centrifugal Casting) ทำให้คอนกรีตแน่น กำลังอัดสูง ทนต่อสภาพอากาศและแรงลม พร้อมส่งจากสต็อก",
  descEn: "Spun prestressed concrete utility pole certified to TIS 397 at PEA standard pricing. High-strength, weather and wind resistant. In-stock sizes available.",
  imageUrl: "/images/concrete-pole.jpg",
  datasheetUrl: "/datasheets/concrete-pole.pdf",
  specs: {
    standard: "มอก. 397-2524",
    priceStandard: "ราคามาตรฐาน กฟภ",
    concreteGrade: "fck = 45 MPa",
    prestressType: "Pre-tensioned (Spun)",
    unit: "ต้น",
    // ตารางราคา fixed ต่อความยาว
    pricing: [
      { length: 8,    pricePerUnit: 4000 },
      { length: 9,    pricePerUnit: 4500 },
      { length: 12,   pricePerUnit: 6000 },
      { length: 12.2, pricePerUnit: 8000 }
    ]
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
    category: "warehouse", year: 2024,
    imageUrl: "/images/portfolio/portfolio-01.jpg"
  },
  {
    titleTh: "อาคารพาณิชย์ เชียงใหม่",
    titleEn: "Chiang Mai Commercial Complex",
    descTh: "เสาเข็มคอนกรีตอัดแรง ขนาด 0.22 ม. จำนวน 320 ต้น",
    descEn: "220mm Prestressed Piles, 320 units",
    category: "commercial", year: 2023,
    imageUrl: "/images/portfolio/portfolio-02.jpg"
  },
  {
    titleTh: "โรงงานผลิตชิ้นส่วนยานยนต์",
    titleEn: "Automotive Parts Factory",
    descTh: "แผ่นพื้น Hollow Core รวม 12,000 ตร.ม.",
    descEn: "Hollow Core combined 12,000 sqm",
    category: "industrial", year: 2024,
    imageUrl: "/images/portfolio/portfolio-03.jpg"
  },
  {
    titleTh: "ระบบไฟฟ้าชุมชน ภาคตะวันออก",
    titleEn: "Eastern Region Power Grid",
    descTh: "เสาไฟฟ้าคอนกรีตอัดแรง ขนาด 12 ม. จำนวน 450 ต้น",
    descEn: "12m Prestressed Concrete Poles, 450 units",
    category: "utility", year: 2023,
    imageUrl: "/images/portfolio/portfolio-04.jpg"
  },
  {
    titleTh: "ศูนย์กระจายสินค้า E-Commerce",
    titleEn: "E-Commerce Distribution Center",
    descTh: "แผ่นพื้น Hollow Core 2 ชั้น พื้นที่รวม 15,000 ตร.ม.",
    descEn: "2-story Hollow Core, 15,000 sqm total",
    category: "warehouse", year: 2025,
    imageUrl: "/images/portfolio/portfolio-05.jpg"
  }
]
```

---

## Reference Code Format

```
SMC-YYYYMMDD-XXXX
ตัวอย่าง: SMC-20260502-0001

Logic:
  1. นับ inquiry ที่สร้างวันนั้น
  2. +1 แล้ว padStart(4, '0')
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
