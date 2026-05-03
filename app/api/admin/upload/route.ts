import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const allowed = ["pdf", "jpg", "jpeg", "png", "webp"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "รองรับเฉพาะ PDF, JPG, PNG" }, { status: 400 });
  }

  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads", "po");
  await mkdir(uploadDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadDir, filename), new Uint8Array(bytes));

  return NextResponse.json({ path: `/uploads/po/${filename}`, filename: file.name });
}
