import Image from "next/image";
import Link from "next/link";

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

export default function ProductCard({ product }: { product: Product }) {
  const isPreorder = product.productType === "preorder";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative h-52 bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.nameTh}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Badge */}
        {isPreorder && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded"
            style={{ background: "#ea580c", color: "white" }}
          >
            สั่งผลิตพิเศษ
          </span>
        )}
        {!isPreorder && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded"
            style={{ background: "#16a34a", color: "white" }}
          >
            พร้อมส่ง
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-semibold text-base mb-1 leading-snug"
          style={{ color: "#1a2f6e", fontFamily: "Sarabun, sans-serif" }}
        >
          {product.nameTh}
        </h3>
        <p className="text-xs text-gray-400 mb-2">{product.nameEn}</p>
        <p className="text-sm text-gray-600 line-clamp-2 flex-1 mb-3">{product.descTh}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
          {product.minOrderQty && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              ขั้นต่ำ: {product.minOrderQty}
            </span>
          )}
          {isPreorder && product.leadTimeDays && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              ผลิต {product.leadTimeDays} วัน
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/rfq?product=${product.slug}`}
          className="block text-center py-2 px-4 rounded text-sm font-semibold transition-colors"
          style={{ background: "#f5c200", color: "#1a2f6e" }}
        >
          ขอใบเสนอราคา
        </Link>
      </div>
    </div>
  );
}
