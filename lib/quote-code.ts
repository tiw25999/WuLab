import { prisma } from "@/lib/prisma";

export async function generateQuoteCode(): Promise<string> {
  const today = new Date();
  const ymd = today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  const prefix = `QT-${ymd}-`;
  const count = await prisma.quotation.count({
    where: { quoteCode: { startsWith: prefix } },
  });
  const seq = String(count + 1).padStart(4, "0");
  return `${prefix}${seq}`;
}

export async function generatePoCode(): Promise<string> {
  const today = new Date();
  const ymd = today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  const prefix = `PO-${ymd}-`;
  const count = await prisma.purchaseOrder.count({
    where: { poCode: { startsWith: prefix } },
  });
  const seq = String(count + 1).padStart(4, "0");
  return `${prefix}${seq}`;
}
