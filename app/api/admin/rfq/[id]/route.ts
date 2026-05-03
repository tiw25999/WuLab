import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { quotation: { include: { purchaseOrder: true } } },
  });
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ...inquiry, items: JSON.parse(inquiry.items) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();
  const inquiry = await prisma.inquiry.update({ where: { id }, data: { status } });
  return NextResponse.json(inquiry);
}
