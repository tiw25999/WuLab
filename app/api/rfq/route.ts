import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRefCode } from "@/lib/ref-code";
import { sendRfqNotification, sendRfqConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    customerType,
    name,
    phone,
    email,
    lineId,
    company,
    projectType,
    province,
    govRef,
    taxId,
    address,
    message,
    items,
  } = body as Record<string, unknown>;

  // Validate required fields
  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "กรุณากรอกชื่อ" }, { status: 400 });
  }
  if (!phone || typeof phone !== "string" || phone.trim() === "") {
    return NextResponse.json({ error: "กรุณากรอกเบอร์โทร" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "กรุณาเลือกสินค้าอย่างน้อย 1 รายการ" }, { status: 400 });
  }

  const refCode = await generateRefCode();

  const inquiry = await prisma.inquiry.create({
    data: {
      refCode,
      customerType: (customerType as string) ?? "general",
      name: (name as string).trim(),
      phone: (phone as string).trim(),
      email: typeof email === "string" ? email.trim() || null : null,
      lineId: typeof lineId === "string" ? lineId.trim() || null : null,
      company: typeof company === "string" ? company.trim() || null : null,
      projectType: typeof projectType === "string" ? projectType.trim() || null : null,
      province: typeof province === "string" ? province.trim() || null : null,
      govRef: typeof govRef === "string" ? govRef.trim() || null : null,
      taxId: typeof taxId === "string" ? taxId.trim() || null : null,
      address: typeof address === "string" ? address.trim() || null : null,
      message: typeof message === "string" ? message.trim() || null : null,
      items: JSON.stringify(items),
      status: "new",
    },
  });

  const emailData = {
    refCode,
    customerName: inquiry.name,
    customerPhone: inquiry.phone,
    customerEmail: inquiry.email,
    customerType: inquiry.customerType,
    company: inquiry.company,
    items: (items as Array<{ productName: string; quantity: string; unit: string }>),
    note: inquiry.message,
  };

  // fire-and-forget
  sendRfqNotification(emailData);
  sendRfqConfirmation(emailData);

  return NextResponse.json({ refCode, id: inquiry.id }, { status: 201 });
}
