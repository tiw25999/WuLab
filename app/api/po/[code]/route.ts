import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const po = await prisma.purchaseOrder.findUnique({
    where: { poCode: code },
    include: {
      quotation: {
        select: {
          quoteCode: true,
          total: true,
          inquiry: {
            select: { name: true, company: true, phone: true },
          },
        },
      },
    },
  });

  if (!po) return NextResponse.json({ error: "ไม่พบรหัส PO นี้" }, { status: 404 });

  return NextResponse.json({
    poCode: po.poCode,
    customerPoNumber: po.customerPoNumber,
    status: po.status,
    receivedAt: po.receivedAt,
    quoteCode: po.quotation.quoteCode,
    total: po.quotation.total,
    name: po.quotation.inquiry.name,
    company: po.quotation.inquiry.company,
    phone: po.quotation.inquiry.phone,
  });
}
