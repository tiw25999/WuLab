import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { generateQuoteCode } from "@/lib/quote-code";

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { inquiryId, items, notes, validDays } = await req.json();

  if (!inquiryId || !Array.isArray(items) || items.length === 0)
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });

  const subtotal = items.reduce((s: number, i: { total: number }) => s + i.total, 0);
  const vatAmount = Math.round(subtotal * 0.07 * 100) / 100;
  const total = Math.round((subtotal + vatAmount) * 100) / 100;

  const existing = await prisma.quotation.findUnique({
    where: { inquiryId },
    include: { purchaseOrder: true },
  });
  if (existing) return NextResponse.json({ error: "มีใบเสนอราคาแล้ว" }, { status: 409 });

  const quoteCode = await generateQuoteCode();

  const quotation = await prisma.quotation.create({
    data: {
      quoteCode,
      inquiryId,
      items: JSON.stringify(items),
      subtotal,
      vatAmount,
      total,
      validDays: validDays ?? 30,
      notes: notes ?? null,
      status: "pending",
    },
  });

  await prisma.inquiry.update({ where: { id: inquiryId }, data: { status: "completed" } });

  return NextResponse.json({ quoteCode: quotation.quoteCode }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { inquiryId, items, notes, validDays } = await req.json();
  if (!inquiryId || !Array.isArray(items) || items.length === 0)
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });

  const existing = await prisma.quotation.findUnique({
    where: { inquiryId },
    include: { purchaseOrder: true },
  });
  if (!existing) return NextResponse.json({ error: "ไม่พบใบเสนอราคา" }, { status: 404 });
  if (existing.purchaseOrder) return NextResponse.json({ error: "มี PO แล้ว ไม่สามารถแก้ไขได้" }, { status: 409 });

  const subtotal = items.reduce((s: number, i: { total: number }) => s + i.total, 0);
  const vatAmount = Math.round(subtotal * 0.07 * 100) / 100;
  const total = Math.round((subtotal + vatAmount) * 100) / 100;
  const quoteCode = await generateQuoteCode();

  await prisma.quotation.delete({ where: { id: existing.id } });

  const quotation = await prisma.quotation.create({
    data: {
      quoteCode,
      inquiryId,
      items: JSON.stringify(items),
      subtotal,
      vatAmount,
      total,
      validDays: validDays ?? 30,
      notes: notes ?? null,
      status: "pending",
    },
  });

  await prisma.inquiry.update({ where: { id: inquiryId }, data: { status: "completed" } });

  return NextResponse.json({ quoteCode: quotation.quoteCode });
}
