"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface InquiryItem { productName: string; spec?: string; quantity: string; unit: string; note?: string; }
interface QuoteItem { productName: string; spec: string; quantity: string; unit: string; unitPrice: number; total: number; }
interface PurchaseOrder { id: string; poCode: string; customerPoNumber: string | null; customerPoFile: string | null; status: string; receivedAt: string; }
interface Inquiry {
  id: string; refCode: string; status: string; customerType: string;
  name: string; phone: string; email: string | null; lineId: string | null;
  company: string | null; govRef: string | null; message: string | null;
  items: InquiryItem[]; createdAt: string;
  quotation: { id: string; quoteCode: string; status: string; total: number; purchaseOrder: PurchaseOrder | null; } | null;
}

const STATUS_OPTIONS = [
  { value: "new",         label: "ใหม่" },
  { value: "in_progress", label: "กำลังทำใบเสนอราคา" },
  { value: "completed",   label: "ส่งใบเสนอราคาแล้ว" },
  { value: "cancelled",   label: "ยกเลิก" },
];

const PO_STATUS_OPTIONS = [
  { value: "received",      label: "ได้รับ PO แล้ว" },
  { value: "in_production", label: "กำลังผลิต" },
  { value: "delivered",     label: "จัดส่งแล้ว" },
  { value: "cancelled",     label: "ยกเลิก" },
];

export default function AdminRfqDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState("");
  const [validDays, setValidDays] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [editingQuote, setEditingQuote] = useState(false);

  // PO form
  const [customerPoNumber, setCustomerPoNumber] = useState("");
  const [poNotes, setPoNotes] = useState("");
  const [poFile, setPoFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [recordingPo, setRecordingPo] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/rfq/${id}`)
      .then((r) => { if (r.status === 401) router.push("/admin/login"); return r.json(); })
      .then((data: Inquiry) => {
        setInquiry(data);
        setQuoteItems(data.items.map((item) => ({
          productName: item.productName,
          spec: item.spec ?? "",
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: 0,
          total: 0,
        })));
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/admin/rfq/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setInquiry((prev) => prev ? { ...prev, status } : prev);
  };

  const updatePoStatus = async (poId: string, status: string) => {
    await fetch(`/api/admin/po/${poId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setInquiry((prev) => {
      if (!prev?.quotation?.purchaseOrder) return prev;
      return { ...prev, quotation: { ...prev.quotation, purchaseOrder: { ...prev.quotation.purchaseOrder, status } } };
    });
  };

  const updateQuoteItem = (i: number, field: keyof QuoteItem, value: string) => {
    setQuoteItems((prev) => prev.map((item, idx) => {
      if (idx !== i) return item;
      const updated = { ...item, [field]: field === "unitPrice" ? Number(value) || 0 : value };
      updated.total = updated.unitPrice * (Number(updated.quantity) || 0);
      return updated;
    }));
  };

  const subtotal = quoteItems.reduce((s, i) => s + i.total, 0);
  const vatAmount = Math.round(subtotal * 0.07 * 100) / 100;
  const total = subtotal + vatAmount;

  const submitQuotation = async () => {
    if (quoteItems.some((i) => !i.unitPrice)) { setError("กรุณากรอกราคาต่อหน่วยทุกรายการ"); return; }
    setSubmitting(true); setError("");
    const isReplace = editingQuote && !!inquiry?.quotation;
    const res = await fetch("/api/admin/quotation", {
      method: isReplace ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryId: id, items: quoteItems, notes, validDays }),
    });
    setSubmitting(false);
    if (res.ok) { setEditingQuote(false); load(); }
    else { const d = await res.json(); setError(d.error ?? "เกิดข้อผิดพลาด"); }
  };

  const recordPo = async (fileArg?: File | null) => {
    if (!inquiry?.quotation) return;
    setRecordingPo(true); setError("");

    try {
      let customerPoFilePath: string | null = null;
      const fileToUpload = fileArg ?? poFile;
      if (fileToUpload) {
        setUploadingFile(true);
        const fd = new FormData();
        fd.append("file", fileToUpload);
        const up = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
        setUploadingFile(false);
        const upJson = await up.json();
        if (!up.ok) { setError(upJson.error ?? "อัปโหลดไฟล์ไม่สำเร็จ"); setRecordingPo(false); return; }
        customerPoFilePath = upJson.path;
      }

      const res = await fetch("/api/admin/po", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quotationId: inquiry.quotation.id, customerPoNumber, notes: poNotes, customerPoFile: customerPoFilePath }),
      });
      const resJson = await res.json();
      if (res.ok) { router.push("/admin/orders"); }
      else { setError(`${res.status}: ${resJson.error ?? "เกิดข้อผิดพลาด"}`); }
    } catch (e) {
      setError(String(e));
    } finally {
      setRecordingPo(false);
      setUploadingFile(false);
    }
  };

  const copyLink = (quoteCode: string) => {
    const url = `${window.location.origin}/quotation?ref=${quoteCode}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 2 });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">กำลังโหลด...</div>;
  if (!inquiry) return <div className="min-h-screen flex items-center justify-center text-red-500">ไม่พบข้อมูล</div>;

  const inputCls = "border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400 w-full";
  const quoteCode = inquiry.quotation?.quoteCode;
  const po = inquiry.quotation?.purchaseOrder;

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">← กลับ</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 font-medium">{inquiry.refCode}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-6">

        {/* Customer + Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">ข้อมูลลูกค้า</p>
            <div className="space-y-2 text-sm">
              {([["ชื่อ", inquiry.name], ["โทร", inquiry.phone], ["อีเมล", inquiry.email],
                ["Line", inquiry.lineId], ["บริษัท/หน่วยงาน", inquiry.company], ["เลขที่หนังสือ", inquiry.govRef],
              ] as [string, string | null][]).filter(([, v]) => v).map(([l, v]) => (
                <div key={l} className="flex gap-3">
                  <span className="w-28 text-gray-400 shrink-0">{l}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
              {inquiry.message && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-gray-400 text-xs mb-1">หมายเหตุจากลูกค้า</p>
                  <p className="text-gray-600">{inquiry.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">สถานะคำขอ</p>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => updateStatus(opt.value)}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all border"
                  style={inquiry.status === opt.value
                    ? { background: "#1a2f6e", color: "white", borderColor: "#1a2f6e" }
                    : { background: "white", color: "#5a6480", borderColor: "#e2e8f0" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quotation section */}
        {inquiry.quotation && !editingQuote ? (
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">ใบเสนอราคา</p>
              {!po && (
                <button onClick={() => { setEditingQuote(true); setError(""); }}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:border-red-400 hover:text-red-600"
                  style={{ borderColor: "#e2e8f0", color: "#5a6480" }}>
                  สร้างใบเสนอราคาใหม่
                </button>
              )}
            </div>

            {/* Quote info + share */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg" style={{ background: "#f0f2f8" }}>
              <div>
                <p className="font-mono font-bold text-lg" style={{ color: "#1a2f6e" }}>{quoteCode}</p>
                <p className="text-sm text-gray-500 mt-0.5">ยอดรวม {fmt(inquiry.quotation.total)} บาท</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => copyLink(quoteCode!)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all"
                  style={copied ? { background: "#16a34a", color: "white", borderColor: "#16a34a" } : { background: "white", color: "#1a2f6e", borderColor: "#1a2f6e" }}>
                  {copied ? "✓ คัดลอกแล้ว" : "คัดลอกลิงก์"}
                </button>
                <a href={`/api/quotation/${quoteCode}/pdf`} target="_blank"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border"
                  style={{ background: "white", color: "#5a6480", borderColor: "#e2e8f0" }}>
                  ⬇ PDF
                </a>
              </div>
            </div>

            {/* PO section */}
            {po ? (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">PO จากลูกค้า</p>
                <div className="p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
                    <div><span className="text-gray-400">เลข PO ลูกค้า  </span>
                      <span className="font-mono font-bold" style={{ color: "#1a2f6e" }}>{po.customerPoNumber ?? "-"}</span>
                    </div>
                    <div><span className="text-gray-400">รหัสอ้างอิง  </span>
                      <span className="font-mono text-gray-600">{po.poCode}</span>
                    </div>
                    <div><span className="text-gray-400">วันที่รับ  </span>
                      <span>{new Date(po.receivedAt).toLocaleDateString("th-TH")}</span>
                    </div>
                    {po.customerPoFile && (
                      <div>
                        <a href={po.customerPoFile} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors hover:border-blue-400 hover:text-blue-600"
                          style={{ borderColor: "#e2e8f0", color: "#5a6480" }}>
                          ⬇ ไฟล์ PO ของลูกค้า
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Tracking link for customer */}
                  <div className="rounded-lg p-3 border border-dashed" style={{ borderColor: "#1a2f6e22", background: "#f0f2f8" }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: "#1a2f6e" }}>ลิงก์ติดตามสำหรับลูกค้า</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 select-all">
                        {po.poCode}
                      </code>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/rfq/track?ref=${po.poCode}`;
                          navigator.clipboard.writeText(url).then(() => {
                            setCopiedTracking(true);
                            setTimeout(() => setCopiedTracking(false), 2000);
                          });
                        }}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg border transition-all"
                        style={copiedTracking
                          ? { background: "#16a34a", color: "white", borderColor: "#16a34a" }
                          : { background: "white", color: "#1a2f6e", borderColor: "#1a2f6e" }}>
                        {copiedTracking ? "✓ คัดลอกแล้ว" : "คัดลอกลิงก์"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">สถานะการผลิต/จัดส่ง</p>
                    <div className="flex flex-wrap gap-2">
                      {PO_STATUS_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => updatePoStatus(po.id, opt.value)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                          style={po.status === opt.value
                            ? { background: "#1a2f6e", color: "white", borderColor: "#1a2f6e" }
                            : { background: "white", color: "#5a6480", borderColor: "#e2e8f0" }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">บันทึก PO ที่ได้รับจากลูกค้า</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">เลข PO ของลูกค้า</label>
                    <input className={inputCls} value={customerPoNumber}
                      onChange={(e) => setCustomerPoNumber(e.target.value)}
                      placeholder="เช่น PO-2026-00123 (ไม่บังคับ)"
                      style={{ fontFamily: "DM Mono, monospace" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      ไฟล์ PO ของลูกค้า <span className="text-gray-300 font-normal">(PDF, JPG, PNG — ไม่บังคับ)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <span className="px-3 py-2 rounded-lg border text-xs font-medium transition-colors group-hover:border-blue-400 group-hover:text-blue-600"
                        style={{ borderColor: "#e2e8f0", color: "#5a6480" }}>
                        เลือกไฟล์
                      </span>
                      <span className="text-xs text-gray-400 truncate max-w-60">
                        {poFile ? poFile.name : "ยังไม่ได้เลือกไฟล์"}
                      </span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden"
                        onChange={(e) => setPoFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">หมายเหตุ</label>
                    <input className={inputCls} value={poNotes}
                      onChange={(e) => setPoNotes(e.target.value)}
                      placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)" />
                  </div>
                  {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}
                  <button onClick={() => recordPo()} disabled={recordingPo || uploadingFile}
                    className="px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
                    style={{ background: "#16a34a", color: "white" }}>
                    {uploadingFile ? "กำลังอัปโหลดไฟล์..." : recordingPo ? "กำลังบันทึก..." : "✓ บันทึก PO ที่ได้รับแล้ว"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Create / replace quotation form */
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {editingQuote ? "สร้างใบเสนอราคาใหม่" : "สร้างใบเสนอราคา"}
              </p>
              {editingQuote && (
                <button onClick={() => { setEditingQuote(false); setError(""); }}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:border-gray-400"
                  style={{ borderColor: "#e2e8f0", color: "#5a6480" }}>
                  ยกเลิก
                </button>
              )}
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#f0f2f8" }}>
                    <th className="px-3 py-2 text-left text-xs text-gray-500">สินค้า</th>
                    <th className="px-3 py-2 text-left text-xs text-gray-500">สเปค</th>
                    <th className="px-3 py-2 text-center text-xs text-gray-500">จำนวน</th>
                    <th className="px-3 py-2 text-right text-xs text-gray-500">ราคา/หน่วย (บาท)</th>
                    <th className="px-3 py-2 text-right text-xs text-gray-500">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteItems.map((item, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-2 font-medium">{item.productName}</td>
                      <td className="px-3 py-2">
                        <input className={inputCls} value={item.spec}
                          onChange={(e) => updateQuoteItem(i, "spec", e.target.value)} placeholder="สเปค" />
                      </td>
                      <td className="px-3 py-2 text-center text-gray-500">{item.quantity} {item.unit}</td>
                      <td className="px-3 py-2">
                        <input className={inputCls + " text-right"} value={item.unitPrice || ""}
                          onChange={(e) => updateQuoteItem(i, "unitPrice", e.target.value)}
                          placeholder="0.00" inputMode="decimal" />
                      </td>
                      <td className="px-3 py-2 text-right font-semibold" style={{ color: "#1a2f6e" }}>{fmt(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-4">
              <div className="w-56 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>ก่อนภาษี</span><span>{fmt(subtotal)} บาท</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>VAT 7%</span><span>{fmt(vatAmount)} บาท</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2" style={{ color: "#1a2f6e" }}>
                  <span>รวมทั้งสิ้น</span><span>{fmt(total)} บาท</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">อายุใบเสนอราคา (วัน)</label>
                <input className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                  type="number" value={validDays} onChange={(e) => setValidDays(Number(e.target.value))} min={1} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">หมายเหตุ (ถ้ามี)</label>
              <textarea className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none" rows={2}
                value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="เงื่อนไขการชำระเงิน, กำหนดส่งของ ฯลฯ" />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded mb-3">{error}</p>}

            <button onClick={submitQuotation} disabled={submitting}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
              style={{ background: "#1a2f6e", color: "white" }}>
              {submitting ? "กำลังสร้าง..." : "สร้างใบเสนอราคา"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
