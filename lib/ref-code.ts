import { prisma } from "./prisma";

export async function generateRefCode(): Promise<string> {
  const today = new Date();
  const dateStr = today
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ""); // "YYYYMMDD"

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const count = await prisma.inquiry.count({
    where: { createdAt: { gte: startOfDay, lte: endOfDay } },
  });

  const seq = String(count + 1).padStart(4, "0");
  return `SMC-${dateStr}-${seq}`;
}
