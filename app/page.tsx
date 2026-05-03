export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      slug: true,
      nameTh: true,
      nameEn: true,
      descTh: true,
      category: true,
      productType: true,
      leadTimeDays: true,
      minOrderQty: true,
      imageUrl: true,
    },
  });
}

export default async function LandingPage() {
  const products = await getProducts();

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* BG image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hollow-core-factory.jpg"
            alt="โรงงาน SICON"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(26,47,110,0.92) 45%, rgba(26,47,110,0.55) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: "rgba(245,194,0,0.15)", color: "#f5c200", border: "1px solid rgba(245,194,0,0.3)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              ก่อตั้ง พ.ศ. 2537 · ISO 9001:2015 · มอก.
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "Playfair Display, serif", color: "white" }}
            >
              คอนกรีตอัดแรง
              <br />
              <span style={{ color: "#f5c200" }}>มาตรฐานสูงสุด</span>
              <br />
              ส่งถึงไซต์งาน
            </h1>

            <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-lg" style={{ fontFamily: "Sarabun, sans-serif" }}>
              ผู้ผลิตแผ่นพื้น Hollow Core, เสาเข็ม และเสาไฟฟ้าคอนกรีตอัดแรง
              ครบวงจรจากภาคใต้ รองรับโครงการทุกขนาด
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/rfq"
                className="px-8 py-3.5 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: "#f5c200", color: "#1a2f6e" }}
              >
                ขอใบเสนอราคาฟรี
              </Link>
              <Link
                href="/products"
                className="px-8 py-3.5 rounded-lg font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all"
              >
                ดูสินค้าทั้งหมด →
              </Link>
            </div>
          </div>

          {/* Right — stats */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { num: "30+", label: "ปีประสบการณ์" },
              { num: "500+", label: "โครงการที่ผ่านมา" },
              { num: "3", label: "ผลิตภัณฑ์หลัก" },
              { num: "7–14", label: "วันผลิต Pre-order" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-6"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <p
                  className="text-4xl font-bold mb-1"
                  style={{ color: "#f5c200", fontFamily: "Playfair Display, serif" }}
                >
                  {s.num}
                </p>
                <p className="text-white/60 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest mb-2" style={{ color: "#f5c200" }}>
              PRODUCTS
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold"
              style={{ color: "#1a2f6e", fontFamily: "Playfair Display, serif" }}
            >
              ผลิตภัณฑ์ของเรา
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((p) => (
              <div
                key={p.slug}
                className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.nameTh}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(26,47,110,0.7) 0%, transparent 50%)" }}
                  />
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={
                      p.productType === "preorder"
                        ? { background: "#ea580c", color: "white" }
                        : { background: "#16a34a", color: "white" }
                    }
                  >
                    {p.productType === "preorder" ? "สั่งผลิตพิเศษ" : "พร้อมส่ง"}
                  </span>
                  <p
                    className="absolute bottom-3 left-4 text-white font-bold text-lg leading-tight"
                    style={{ fontFamily: "Sarabun, sans-serif" }}
                  >
                    {p.nameTh}
                  </p>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{p.descTh}</p>
                  <div className="flex items-center justify-between">
                    {p.minOrderQty ? (
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        ขั้นต่ำ {p.minOrderQty}
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">ไม่มีขั้นต่ำ</span>
                    )}
                    <Link
                      href={`/rfq?product=${p.slug}`}
                      className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                      style={{ background: "#f5c200", color: "#1a2f6e" }}
                    >
                      ขอราคา
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-semibold text-sm border-b-2 pb-0.5 transition-colors"
              style={{ color: "#1a2f6e", borderColor: "#f5c200" }}
            >
              ดูสินค้าทั้งหมดพร้อมรายละเอียด →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY SICON ── */}
      <section className="py-20" style={{ background: "#f8f9fc" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold tracking-widest mb-2" style={{ color: "#f5c200" }}>
                WHY SICON
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-6"
                style={{ color: "#1a2f6e", fontFamily: "Playfair Display, serif" }}
              >
                ทำไมต้องเลือก
                <br />สยามมาสเตอส์คอนกรีต?
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                ด้วยประสบการณ์กว่า 30 ปี เราผลิตคอนกรีตอัดแรงด้วยมาตรฐานสากล
                ผ่านการรับรอง ISO 9001:2015 และ มอก. หลายรายการ
              </p>

              <div className="space-y-4">
                {[
                  { icon: "🏭", title: "โรงงานครบวงจร", desc: "ผลิตเองทั้งหมด ควบคุมคุณภาพทุกขั้นตอน" },
                  { icon: "📋", title: "มาตรฐาน มอก. + ISO", desc: "ผ่านการรับรอง ISO 9001:2015 และมาตรฐานอุตสาหกรรม" },
                  { icon: "🚛", title: "จัดส่งทั่วภาคใต้", desc: "มีรถขนส่งเป็นของตัวเอง ตรงเวลา ปลอดภัย" },
                  { icon: "📞", title: "ทีมวิศวกรให้คำปรึกษา", desc: "ให้คำแนะนำเรื่องสเปคและการเลือกสินค้าฟรี" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{ background: "rgba(26,47,110,0.08)" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#1a2f6e" }}>{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/hollow-core-lifting.jpg"
                alt="การติดตั้งแผ่นพื้น"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW TO ORDER ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-sm font-semibold tracking-widest mb-2" style={{ color: "#f5c200" }}>
            HOW IT WORKS
          </p>
          <h2
            className="text-3xl lg:text-4xl font-bold mb-12"
            style={{ color: "#1a2f6e", fontFamily: "Playfair Display, serif" }}
          >
            สั่งซื้อง่าย 3 ขั้นตอน
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5"
              style={{ background: "linear-gradient(to right, #f5c200, #f5c200)", opacity: 0.3 }}
            />

            {[
              { step: "01", title: "เลือกสินค้า", desc: "เลือกสินค้าที่ต้องการจากหน้าสินค้า หรือปรึกษาทีมงานโดยตรง", icon: "🛒" },
              { step: "02", title: "ส่งคำขอราคา", desc: "กรอกฟอร์ม RFQ ใช้เวลาไม่เกิน 2 นาที ไม่ต้องสมัครสมาชิก", icon: "📝" },
              { step: "03", title: "รับใบเสนอราคา", desc: "ทีมงานติดต่อกลับพร้อมราคาและรายละเอียดภายใน 1–2 วันทำการ", icon: "✅" },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ background: "#1a2f6e" }}
                >
                  {s.icon}
                </div>
                <p
                  className="text-xs font-mono font-semibold mb-2"
                  style={{ color: "#f5c200", fontFamily: "DM Mono, monospace" }}
                >
                  STEP {s.step}
                </p>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#1a2f6e" }}>{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20"
        style={{ background: "#1a2f6e" }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            พร้อมเริ่มโครงการแล้วหรือยัง?
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            ขอใบเสนอราคาฟรี ไม่มีค่าใช้จ่าย ทีมงานพร้อมให้คำปรึกษา
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rfq"
              className="px-10 py-4 rounded-xl font-bold text-base transition-all hover:shadow-xl hover:-translate-y-0.5"
              style={{ background: "#f5c200", color: "#1a2f6e" }}
            >
              ขอใบเสนอราคาเลย
            </Link>
            <a
              href="tel:075330777"
              className="px-10 py-4 rounded-xl font-semibold text-base border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              📞 075-330-777-9
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
