import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const dbUrl = (process.env.DATABASE_URL ?? "file:./dev.db").replace("file://", "").replace("file:", "");
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`✅ Already seeded (${existing} products), skipping.`);
    return;
  }

  console.log("🌱 Seeding database...");

  await prisma.portfolioItem.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.product.deleteMany();
  await prisma.admin.deleteMany();

  // Admin
  const passwordHash = await bcrypt.hash("admin", 12);
  await prisma.admin.create({
    data: { username: "admin", passwordHash },
  });
  console.log("✅ Admin created");

  // Product 1 — แผ่นพื้น Hollow Core
  await prisma.product.create({
    data: {
      slug: "hollow-core-slab",
      nameTh: "แผ่นพื้นสำเร็จรูป Hollow Core",
      nameEn: "Hollow Core Slab",
      category: "slab",
      productType: "preorder",
      minOrderQty: "120 ตร.ม.",
      leadTimeDays: 14,
      descTh:
        "แผ่นพื้นสำเร็จรูปที่มีช่องกลวงภายใน (Hollow Core) ผลิตด้วยเครื่อง Extruder มาตรฐานยุโรป ผ่านมาตรฐาน มอก. 828-2549 ลดน้ำหนักโครงสร้างได้ถึง 40% เมื่อเทียบกับแผ่นพื้นทึบ กำลังรับน้ำหนักสูง ช่วงพาดยาวได้ถึง 18 เมตรโดยไม่ต้องมีเสากลาง เหมาะสำหรับคลังสินค้า อาคารพาณิชย์ และโครงการขนาดใหญ่",
      descEn:
        "Hollow Core Slabs certified to TIS 828-2549 with European-standard Extruder. Reduces dead load by up to 40%. Spans up to 18 m. Made to order by thickness and area.",
      imageUrl: "/images/products/slab.jpg",
      datasheetUrl: "/datasheets/hollow-core-slab.pdf",
      specs: JSON.stringify({
        standard: "มอก. 828-2549",
        width: "1.20 ม.",
        maxLength: "18 ม.",
        concreteGrade: "fck = 40 MPa",
        prestressType: "Pre-tensioned",
        unit: "ตร.ม.",
        pricingNote: "ราคารวม = ราคาต่อ ตร.ม. × จำนวน ตร.ม. ที่สั่ง",
        pricing: [
          { thicknessCm: "8 ซม.", thickness: 0.08, pricePerSqm: 370 },
          { thicknessCm: "10 ซม.", thickness: 0.10, pricePerSqm: 390 },
          { thicknessCm: "12 ซม.", thickness: 0.12, pricePerSqm: 410 },
          { thicknessCm: "15 ซม.", thickness: 0.15, pricePerSqm: 450 },
          { thicknessCm: "20 ซม.", thickness: 0.20, pricePerSqm: 470 },
          { thicknessCm: "25 ซม.", thickness: 0.25, pricePerSqm: 490 },
          { thicknessCm: "30 ซม.", thickness: 0.30, pricePerSqm: 510 },
        ],
      }),
      useCases: JSON.stringify([
        { th: "คลังสินค้า / ศูนย์กระจายสินค้า", en: "Warehouses / Distribution Centers" },
        { th: "อาคารพาณิชย์ / สำนักงาน", en: "Commercial Buildings / Offices" },
        { th: "โรงงานอุตสาหกรรม", en: "Industrial Factories" },
        { th: "อาคารจอดรถ", en: "Parking Structures" },
        { th: "อาคารที่พักอาศัยขนาดใหญ่", en: "Large Residential Buildings" },
      ]),
    },
  });

  // Product 2 — เสาเข็มคอนกรีตอัดแรง
  await prisma.product.create({
    data: {
      slug: "prestressed-concrete-pile",
      nameTh: "เสาเข็มคอนกรีตอัดแรง",
      nameEn: "Prestressed Concrete Pile",
      category: "pile",
      productType: "preorder",
      minOrderQty: "6 ม./ต้น",
      leadTimeDays: 14,
      descTh:
        "เสาเข็มคอนกรีตอัดแรง ผ่านมาตรฐาน มอก. 396-2549 มีให้เลือก 3 รูปทรง ได้แก่ หน้าตัดสี่เหลี่ยมต้น รูปตัวไอ และสี่เหลี่ยมกลวง รับแรงกดอัดและแรงดึงได้สูง เหมาะสำหรับงานรากฐานอาคารพักอาศัย อาคารพาณิชย์ โรงงาน และโครงสร้างพื้นฐาน",
      descEn:
        "Prestressed concrete pile certified to TIS 396-2549. Available in square, I-shape, and hollow square cross-sections. High compressive and tensile strength.",
      imageUrl: "/images/products/pile.jpg",
      datasheetUrl: "/datasheets/prestressed-pile.pdf",
      specs: JSON.stringify({
        standard: "มอก. 396-2549",
        concreteGrade: "fck = 35 MPa",
        prestressType: "Pre-tensioned",
        unit: "ต้น",
        pricingNote: "ราคาต่อต้น = ราคาต่อเมตร × ความยาว",
        shapes: [
          {
            shape: "สี่เหลี่ยมต้น (SQ)",
            shapeEn: "Square Section",
            sizes: ["15×15", "18×18", "22×22", "26×26", "30×30", "35×35", "40×40", "45×45"],
            pricing: [
              { size: "0.22×0.22", length: 6, pricePerMeter: 250, pricePerUnit: 1500 },
              { size: "0.26×0.26", length: 6, pricePerMeter: 280, pricePerUnit: 1680 },
              { size: "0.30×0.30", length: 6, pricePerMeter: 310, pricePerUnit: 1860 },
              { size: "0.35×0.35", length: 6, pricePerMeter: 340, pricePerUnit: 2040 },
              { size: "0.40×0.40", length: 6, pricePerMeter: 370, pricePerUnit: 2220 },
            ],
          },
          {
            shape: "รูปตัวไอ (I)",
            shapeEn: "I-Shape Section",
            sizes: ["15×15", "18×18", "22×22", "26×26"],
            pricing: [
              { size: "0.22×0.22", length: 6, pricePerMeter: 230, pricePerUnit: 1380 },
              { size: "0.26×0.26", length: 6, pricePerMeter: 260, pricePerUnit: 1560 },
              { size: "0.30×0.30", length: 6, pricePerMeter: 290, pricePerUnit: 1740 },
              { size: "0.35×0.35", length: 6, pricePerMeter: 320, pricePerUnit: 1920 },
              { size: "0.40×0.40", length: 6, pricePerMeter: 350, pricePerUnit: 2100 },
            ],
          },
          {
            shape: "สี่เหลี่ยมกลวง (SH)",
            shapeEn: "Hollow Square Section",
            sizes: ["15×15", "18×18", "22×22", "26×26"],
            pricing: [],
          },
        ],
      }),
      useCases: JSON.stringify([
        { th: "รากฐานอาคารพักอาศัย", en: "Residential Building Foundations" },
        { th: "รากฐานอาคารพาณิชย์และโรงงาน", en: "Commercial & Factory Foundations" },
        { th: "งานโครงสร้างพื้นฐาน", en: "Infrastructure Works" },
        { th: "งานท่าเรือและเขื่อน", en: "Port & Dam Structures" },
      ]),
    },
  });

  // Product 3 — เสาไฟฟ้าคอนกรีตอัดแรง
  await prisma.product.create({
    data: {
      slug: "prestressed-concrete-pole",
      nameTh: "เสาไฟฟ้าคอนกรีตอัดแรง",
      nameEn: "Prestressed Concrete Utility Pole",
      category: "pole",
      productType: "standard",
      minOrderQty: null,
      leadTimeDays: null,
      descTh:
        "เสาไฟฟ้าคอนกรีตอัดแรงทรงกลม (Spun) ผ่านมาตรฐาน มอก. 397 และราคามาตรฐาน กฟภ ผลิตด้วยระบบหมุนเหวี่ยงแรงเหวี่ยงสูง (High-speed Centrifugal Casting) ทำให้คอนกรีตแน่น กำลังอัดสูง ทนต่อสภาพอากาศและแรงลม พร้อมส่งจากสต็อก",
      descEn:
        "Spun prestressed concrete utility pole certified to TIS 397 at PEA standard pricing. High-strength, weather and wind resistant. In-stock sizes available.",
      imageUrl: "/images/products/pole.jpg",
      datasheetUrl: "/datasheets/concrete-pole.pdf",
      specs: JSON.stringify({
        standard: "มอก. 397-2524",
        priceStandard: "ราคามาตรฐาน กฟภ",
        concreteGrade: "fck = 45 MPa",
        prestressType: "Pre-tensioned (Spun)",
        unit: "ต้น",
        pricing: [
          { length: 8, pricePerUnit: 4000 },
          { length: 9, pricePerUnit: 4500 },
          { length: 12, pricePerUnit: 6000 },
          { length: 12.2, pricePerUnit: 8000 },
        ],
      }),
      useCases: JSON.stringify([
        { th: "สายส่งไฟฟ้าแรงสูง", en: "High-Voltage Transmission Lines" },
        { th: "ระบบจำหน่ายไฟฟ้า", en: "Power Distribution Systems" },
        { th: "เสาโทรศัพท์และสื่อสาร", en: "Telecom & Communication Poles" },
        { th: "ไฟถนนและไฟสาธารณะ", en: "Street Lighting" },
      ]),
    },
  });

  console.log("✅ 3 products created");

  // Portfolio items
  const portfolioData = [
    {
      titleTh: "คลังสินค้า บริษัท ABC โลจิสติกส์",
      titleEn: "ABC Logistics Warehouse",
      descTh: "แผ่นพื้น Hollow Core ขนาด 20 ซม. พื้นที่ 8,000 ตร.ม.",
      descEn: "20 cm Hollow Core Slabs, 8,000 sqm floor area",
      category: "warehouse",
      year: 2024,
      imageUrl: "/images/portfolio/portfolio-01.jpg",
    },
    {
      titleTh: "อาคารพาณิชย์ เชียงใหม่",
      titleEn: "Chiang Mai Commercial Complex",
      descTh: "เสาเข็มคอนกรีตอัดแรง ขนาด 0.22 ม. จำนวน 320 ต้น",
      descEn: "220mm Prestressed Piles, 320 units",
      category: "commercial",
      year: 2023,
      imageUrl: "/images/portfolio/portfolio-02.jpg",
    },
    {
      titleTh: "โรงงานผลิตชิ้นส่วนยานยนต์",
      titleEn: "Automotive Parts Factory",
      descTh: "แผ่นพื้น Hollow Core รวม 12,000 ตร.ม.",
      descEn: "Hollow Core combined 12,000 sqm",
      category: "industrial",
      year: 2024,
      imageUrl: "/images/portfolio/portfolio-03.jpg",
    },
    {
      titleTh: "ระบบไฟฟ้าชุมชน ภาคตะวันออก",
      titleEn: "Eastern Region Power Grid",
      descTh: "เสาไฟฟ้าคอนกรีตอัดแรง ขนาด 12 ม. จำนวน 450 ต้น",
      descEn: "12m Prestressed Concrete Poles, 450 units",
      category: "utility",
      year: 2023,
      imageUrl: "/images/portfolio/portfolio-04.jpg",
    },
    {
      titleTh: "ศูนย์กระจายสินค้า E-Commerce",
      titleEn: "E-Commerce Distribution Center",
      descTh: "แผ่นพื้น Hollow Core 2 ชั้น พื้นที่รวม 15,000 ตร.ม.",
      descEn: "2-story Hollow Core, 15,000 sqm total",
      category: "warehouse",
      year: 2025,
      imageUrl: "/images/portfolio/portfolio-05.jpg",
    },
  ];

  for (const item of portfolioData) {
    await prisma.portfolioItem.create({ data: item });
  }
  console.log("✅ 5 portfolio items created");

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
