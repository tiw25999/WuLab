"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface InquiryItem { productName: string; quantity: string; unit: string; }

interface TrackData {
  refCode: string;
  status: string;
  name: string;
  phone: string;
  company: string | null;
  items: InquiryItem[];
  createdAt: string;
  quotation: {
    quoteCode: string;
    total: number;
    validDays: number;
    createdAt: string;
    purchaseOrder: {
      poCode: string;
      customerPoNumber: string | null;
      status: string;
      receivedAt: string;
    } | null;
  } | null;
}

const PO_STEPS = [
  { key: "received",      label: "ได้รับ PO",     sub: "รับคำสั่งซื้อแล้ว" },
  { key: "in_production", label: "กำลังผลิต",    sub: "อยู่ระหว่างการผลิต" },
  { key: "shipping",      label: "กำลังจัดส่ง",  sub: "กำลังดำเนินการจัดส่ง" },
  { key: "delivered",     label: "จัดส่งแล้ว",   sub: "ส่งมอบสินค้าเรียบร้อย" },
];
const PO_STEP_INDEX: Record<string, number> = {
  received: 0, in_production: 1, shipping: 2, delivered: 3,
};

function fmt(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 0 }) + " บาท";
}

function PoTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="px-4 py-3 rounded-lg text-sm font-medium text-red-700 bg-red-50 border border-red-200">
        คำสั่งซื้อนี้ถูกยกเลิก
      </div>
    );
  }
  const activeIdx = PO_STEP_INDEX[status] ?? 0;
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100" style={{ zIndex: 0 }} />
      <div className="absolute top-4 left-4 h-0.5 transition-all duration-500"
        style={{ background: "#1a2f6e", width: activeIdx === 0 ? 0 : `${(activeIdx / (PO_STEPS.length - 1)) * (100 - 8)}%`, zIndex: 1 }} />
      <div className="relative flex justify-between" style={{ zIndex: 2 }}>
        {PO_STEPS.map((step, i) => {
          const done = i < activeIdx;
          const active = i === activeIdx;
          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                style={done ? { background: "#1a2f6e", borderColor: "#1a2f6e", color: "white" }
                  : active ? { background: "white", borderColor: "#1a2f6e", color: "#1a2f6e" }
                  : { background: "white", borderColor: "#e2e8f0", color: "#cbd5e1" }}>
                {done ? "✓" : i + 1}
              </div>
              <p className="text-xs font-semibold text-center"
                style={{ color: active ? "#1a2f6e" : done ? "#374151" : "#d1d5db" }}>
                {step.label}
              </p>
              {active && <p className="text-xs text-gray-400 text-center leading-tight">{step.sub}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [inputRef, setInputRef] = useState(searchParams.get("ref") ?? "");
  const [data, setData] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (ref: string) => {
    const code = ref.trim().toUpperCase();
    if (!code) return;
    setLoading(true); setError(""); setData(null);
    try {
      const res = await fetch(`/api/rfq/${encodeURIComponent(code)}`);
      if (!res.ok) { setError("ไม่พบรหัสนี้ กรุณาตรวจสอบอีกครั้ง"); return; }
      setData(await res.json());
    } catch {
      setError("ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) search(ref);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => { e.preventDefault(); search(inputRef); };

  const po = data?.quotation?.purchaseOrder ?? null;
  const qt = data?.quotation ?? null;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#1a2f6e", fontFamily: "Playfair Display, serif" }}>
        ติดตามคำสั่งซื้อ
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        กรอกรหัสอ้างอิงที่ได้รับ เช่น <span className="font-mono text-gray-500">SMC-20260503-0001</span>
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
          placeholder="SMC-YYYYMMDD-XXXX"
          value={inputRef}
          onChange={(e) => setInputRef(e.target.value)}
          style={{ fontFamily: "DM Mono, monospace" }}
        />
        <button type="submit" disabled={loading}
          className="px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
          style={{ background: "#1a2f6e", color: "white" }}>
          {loading ? "..." : "ค้นหา"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">{error}</div>
      )}

      {data && (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">

          {/* Header */}
          <div className="px-5 py-4" style={{ background: "#1a2f6e" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white/50 text-xs mb-0.5">รหัสอ้างอิง</p>
                <p className="font-mono font-bold text-white text-lg">{data.refCode}</p>
                {data.company && <p className="text-white/60 text-xs mt-0.5">{data.company}</p>}
              </div>
              {qt && (
                <div className="text-right shrink-0">
                  <p className="text-white/50 text-xs mb-0.5">มูลค่า</p>
                  <p className="text-white font-bold">{fmt(qt.total)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stage: no quotation yet */}
          {!qt && (
            <div className="px-5 py-5 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "#e8edf8" }}>
                <div className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0" style={{ background: "#1a2f6e" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>
                    {data.status === "in_progress" ? "กำลังจัดทำใบเสนอราคา" : "รับคำขอแล้ว"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">เจ้าหน้าที่กำลังดำเนินการ จะส่งใบเสนอราคาให้เร็วๆ นี้</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm pt-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">ชื่อ</span><span className="font-medium">{data.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">วันที่ยื่น</span>
                  <span>{new Date(data.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-400 mb-2">รายการที่ขอ</p>
                {data.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span>{item.productName}</span>
                    <span className="text-gray-400">{item.quantity} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage: quotation sent, no PO */}
          {qt && !po && (() => {
            const validUntil = new Date(new Date(qt.createdAt).getTime() + qt.validDays * 86400000);
            const isExpired = validUntil < new Date();
            return (
              <div className="px-5 py-5 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: isExpired ? "#fee2e2" : "#fef3c7" }}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: isExpired ? "#dc2626" : "#d97706" }} />
                  <div>
                    <p className="text-sm font-semibold"
                      style={{ color: isExpired ? "#991b1b" : "#92400e" }}>
                      {isExpired ? "ใบเสนอราคาหมดอายุแล้ว" : "รอการยืนยันจากลูกค้า"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: isExpired ? "#b91c1c" : "#b45309" }}>
                      {isExpired
                        ? `หมดอายุเมื่อ ${validUntil.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}`
                        : `ใบเสนอราคาใช้ได้ถึง ${validUntil.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}`}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ชื่อ</span><span className="font-medium">{data.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ใบเสนอราคา</span>
                    <span className="font-mono text-xs text-gray-500">{qt.quoteCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">วันที่ออกใบเสนอ</span>
                    <span>{new Date(qt.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Stage: PO received → show timeline */}
          {po && (
            <>
              <div className="px-5 pt-5 pb-2">
                {po.customerPoNumber && (
                  <p className="text-xs text-gray-400 mb-3">
                    เลข PO ของคุณ: <span className="font-mono font-medium text-gray-600">{po.customerPoNumber}</span>
                  </p>
                )}
                <PoTimeline status={po.status} />
              </div>
              <div className="px-5 pb-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">ชื่อ</span><span className="font-medium">{data.name}</span>
                </div>
                {data.company && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">บริษัท/หน่วยงาน</span><span>{data.company}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">วันที่รับ PO</span>
                  <span>{new Date(po.receivedAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  );
}
