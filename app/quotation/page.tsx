"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface QuotationItem { productName: string; spec?: string; quantity: string; unit: string; unitPrice: number; total: number; }
interface Quotation {
  quoteCode: string; status: string; subtotal: number; vatRate: number; vatAmount: number; total: number;
  validDays: number; notes: string | null; createdAt: string; items: QuotationItem[];
  inquiry: { refCode: string; name: string; phone: string; company: string | null };
  purchaseOrder: { poCode: string; status: string; receivedAt: string; customerPoNumber: string | null } | null;
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: "รอการตอบรับ",  color: "#92400e", bg: "#fef3c7" },
  accepted: { label: "ยืนยันแล้ว",   color: "#14532d", bg: "#dcfce7" },
  rejected: { label: "ปฏิเสธ",       color: "#7f1d1d", bg: "#fee2e2" },
  expired:  { label: "หมดอายุ",      color: "#6b7280", bg: "#f3f4f6" },
};

function QuotationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!ref) { setLoading(false); setNotFound(true); return; }
    fetch(`/api/quotation/${ref}`)
      .then((r) => { if (!r.ok) { setNotFound(true); return null; } return r.json(); })
      .then((d) => { if (d) setQuotation(d); })
      .finally(() => setLoading(false));
  }, [ref]);

  const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 2 });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">กำลังโหลด...</div>
  );

  if (notFound || !quotation) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <p className="text-gray-500 mb-4">ไม่พบใบเสนอราคา กรุณาตรวจสอบลิงก์อีกครั้ง</p>
      <Link href="/" className="text-sm font-semibold" style={{ color: "#1a2f6e" }}>กลับหน้าแรก</Link>
    </div>
  );

  const statusCfg = STATUS_LABEL[quotation.status] ?? STATUS_LABEL.pending;
  const validUntil = new Date(new Date(quotation.createdAt).getTime() + quotation.validDays * 86400000)
    .toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-5" style={{ background: "#1a2f6e" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: "#f5c200" }}>
                ใบเสนอราคา · บริษัท สยามมาสเตอส์คอนกรีต จำกัด
              </p>
              <p className="text-white font-mono text-xl font-bold">{quotation.quoteCode}</p>
              <p className="text-white/50 text-xs mt-1">อ้างอิง RFQ: {quotation.inquiry.refCode}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ color: statusCfg.color, background: statusCfg.bg }}>
                {statusCfg.label}
              </span>
              <p className="text-white/50 text-xs mt-2">ใช้ได้ถึง {validUntil}</p>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-x-8 gap-y-1 text-sm">
          <div><span className="text-gray-400">ลูกค้า  </span><span className="font-medium">{quotation.inquiry.name}</span></div>
          {quotation.inquiry.company && <div><span className="text-gray-400">บริษัท  </span><span className="font-medium">{quotation.inquiry.company}</span></div>}
          <div><span className="text-gray-400">โทร  </span><span className="font-medium">{quotation.inquiry.phone}</span></div>
        </div>

        {/* Items */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f0f2f8" }}>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">สินค้า</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">สเปค</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">จำนวน</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">ราคา/หน่วย</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">รวม</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{item.productName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.spec ?? "-"}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3 text-right">{fmt(item.unitPrice)} บาท</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ color: "#1a2f6e" }}>{fmt(item.total)} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="px-6 py-5 border-t border-gray-100">
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>ราคาก่อนภาษี</span><span>{fmt(quotation.subtotal)} บาท</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>VAT {quotation.vatRate}%</span><span>{fmt(quotation.vatAmount)} บาท</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2"
                style={{ color: "#1a2f6e" }}>
                <span>ยอดรวมทั้งสิ้น</span><span>{fmt(quotation.total)} บาท</span>
              </div>
            </div>
          </div>
        </div>

        {quotation.notes && (
          <div className="px-6 py-4 border-t border-yellow-100 bg-yellow-50">
            <p className="text-xs font-semibold text-gray-500 mb-1">หมายเหตุ</p>
            <p className="text-sm text-gray-600">{quotation.notes}</p>
          </div>
        )}
      </div>

      {/* PO Status */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">สถานะคำสั่งซื้อ</p>
        {quotation.purchaseOrder ? (
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#dcfce7" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-lg"
              style={{ background: "#16a34a" }}>
              ✓
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#14532d" }}>ได้รับ PO แล้ว</p>
              <p className="text-xs mt-0.5" style={{ color: "#166534" }}>
                เมื่อวันที่ {new Date(quotation.purchaseOrder.receivedAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                {quotation.purchaseOrder.customerPoNumber && (
                  <> · เลข PO: <span className="font-mono">{quotation.purchaseOrder.customerPoNumber}</span></>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#fef3c7" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#d97706" }}>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#92400e" }}>รอรับ PO จากลูกค้า</p>
              <p className="text-xs mt-0.5" style={{ color: "#b45309" }}>
                หากต้องการสั่งซื้อ กรุณาออก PO และส่งมาที่ทีมงาน
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-wrap gap-3">
          <a href={`/api/quotation/${ref}/pdf`} target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "#1a2f6e", color: "white" }}>
            ⬇ ดาวน์โหลด PDF
          </a>
          <a href="tel:075330777"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border"
            style={{ borderColor: "#1a2f6e", color: "#1a2f6e" }}>
            📞 075-330-777-9
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          * ใบเสนอราคานี้มีอายุ {quotation.validDays} วัน นับจากวันที่ออกเอกสาร
        </p>
      </div>
    </div>
  );
}

export default function QuotationPage() {
  return <Suspense><QuotationContent /></Suspense>;
}
