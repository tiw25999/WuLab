"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

type CustomerType = "general" | "private" | "government";

// ── Product Spec Configs ──────────────────────────────────────────────
const POLE_SIZES = ["8 ม.", "9 ม.", "10 ม.", "12 ม.", "14 ม."];

// มอก. 828-2549 — ความหนาเป็นเมตร, เริ่มต้น 120 ตร.ม.
const SLAB_THICKNESSES = ["0.08 ม.", "0.10 ม.", "0.12 ม.", "0.15 ม.", "0.20 ม.", "0.25 ม.", "0.30 ม."];
const SLAB_MIN_QTY = 120;

// มอก. 396-2549
const PILE_TYPES = ["สี่เหลี่ยมตัน", "รูปตัว ไอ"] as const;
const PILE_SPECS = [
  { label: "0.22 × 0.22 ม.", maxLength: 18 },
  { label: "0.26 × 0.26 ม.", maxLength: 21 },
  { label: "0.30 × 0.30 ม.", maxLength: 27 },
  { label: "0.35 × 0.35 ม.", maxLength: 27 },
  { label: "0.40 × 0.40 ม.", maxLength: 27 },
];

interface RfqItem {
  productSlug: string;
  productName: string;
  productCategory: string;
  specType: string;      // pile: สี่เหลี่ยมตัน | รูปตัว ไอ
  specSize: string;      // pole: length | slab: thickness | pile: cross-section label
  specLength: string;    // pile: input length
  quantity: string;      // all: count (pole/pile=ต้น, slab=ตร.ม.)
  unit: string;
  note: string;
}

interface Product {
  id: string;
  slug: string;
  nameTh: string;
  nameEn: string;
  descTh: string;
  category: string;
  productType: string;
  leadTimeDays: number | null;
  minOrderQty: string | null;
  imageUrl: string | null;
}

function defaultItem(product?: Product): RfqItem {
  if (!product) return { productSlug: "", productName: "", productCategory: "", specType: "", specSize: "", specLength: "", quantity: "", unit: "ต้น", note: "" };
  const unit = product.category === "slab" ? "ตร.ม." : "ต้น";
  return { productSlug: product.slug, productName: product.nameTh, productCategory: product.category, specType: "", specSize: "", specLength: "", quantity: "", unit, note: "" };
}

/* ─── Product Picker Modal ─────────────────────────────────────────── */
function ProductPickerModal({ products, onSelect, onClose }: {
  products: Product[];
  onSelect: (p: Product) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-base" style={{ color: "#1a2f6e", fontFamily: "Sarabun, sans-serif" }}>เลือกสินค้า</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <div className="overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {products.map((p) => (
            <button
              key={p.slug}
              onClick={() => { onSelect(p); onClose(); }}
              className="text-left rounded-xl border-2 border-gray-100 overflow-hidden hover:border-yellow-400 hover:shadow-md transition-all group"
            >
              <div className="relative h-32 bg-gray-50">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.nameTh} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="200px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><span className="text-4xl">🏗️</span></div>
                )}
                <span
                  className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={p.productType === "preorder" ? { background: "#ea580c", color: "white" } : { background: "#16a34a", color: "white" }}
                >
                  {p.productType === "preorder" ? "Pre-order" : "พร้อมส่ง"}
                </span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm leading-tight mb-1" style={{ color: "#1a2f6e", fontFamily: "Sarabun, sans-serif" }}>{p.nameTh}</p>
                <p className="text-xs text-gray-400">{p.nameEn}</p>
                {p.minOrderQty && <p className="text-xs text-gray-500 mt-1">ขั้นต่ำ: {p.minOrderQty}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Spec Selector: pill button group ─────────────────────────────── */
function PillGroup({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
            style={
              value === opt
                ? { background: "#1a2f6e", color: "white", borderColor: "#1a2f6e" }
                : { background: "white", color: "#5a6480", borderColor: "#e2e8f0" }
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Item Row ──────────────────────────────────────────────────────── */
function ItemRow({ item, canRemove, onChange, onRemove, onChangeProduct }: {
  item: RfqItem;
  canRemove: boolean;
  onChange: (field: keyof RfqItem, value: string) => void;
  onRemove: () => void;
  onChangeProduct: () => void;
}) {
  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full";

  const pileSpec = item.specSize ? PILE_SPECS.find((p) => p.label === item.specSize) : null;
  const pileMaxLength = pileSpec?.maxLength ?? 27;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Product header */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-100">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "#1a2f6e", fontFamily: "Sarabun, sans-serif" }}>
            {item.productName || "เลือกสินค้า"}
          </p>
          <p className="text-xs text-gray-400 capitalize">{item.productCategory}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={onChangeProduct}
            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
            เปลี่ยน
          </button>
          {canRemove && (
            <button type="button" onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Spec fields by category */}
      <div className="p-3 space-y-3">

        {/* ── เสาไฟฟ้า ── */}
        {item.productCategory === "pole" && (
          <>
            <PillGroup
              label="ความยาว"
              options={POLE_SIZES}
              value={item.specSize}
              onChange={(v) => onChange("specSize", v)}
            />
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">จำนวน (ต้น)</p>
              <input
                className={inputCls}
                placeholder="ระบุจำนวน"
                value={item.quantity}
                onChange={(e) => onChange("quantity", e.target.value)}
                inputMode="numeric"
              />
            </div>
          </>
        )}

        {/* ── แผ่นพื้น Hollow Core ── */}
        {item.productCategory === "slab" && (
          <>
            <PillGroup
              label="ความหนา"
              options={SLAB_THICKNESSES}
              value={item.specSize}
              onChange={(v) => onChange("specSize", v)}
            />
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">
                พื้นที่ (ตร.ม.)
                <span className="text-gray-400 ml-1">— เริ่มต้น {SLAB_MIN_QTY} ตร.ม.</span>
              </p>
              <input
                className={inputCls}
                placeholder={`ขั้นต่ำ ${SLAB_MIN_QTY} ตร.ม.`}
                value={item.quantity}
                onChange={(e) => onChange("quantity", e.target.value)}
                inputMode="numeric"
              />
            </div>
          </>
        )}

        {/* ── เสาเข็ม ── */}
        {item.productCategory === "pile" && (
          <>
            <PillGroup
              label="ประเภทเสาเข็ม"
              options={[...PILE_TYPES]}
              value={item.specType}
              onChange={(v) => onChange("specType", v)}
            />
            <PillGroup
              label="ขนาดหน้าตัด"
              options={PILE_SPECS.map((p) => p.label)}
              value={item.specSize}
              onChange={(v) => {
                onChange("specSize", v);
                const newMax = PILE_SPECS.find((p) => p.label === v)?.maxLength ?? 27;
                if (item.specLength && Number(item.specLength) > newMax) onChange("specLength", String(newMax));
              }}
            />
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">
                ความยาว (ม.)
                {item.specSize && (
                  <span className="text-gray-400 ml-1">— ขั้นต่ำ 6 ม. / สูงสุด {pileMaxLength} ม.</span>
                )}
              </p>
              <input
                className={inputCls}
                placeholder={item.specSize ? `6 – ${pileMaxLength} ม.` : "เลือกหน้าตัดก่อน"}
                value={item.specLength}
                onChange={(e) => onChange("specLength", e.target.value)}
                inputMode="numeric"
                disabled={!item.specSize}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">จำนวน (ต้น)</p>
              <input
                className={inputCls}
                placeholder="ระบุจำนวน"
                value={item.quantity}
                onChange={(e) => onChange("quantity", e.target.value)}
                inputMode="numeric"
              />
            </div>
          </>
        )}

        {/* ── ไม่รู้ category (fallback) ── */}
        {item.productCategory && !["pole", "slab", "pile"].includes(item.productCategory) && (
          <div className="flex gap-2">
            <input className={inputCls} placeholder="จำนวน" value={item.quantity} onChange={(e) => onChange("quantity", e.target.value)} inputMode="numeric" />
            <input className="w-24 border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:border-blue-400" placeholder="หน่วย" value={item.unit} onChange={(e) => onChange("unit", e.target.value)} />
          </div>
        )}

        {/* Note */}
        <input
          className={inputCls}
          placeholder="ระบุรายละเอียดเพิ่มเติม (ถ้ามี)"
          value={item.note}
          onChange={(e) => onChange("note", e.target.value)}
          style={{ fontFamily: "Sarabun, sans-serif" }}
        />
      </div>
    </div>
  );
}

/* ─── Build item description for API ───────────────────────────────── */
function buildItemPayload(item: RfqItem) {
  let spec = "";
  if (item.productCategory === "pole") {
    spec = item.specSize ? `ความยาว ${item.specSize}` : "";
  } else if (item.productCategory === "slab") {
    spec = item.specSize ? `ความหนา ${item.specSize}` : "";
  } else if (item.productCategory === "pile") {
    const type = item.specType ? `${item.specType} ` : "";
    const cross = item.specSize ? `หน้าตัด ${item.specSize}` : "";
    const len = item.specLength ? ` ยาว ${item.specLength} ม.` : "";
    spec = type + cross + len;
  }
  return {
    productName: item.productName,
    spec,
    quantity: item.quantity,
    unit: item.unit,
    note: item.note,
  };
}

/* ─── Main Form ─────────────────────────────────────────────────────── */
function RfqForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<CustomerType>("general");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [company, setCompany] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address, setAddress] = useState("");
  const [govRef, setGovRef] = useState("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<RfqItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [pickerForIndex, setPickerForIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        const slug = searchParams.get("product");
        if (slug) {
          const found = data.find((p: Product) => p.slug === slug);
          if (found) { setItems([defaultItem(found)]); return; }
        }
        setPickerForIndex(0);
        setItems([defaultItem()]);
      });
  }, []);

  const selectProduct = (index: number, product: Product) => {
    setItems((prev) => prev.map((item, i) => i === index ? defaultItem(product) : item));
  };

  const addItem = () => {
    const newIndex = items.length;
    setItems((prev) => [...prev, defaultItem()]);
    setPickerForIndex(newIndex);
  };

  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const updateItem = (i: number, field: keyof RfqItem, value: string) =>
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "กรุณากรอกชื่อ";
    if (!phone.trim()) e.phone = "กรุณากรอกเบอร์โทร";
    if ((tab === "private" || tab === "government") && !company.trim())
      e.company = "กรุณากรอกชื่อบริษัท/หน่วยงาน";
    if ((tab === "private" || tab === "government") && !taxId.trim())
      e.taxId = "กรุณากรอกเลขประจำตัวผู้เสียภาษี";
    if ((tab === "private" || tab === "government") && !address.trim())
      e.address = "กรุณากรอกที่อยู่ออกใบกำกับภาษี";
    if (items.length === 0) {
      e.items = "กรุณาเลือกสินค้าอย่างน้อย 1 รายการ";
    } else {
      for (const item of items) {
        if (!item.productSlug) { e.items = "กรุณาเลือกสินค้าให้ครบทุกรายการ"; break; }
        if (!item.specSize) { e.items = "กรุณาเลือกขนาด/ความหนา/หน้าตัดให้ครบ"; break; }
        if (item.productCategory === "pile" && !item.specType) { e.items = "กรุณาเลือกประเภทเสาเข็ม"; break; }
        if (item.productCategory === "pile" && !item.specLength) { e.items = "กรุณาระบุความยาวเสาเข็ม"; break; }
        if (!item.quantity) { e.items = "กรุณาระบุจำนวนให้ครบ"; break; }
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerType: tab,
          name, phone,
          email: email || null,
          lineId: lineId || null,
          company: company || null,
          taxId: taxId || null,
          address: address || null,
          govRef: govRef || null,
          message: message || null,
          items: items.map(buildItemPayload),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ submit: data.error ?? "เกิดข้อผิดพลาด" }); return; }
      router.push(`/rfq/success?ref=${data.refCode}`);
    } catch {
      setErrors({ submit: "ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่" });
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { value: CustomerType; label: string }[] = [
    { value: "general", label: "ทั่วไป / บุคคล" },
    { value: "private", label: "บริษัท / เอกชน" },
    { value: "government", label: "ภาครัฐ" },
  ];

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const errCls = "text-xs text-red-500 mt-1";

  return (
    <>
      {pickerForIndex !== null && products.length > 0 && (
        <ProductPickerModal
          products={products}
          onSelect={(p) => selectProduct(pickerForIndex, p)}
          onClose={() => setPickerForIndex(null)}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#1a2f6e", fontFamily: "Playfair Display, serif" }}>
          ขอใบเสนอราคา
        </h1>
        <p className="text-sm text-gray-500 mb-6">กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับภายใน 1–2 วันทำการ</p>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          {tabs.map((t) => (
            <button key={t.value} type="button" onClick={() => setTab(t.value)}
              className="flex-1 py-2.5 text-sm font-medium transition-colors"
              style={tab === t.value ? { background: "#1a2f6e", color: "white" } : { background: "white", color: "#5a6480" }}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>ชื่อ-นามสกุล *</label>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อ นามสกุล" style={{ fontFamily: "Sarabun, sans-serif" }} />
              {errors.name && <p className={errCls}>{errors.name}</p>}
            </div>
            <div>
              <label className={labelCls}>เบอร์โทรศัพท์ *</label>
              <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08X-XXX-XXXX" inputMode="tel" />
              {errors.phone && <p className={errCls}>{errors.phone}</p>}
            </div>
          </div>

          {/* Email + Line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>อีเมล</label>
              <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
            </div>
            <div>
              <label className={labelCls}>Line ID</label>
              <input className={inputCls} value={lineId} onChange={(e) => setLineId(e.target.value)} placeholder="@lineid" />
            </div>
          </div>

          {/* Company / Gov */}
          {(tab === "private" || tab === "government") && (
            <div>
              <label className={labelCls}>{tab === "government" ? "ชื่อหน่วยงาน *" : "ชื่อบริษัท *"}</label>
              <input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder={tab === "government" ? "ชื่อหน่วยงานภาครัฐ" : "บริษัท จำกัด"} style={{ fontFamily: "Sarabun, sans-serif" }} />
              {errors.company && <p className={errCls}>{errors.company}</p>}
            </div>
          )}
          {(tab === "private" || tab === "government") && (
            <div>
              <label className={labelCls}>เลขประจำตัวผู้เสียภาษี *</label>
              <input className={inputCls} value={taxId} onChange={(e) => setTaxId(e.target.value)}
                placeholder="0-0000-00000-00-0 (13 หลัก)" maxLength={17} />
              {errors.taxId && <p className={errCls}>{errors.taxId}</p>}
            </div>
          )}
          {(tab === "private" || tab === "government") && (
            <div>
              <label className={labelCls}>ที่อยู่ออกใบกำกับภาษี *</label>
              <textarea className={inputCls} rows={2} value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="เลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์" style={{ fontFamily: "Sarabun, sans-serif" }} />
              {errors.address && <p className={errCls}>{errors.address}</p>}
            </div>
          )}
          {tab === "government" && (
            <div>
              <label className={labelCls}>เลขที่หนังสือราชการ</label>
              <input className={inputCls} value={govRef} onChange={(e) => setGovRef(e.target.value)} placeholder="เลขที่หนังสือ (ถ้ามี)" />
            </div>
          )}

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + " mb-0"}>รายการสินค้า *</label>
              <button type="button" onClick={addItem}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: "#f5c200", color: "#1a2f6e" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                เพิ่มสินค้า
              </button>
            </div>
            {errors.items && <p className={errCls + " mb-2"}>{errors.items}</p>}

            {items.length === 0 ? (
              <button type="button" onClick={() => { setItems([defaultItem()]); setPickerForIndex(0); }}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-yellow-400 hover:text-yellow-600 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">กดเพื่อเลือกสินค้า</span>
              </button>
            ) : (
              <div className="space-y-3">
                {items.map((item, i) => (
                  <ItemRow
                    key={i}
                    item={item}
                    canRemove={items.length > 1}
                    onChange={(field, value) => updateItem(i, field, value)}
                    onRemove={() => removeItem(i)}
                    onChangeProduct={() => setPickerForIndex(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className={labelCls}>หมายเหตุ / ข้อมูลเพิ่มเติม</label>
            <textarea className={inputCls} rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="สถานที่จัดส่ง, วันที่ต้องการ, เงื่อนไขพิเศษ ฯลฯ" style={{ fontFamily: "Sarabun, sans-serif" }} />
          </div>

          {errors.submit && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{errors.submit}</p>}

          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60"
            style={{ background: "#1a2f6e", color: "white" }}>
            {submitting ? "กำลังส่ง..." : "ส่งคำขอใบเสนอราคา"}
          </button>
        </form>
      </div>
    </>
  );
}

export default function RfqPage() {
  return (
    <Suspense>
      <RfqForm />
    </Suspense>
  );
}
