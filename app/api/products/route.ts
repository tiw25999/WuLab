import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category") ?? "";
  const type = searchParams.get("type") ?? "";

  const products = await prisma.product.findMany({
    where: {
      ...(q && {
        OR: [
          { nameTh: { contains: q } },
          { nameEn: { contains: q } },
          { descTh: { contains: q } },
        ],
      }),
      ...(category && { category }),
      ...(type && { productType: type }),
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
      nameTh: true,
      nameEn: true,
      descTh: true,
      category: true,
      productType: true,
      leadTimeDays: true,
      minOrderQty: true,
      imageUrl: true,
    },
  });

  return NextResponse.json(products);
}
