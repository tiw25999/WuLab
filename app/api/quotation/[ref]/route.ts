import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;

  const quotation = await prisma.quotation.findUnique({
    where: { quoteCode: ref },
    include: {
      inquiry: { select: { refCode: true, name: true, phone: true, company: true, customerType: true, taxId: true, address: true, govRef: true } },
      purchaseOrder: true,
    },
  });

  if (!quotation) return NextResponse.json({ error: "ไม่พบใบเสนอราคา" }, { status: 404 });

  return NextResponse.json({ ...quotation, items: JSON.parse(quotation.items) });
}
