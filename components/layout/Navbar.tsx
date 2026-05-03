"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => setIsAuthenticated(r.ok))
      .catch(() => setIsAuthenticated(false));
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <header style={{ background: "#1a2f6e" }} className="sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div
              className="shrink-0 rounded-lg"
              style={{
                width: 40,
                height: 40,
                backgroundImage: "url('/logo.png')",
                backgroundSize: "120px auto",
                backgroundPosition: "-40px -22px",
                backgroundRepeat: "no-repeat",
                backgroundColor: "white",
              }}
              role="img"
              aria-label="SICON Logo"
            />
            <div className="hidden sm:block whitespace-nowrap">
              <span className="text-white font-bold text-base tracking-wide block leading-tight" style={{ fontFamily: "Sarabun, sans-serif" }}>
                สยามมาสเตอส์คอนกรีต
              </span>
              <span className="text-xs font-semibold tracking-widest" style={{ color: "#f5c200" }}>
                SICON · ก่อตั้ง พ.ศ. 2537
              </span>
            </div>
          </Link>

          {/* Desktop Nav — left links */}
          <nav className="hidden md:flex items-center gap-8 ml-10">
            <Link href="/products" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              สินค้า
            </Link>
            <Link href="/rfq/track" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              ติดตามคำขอ
            </Link>
            {isAuthenticated && (
              <Link href="/admin" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                ระบบจัดการ
              </Link>
            )}
          </nav>

          {/* Desktop Nav — right actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-white/60 hover:text-white text-sm font-medium transition-colors border border-white/20 px-3 py-1.5 rounded flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/rfq"
                  className="px-4 py-2 rounded text-sm font-semibold transition-colors"
                  style={{ background: "#f5c200", color: "#1a2f6e" }}
                >
                  ขอใบเสนอราคา
                </Link>
                <Link
                  href="/admin/login"
                  className="text-white/60 hover:text-white text-sm font-medium transition-colors border border-white/20 px-3 py-1.5 rounded flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link href="/products" className="text-white/80 hover:text-white text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
              สินค้า
            </Link>
            <Link href="/rfq/track" className="text-white/80 hover:text-white text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
              ติดตามคำขอ
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/admin" className="text-white/60 hover:text-white text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                  ระบบจัดการ
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="text-white/60 hover:text-white text-sm font-medium py-2 text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/rfq"
                  className="px-4 py-2 rounded text-sm font-semibold text-center"
                  style={{ background: "#f5c200", color: "#1a2f6e" }}
                  onClick={() => setMenuOpen(false)}
                >
                  ขอใบเสนอราคา
                </Link>
                <Link href="/admin/login" className="text-white/60 hover:text-white text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
