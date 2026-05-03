import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
}

interface RfqEmailData {
  refCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerType: string;
  company?: string | null;
  items: Array<{ productName: string; quantity: string; unit: string }>;
  note?: string | null;
}

export async function sendRfqNotification(data: RfqEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";

  if (!adminEmail || process.env.RESEND_API_KEY === "re_placeholder") return;

  const itemsHtml = data.items
    .map((i) => `<li>${i.productName} — ${i.quantity} ${i.unit}</li>`)
    .join("");

  const customerTypeLabel: Record<string, string> = {
    general: "ทั่วไป / บุคคล",
    private: "บริษัท / เอกชน",
    government: "หน่วยงานภาครัฐ",
  };

  // fire-and-forget — ไม่ throw แม้ล้มเหลว
  getResend().emails
    .send({
      from: fromEmail,
      to: adminEmail,
      subject: `[RFQ] ${data.refCode} — ${data.customerName}`,
      html: `
        <h2>คำขอใบเสนอราคาใหม่</h2>
        <p><strong>refCode:</strong> ${data.refCode}</p>
        <p><strong>ประเภทลูกค้า:</strong> ${customerTypeLabel[data.customerType] ?? data.customerType}</p>
        <p><strong>ชื่อ:</strong> ${data.customerName}</p>
        <p><strong>โทร:</strong> ${data.customerPhone}</p>
        ${data.customerEmail ? `<p><strong>อีเมล:</strong> ${data.customerEmail}</p>` : ""}
        ${data.company ? `<p><strong>บริษัท/หน่วยงาน:</strong> ${data.company}</p>` : ""}
        <h3>รายการสินค้า</h3>
        <ul>${itemsHtml}</ul>
        ${data.note ? `<p><strong>หมายเหตุ:</strong> ${data.note}</p>` : ""}
      `,
    })
    .catch(() => {});
}

export async function sendRfqConfirmation(data: RfqEmailData): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";

  if (!data.customerEmail || process.env.RESEND_API_KEY === "re_placeholder") return;

  const itemsHtml = data.items
    .map((i) => `<li>${i.productName} — ${i.quantity} ${i.unit}</li>`)
    .join("");

  getResend().emails
    .send({
      from: fromEmail,
      to: data.customerEmail,
      subject: `ยืนยันคำขอใบเสนอราคา — ${data.refCode}`,
      html: `
        <h2>เราได้รับคำขอใบเสนอราคาของคุณแล้ว</h2>
        <p>รหัสอ้างอิง: <strong>${data.refCode}</strong></p>
        <p>ทีมงาน SICON จะติดต่อกลับภายใน 1–2 วันทำการ</p>
        <h3>รายการที่ขอ</h3>
        <ul>${itemsHtml}</ul>
        <hr/>
        <p>บริษัท สยามมาสเตอส์คอนกรีต จำกัด (SICON)</p>
        <p>โทร: 075-330-777-9 | Line: @sicon</p>
      `,
    })
    .catch(() => {});
}
