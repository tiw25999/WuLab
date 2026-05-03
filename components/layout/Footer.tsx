import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#1a2f6e", color: "white" }} className="mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div>
            <h3 className="font-semibold text-base mb-3" style={{ color: "#f5c200", fontFamily: "Sarabun, sans-serif" }}>
              บริษัท สยามมาสเตอส์คอนกรีต จำกัด
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              222 หมู่ที่ 5 ตำบลนาสาร<br />
              อำเภอพระพรหม จังหวัดนครศรีธรรมราช 80000
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-base mb-3" style={{ color: "#f5c200", fontFamily: "Sarabun, sans-serif" }}>
              ติดต่อเรา
            </h3>
            <ul className="text-white/70 text-sm space-y-1">
              <li>โทร: 075-330-777-9</li>
              <li>โทร: 075-846-048</li>
              <li>อีเมล: siammasters@gmail.com</li>
              <li>Line: @sicon</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-base mb-3" style={{ color: "#f5c200", fontFamily: "Sarabun, sans-serif" }}>
              บริการ
            </h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link href="/products" className="text-white/70 hover:text-white transition-colors">
                  สินค้าทั้งหมด
                </Link>
              </li>
              <li>
                <Link href="/rfq" className="text-white/70 hover:text-white transition-colors">
                  ขอใบเสนอราคา
                </Link>
              </li>
              <li>
                <Link href="/rfq/track" className="text-white/70 hover:text-white transition-colors">
                  ติดตามคำขอ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-white/40 text-xs">
          © {new Date().getFullYear()} บริษัท สยามมาสเตอส์คอนกรีต จำกัด (SICON). All rights reserved.
        </div>
      </div>
    </footer>
  );
}
