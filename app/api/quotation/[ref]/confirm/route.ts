import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePoCode } from "@/lib/quote-code";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;

  const quotation = await prisma.quotation.findUnique({ where: { quoteCode: ref } });
  if (!quotation) return NextResponse.json({ error: "ไม่พบใบเสนอราคา" }, { status: 404 });
  if (quotation.status !== "pending") return NextResponse.json({ error: "ใบเสนอราคานี้ไม่สามารถยืนยันได้แล้ว" }, { status: 409 });

  const poCode = await generatePoCode();

  await prisma.quotation.update({ where: { id: quotation.id }, data: { status: "accepted", acceptedAt: new Date() } });
  const po = await prisma.purchaseOrder.create({
    data: { poCode, quotationId: quotation.id, status: "confirmed" },
  });

  return NextResponse.json({ poCode: po.poCode }, { status: 201 });
}
