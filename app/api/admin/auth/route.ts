import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAdminToken, setAdminCookie, clearAdminCookie, getAdminSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true });
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });

  const token = await signAdminToken(admin.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(setAdminCookie(token));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearAdminCookie());
  return res;
}
