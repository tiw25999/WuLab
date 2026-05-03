"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) { router.push("/admin"); router.refresh(); }
    else { const d = await res.json(); setError(d.error ?? "เกิดข้อผิดพลาด"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#1a2f6e" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: "#f5c200" }}>SICON ADMIN</p>
          <h1 className="text-xl font-bold" style={{ color: "#1a2f6e" }}>เข้าสู่ระบบ</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="admin" autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
            style={{ background: "#1a2f6e", color: "white" }}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}
