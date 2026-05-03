"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RfqRow {
  id: string;
  refCode: string;
  status: string;
  customerType: string;
  name: string;
  phone: string;
  company: string | null;
  items: string;
  createdAt: string;
  quotation: { quoteCode: string; status: string; purchaseOrder: { poCode: string } | null } | null;
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  new:         { label: "ใหม่",               color: "#1a2f6e", bg: "#e8edf8" },
  in_progress: { label: "กำลังดำเนินการ",     color: "#92400e", bg: "#fef3c7" },
  completed:   { label: "ส่งใบเสนอราคาแล้ว", color: "#14532d", bg: "#dcfce7" },
  cancelled:   { label: "ยกเลิก",             color: "#7f1d1d", bg: "#fee2e2" },
  po_received: { label: "ได้รับ PO แล้ว",     color: "#065f46", bg: "#a7f3d0" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState<RfqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [fetchError, setFetchError] = useState("");

  const loadRfqs = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/rfq", { cache: "no-store", credentials: "include" });
      if (r.status === 401) { router.push("/admin/login"); return; }
      if (!r.ok) { const body = await r.text(); setFetchError(`${r.status}: ${body.slice(0, 200)}`); return; }
      const data = await r.json();
      setRfqs(data);
      setLastUpdated(new Date());
      setFetchError("");
    } catch (e) {
      setFetchError(String(e));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadRfqs();
    const interval = setInterval(() => loadRfqs(), 30000);
    return () => clearInterval(interval);
  }, [loadRfqs]);

  const filtered = filter === "all" ? rfqs : rfqs.filter((r) => r.status === filter);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-8">

        {/* Title row + refresh */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#1a2f6e" }}>
              คำขอใบเสนอราคา (RFQ)
            </h1>
            {lastUpdated && (
              <p className="text-xs text-gray-400 mt-0.5">
                อัปเดตล่าสุด {formatTime(lastUpdated)}
              </p>
            )}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "ทั้งหมด",       count: rfqs.length,                                  color: "#1a2f6e" },
            { label: "ใหม่",           count: rfqs.filter((r) => r.status === "new").length,         color: "#2563eb" },
            { label: "กำลังดำเนินการ", count: rfqs.filter((r) => r.status === "in_progress").length, color: "#d97706" },
            { label: "เสร็จสิ้น",      count: rfqs.filter((r) => r.status === "completed").length,   color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-3xl font-bold" style={{ color: s.color }}>{s.count}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[["all","ทั้งหมด"],["new","ใหม่"],["in_progress","กำลังดำเนินการ"],["completed","เสร็จสิ้น"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={filter === v ? { background: "#1a2f6e", color: "white", borderColor: "#1a2f6e" } : { background: "white", color: "#5a6480", borderColor: "#e2e8f0" }}>
              {l}
            </button>
          ))}
        </div>

        {fetchError && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">
            ⚠ โหลดข้อมูลไม่สำเร็จ: {fetchError}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">กำลังโหลด...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">ไม่มีรายการ</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#f0f2f8" }}>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">refCode</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">ลูกค้า</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">รายการ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">สถานะ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">วันที่</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">ใบเสนอราคา</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const hasPo = !!r.quotation?.purchaseOrder;
                    const cfg = hasPo ? STATUS_LABEL.po_received : (STATUS_LABEL[r.status] ?? STATUS_LABEL.new);
                    let itemCount = 0;
                    try { itemCount = JSON.parse(r.items).length; } catch { itemCount = 0; }
                    return (
                      <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.refCode}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{r.name}</p>
                          {r.company && <p className="text-xs text-gray-400">{r.company}</p>}
                          <p className="text-xs text-gray-400">{r.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{itemCount} รายการ</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ color: cfg.color, background: cfg.bg }}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString("th-TH")}
                        </td>
                        <td className="px-4 py-3">
                          {r.quotation ? (
                            <span className="text-xs font-mono text-green-600">{r.quotation.quoteCode}</span>
                          ) : (
                            <span className="text-xs text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/rfq/${r.id}`}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                            style={{ background: "#f5c200", color: "#1a2f6e" }}>
                            จัดการ →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
