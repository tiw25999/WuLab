import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;

  const inquiry = await prisma.inquiry.findUnique({
    where: { refCode: ref },
    include: {
      quotation: {
        select: {
          quoteCode: true,
          total: true,
          validDays: true,
          createdAt: true,
          purchaseOrder: {
            select: {
              poCode: true,
              customerPoNumber: true,
              status: true,
              receivedAt: true,
            },
          },
        },
      },
    },
  });

  if (!inquiry) {
    return NextResponse.json({ error: "ไม่พบรหัสอ้างอิงนี้" }, { status: 404 });
  }

  return NextResponse.json({
    refCode: inquiry.refCode,
    status: inquiry.status,
    customerType: inquiry.customerType,
    name: inquiry.name,
    phone: inquiry.phone,
    company: inquiry.company,
    items: JSON.parse(inquiry.items),
    createdAt: inquiry.createdAt,
    quotation: inquiry.quotation ?? null,
  });
}
