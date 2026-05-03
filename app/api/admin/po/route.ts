import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { generatePoCode } from "@/lib/quote-code";

export async function GET() {
  try {
    if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.purchaseOrder.findMany({
      orderBy: { receivedAt: "desc" },
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

    return NextResponse.json(orders);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[po GET]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quotationId, customerPoNumber, notes, customerPoFile } = await req.json();
  if (!quotationId) return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });

  const quotation = await prisma.quotation.findUnique({
    where: { id: quotationId },
    include: {
      inquiry: { select: { items: true } },
      purchaseOrder: { select: { poCode: true } },
    },
  });
  if (!quotation) return NextResponse.json({ error: "ไม่พบใบเสนอราคา" }, { status: 404 });
  if (quotation.purchaseOrder)
    return NextResponse.json({ error: "บันทึก PO แล้ว", poCode: quotation.purchaseOrder.poCode }, { status: 409 });

  // ถ้าทุกรายการเป็น standard (ไม่ใช่ preorder) ข้ามขั้นตอนการผลิตไปเลย
  let initialStatus = "received";
  try {
    const items: { productSlug?: string }[] = JSON.parse(quotation.inquiry.items);
    const slugs = items.map((i) => i.productSlug).filter(Boolean) as string[];
    if (slugs.length > 0) {
      const products = await prisma.product.findMany({
        where: { slug: { in: slugs } },
        select: { productType: true },
      });
      const hasPreorder = products.some((p) => p.productType === "preorder");
      if (!hasPreorder) initialStatus = "shipping";
    }
  } catch { /* ถ้า parse ไม่ได้ใช้ค่า default */ }

  const poCode = await generatePoCode();

  await prisma.quotation.update({
    where: { id: quotationId },
    data: { status: "accepted", acceptedAt: quotation.acceptedAt ?? new Date() },
  });

  const po = await prisma.purchaseOrder.create({
    data: {
      poCode,
      quotationId,
      customerPoNumber: customerPoNumber?.trim() || null,
      customerPoFile: customerPoFile?.trim() || null,
      notes: notes?.trim() || null,
      status: initialStatus,
    },
  });

  return NextResponse.json({ poCode: po.poCode }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[po POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
