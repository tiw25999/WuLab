"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PipelineCard {
  id: string;           // inquiry id
  refCode: string;
  name: string;
  company: string | null;
  phone: string;
  createdAt: string;
  inquiryStatus: string;
  quotation: {
    id: string;
    quoteCode: string;
    status: string;
    total: number;
    purchaseOrder: {
      id: string;
      poCode: string;
      status: string;
      customerPoNumber: string | null;
      receivedAt: string;
    } | null;
  } | null;
}

type ColKey = "received" | "in_production" | "shipping" | "delivered";

const COLUMNS: { key: ColKey; label: string; color: string; bg: string; light: string }[] = [
  { key: "received",      label: "ได้รับ PO",    color: "#d97706", bg: "#d97706", light: "#fef3c7" },
  { key: "in_production", label: "กำลังผลิต",   color: "#ea580c", bg: "#ea580c", light: "#ffedd5" },
  { key: "shipping",      label: "กำลังจัดส่ง", color: "#0284c7", bg: "#0284c7", light: "#e0f2fe" },
  { key: "delivered",     label: "จัดส่งแล้ว",  color: "#16a34a", bg: "#16a34a", light: "#dcfce7" },
];

function getCardColumn(card: PipelineCard): ColKey | null {
  const po = card.quotation?.purchaseOrder;
  if (!po) return null;
  if (po.status === "delivered")     return "delivered";
  if (po.status === "shipping")      return "shipping";
  if (po.status === "in_production") return "in_production";
  return "received";
}

const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 0 }) + " ฿";
const fmtDate = (s: string) => new Date(s).toLocaleDateString("th-TH", { day: "numeric", month: "short" });

function KanbanCard({ card, col, onMove }: {
  card: PipelineCard;
  col: typeof COLUMNS[number];
  onMove: (card: PipelineCard, targetCol: ColKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const availableCols = COLUMNS.filter((c) => c.key !== col.key);

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderLeftColor: col.color }}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("cardId", card.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-mono text-xs font-bold" style={{ color: col.color }}>
          {card.quotation?.purchaseOrder?.poCode ?? card.refCode}
        </p>
        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0"
          style={{ background: col.light, color: col.color }}>
          PO
        </span>
      </div>

      {/* Customer */}
      <p className="text-sm font-semibold text-gray-800 truncate">{card.name}</p>
      {card.company && <p className="text-xs text-gray-400 truncate">{card.company}</p>}

      {/* Quote/PO info */}
      {card.quotation && (
        <p className="text-xs text-gray-400 mt-1">
          {card.quotation.purchaseOrder?.customerPoNumber
            ? <>PO: <span className="font-mono">{card.quotation.purchaseOrder.customerPoNumber}</span></>
            : <>ใบเสนอ: <span className="font-mono">{card.quotation.quoteCode}</span></>}
        </p>
      )}

      {/* Amount */}
      {card.quotation && (
        <p className="text-sm font-bold mt-2" style={{ color: col.color }}>
          {fmt(card.quotation.total)}
        </p>
      )}

      {/* Date */}
      <p className="text-xs text-gray-300 mt-1">{fmtDate(card.createdAt)}</p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
        <Link href={`/admin/rfq/${card.id}`}
          className="text-xs font-medium px-2 py-1 rounded-lg transition-colors"
          style={{ background: col.light, color: col.color }}>
          จัดการ
        </Link>

        {availableCols.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              ย้ายไป ▾
            </button>
            {open && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 min-w-[160px]">
                {availableCols.map((c) => (
                  <button key={c.key}
                    onClick={() => { setOpen(false); onMove(card, c.key); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersKanban() {
  const router = useRouter();
  const [cards, setCards] = useState<PipelineCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragOverCol, setDragOverCol] = useState<ColKey | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/rfq", { cache: "no-store", credentials: "include" });
      if (r.status === 401) { router.push("/admin/login"); return; }
      const data = await r.json();
      if (!Array.isArray(data)) return;
      setCards(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  const moveCard = async (card: PipelineCard, targetCol: ColKey) => {
    const isPOCol = ["received", "in_production", "shipping", "delivered"].includes(targetCol);

    // Optimistic update
    setCards((prev) => prev.map((c) => {
      if (c.id !== card.id) return c;
      if (isPOCol && c.quotation?.purchaseOrder) {
        return { ...c, quotation: { ...c.quotation, purchaseOrder: { ...c.quotation.purchaseOrder, status: targetCol } } };
      }
      return { ...c, inquiryStatus: targetCol };
    }));

    if (isPOCol && card.quotation?.purchaseOrder) {
      await fetch(`/api/admin/po/${card.quotation.purchaseOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetCol }),
      });
    } else {
      await fetch(`/api/admin/rfq/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetCol }),
      });
    }
  };

  const handleDrop = (e: React.DragEvent, targetCol: ColKey) => {
    e.preventDefault();
    setDragOverCol(null);
    const cardId = e.dataTransfer.getData("cardId");
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const currentCol = getCardColumn(card);
    if (currentCol === targetCol) return;

    if (!card.quotation?.purchaseOrder) return;
    moveCard(card, targetCol);
  };

  // Group by column
  const byCol = Object.fromEntries(COLUMNS.map((c) => [c.key, [] as PipelineCard[]])) as Record<ColKey, PipelineCard[]>;
  cards.filter((c) => c.inquiryStatus !== "cancelled").forEach((card) => {
    const col = getCardColumn(card);
    if (col) byCol[col].push(card);
  });

  return (
    <div className="pt-5">
      {/* Kanban board — horizontal scroll, left-aligned with layout's max-w-7xl container */}
      <div className="overflow-x-auto pb-8">
        <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map((col) => {
            const colCards = byCol[col.key];
            const isDragOver = dragOverCol === col.key;
            return (
              <div
                key={col.key}
                className="flex flex-col rounded-2xl transition-all"
                style={{ width: 240, minHeight: 500, background: isDragOver ? col.light : "transparent" }}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                {/* Column header */}
                <div className="sticky top-0 z-10 rounded-t-2xl px-3 py-3 mb-3"
                  style={{ background: col.bg }}>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm">{col.label}</span>
                    <span className="text-white/70 text-xs font-mono bg-white/20 rounded-full px-2 py-0.5">
                      {colCards.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3 px-2 pb-4 flex-1">
                  {loading ? (
                    [...Array(2)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse border-l-4 border-gray-200">
                        <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-28 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                      </div>
                    ))
                  ) : colCards.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-xs text-gray-300 py-8">ว่าง</p>
                    </div>
                  ) : (
                    colCards.map((card) => (
                      <KanbanCard key={card.id} card={card} col={col} onMove={moveCard} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
