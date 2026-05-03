"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isOrders = pathname === "/admin/orders";
  const isRfq = pathname === "/admin" || pathname === "/admin/";
  const showTabs = isRfq || isOrders;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f8", fontFamily: "Sarabun, sans-serif" }}>
      {showTabs && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="flex items-center gap-1 border-b border-gray-200">
            <Link
              href="/admin"
              className="px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all"
              style={isRfq
                ? { borderBottomColor: "#1a2f6e", background: "#1a2f6e", color: "white" }
                : { borderBottomColor: "transparent", color: "#5a6480" }}>
              คำขอใบเสนอราคา
            </Link>
            <Link
              href="/admin/orders"
              className="px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all"
              style={isOrders
                ? { borderBottomColor: "#1a2f6e", background: "#1a2f6e", color: "white" }
                : { borderBottomColor: "transparent", color: "#5a6480" }}>
              คำสั่งซื้อ (PO)
            </Link>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
