"use client";

import { useEffect, useState, useCallback } from "react";
import ProductCard from "@/components/products/ProductCard";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (typeFilter) params.set("type", typeFilter);

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, [search, typeFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "#1a2f6e", fontFamily: "Playfair Display, serif" }}
        >
          สินค้าของเรา
        </h1>
        <p className="text-gray-500 text-sm">
          ผลิตภัณฑ์คอนกรีตอัดแรงมาตรฐาน มอก. — พร้อมส่งและสั่งผลิตพิเศษ
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
          style={{ fontFamily: "Sarabun, sans-serif" }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
          style={{ fontFamily: "Sarabun, sans-serif" }}
        >
          <option value="">ทั้งหมด</option>
          <option value="standard">พร้อมส่ง</option>
          <option value="preorder">สั่งผลิตพิเศษ</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#1a2f6e", borderTopColor: "transparent" }}
          />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">ไม่พบสินค้า</p>
          <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
