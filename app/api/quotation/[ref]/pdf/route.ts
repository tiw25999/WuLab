import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { QuotationPDF } from "@/components/pdf/QuotationPDF";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;

  try {
    const quotation = await prisma.quotation.findUnique({
      where: { quoteCode: ref },
      include: {
        inquiry: { select: { refCode: true, name: true, phone: true, company: true, customerType: true, email: true, taxId: true, address: true, govRef: true } },
      },
    });

    if (!quotation) return NextResponse.json({ error: "ไม่พบใบเสนอราคา" }, { status: 404 });

    const data = { ...quotation, items: JSON.parse(quotation.items) };

    const elem = React.createElement(QuotationPDF, { data }) as React.ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(elem);
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${ref}.pdf"`,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[pdf GET]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
