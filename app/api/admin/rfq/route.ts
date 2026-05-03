import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        quotation: {
          include: { purchaseOrder: true },
        },
      },
    });
    return NextResponse.json(inquiries);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[rfq GET]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
