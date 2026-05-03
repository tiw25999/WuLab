"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(ref).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "#f5c200" }}
      >
        <svg className="w-8 h-8" fill="none" stroke="#1a2f6e" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1
        className="text-2xl font-bold mb-3"
        style={{ color: "#1a2f6e", fontFamily: "Playfair Display, serif" }}
      >
        ส่งคำขอสำเร็จ!
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        เราได้รับคำขอใบเสนอราคาของคุณแล้ว<br />
        ทีมงานจะติดต่อกลับภายใน 1–2 วันทำการ
      </p>

      {/* refCode */}
      <div className="border-2 border-dashed rounded-lg p-6 mb-6" style={{ borderColor: "#1a2f6e" }}>
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">รหัสอ้างอิง</p>
        <p
          className="text-2xl font-medium mb-4"
          style={{ fontFamily: "DM Mono, monospace", color: "#1a2f6e" }}
        >
          {ref}
        </p>
        <button
          onClick={copyRef}
          className="px-4 py-2 rounded text-sm font-medium border transition-colors"
          style={{
            borderColor: "#1a2f6e",
            color: copied ? "white" : "#1a2f6e",
            background: copied ? "#1a2f6e" : "transparent",
          }}
        >
          {copied ? "คัดลอกแล้ว ✓" : "คัดลอก refCode"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/rfq/track?ref=${ref}`}
          className="flex-1 py-2.5 rounded text-sm font-semibold text-center"
          style={{ background: "#1a2f6e", color: "white" }}
        >
          ติดตามสถานะ
        </Link>
        <Link
          href="/products"
          className="flex-1 py-2.5 rounded text-sm font-semibold text-center border"
          style={{ borderColor: "#1a2f6e", color: "#1a2f6e" }}
        >
          กลับหน้าสินค้า
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
