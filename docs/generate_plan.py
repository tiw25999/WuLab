from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import datetime

doc = Document()

# ---- Page margin ----
section = doc.sections[0]
section.top_margin = Cm(2.5)
section.bottom_margin = Cm(2.5)
section.left_margin = Cm(3)
section.right_margin = Cm(2.5)

# ---- Helpers ----
def heading(text, level=1, color=RGBColor(0x1A, 0x56, 0xDB)):
    p = doc.add_heading(text, level=level)
    run = p.runs[0] if p.runs else p.add_run(text)
    run.font.color.rgb = color
    run.font.bold = True
    if level == 1:
        run.font.size = Pt(16)
    elif level == 2:
        run.font.size = Pt(13)
    else:
        run.font.size = Pt(11)
    return p

def para(text, bold=False, italic=False, size=11, indent=0):
    p = doc.add_paragraph()
    if indent:
        p.paragraph_format.left_indent = Cm(indent)
    run = p.add_run(text)
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    return p

def bullet(text, level=0):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.left_indent = Cm(0.5 + level * 0.5)
    run = p.add_run(text)
    run.font.size = Pt(10.5)
    return p

def numbered(text, level=0):
    p = doc.add_paragraph(style='List Number')
    p.paragraph_format.left_indent = Cm(0.5 + level * 0.5)
    run = p.add_run(text)
    run.font.size = Pt(10.5)
    return p

def divider():
    p = doc.add_paragraph("─" * 80)
    p.runs[0].font.color.rgb = RGBColor(0xCC, 0xCC, 0xCC)
    p.runs[0].font.size = Pt(8)
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)

def add_table(headers, rows, col_widths=None):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = 'Table Grid'
    # Header row
    hdr = table.rows[0]
    for i, h in enumerate(headers):
        cell = hdr.cells[i]
        cell.text = h
        run = cell.paragraphs[0].runs[0]
        run.bold = True
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        # Blue background
        tc = cell._tc
        tcPr = tc.get_or_add_tcPr()
        shd = OxmlElement('w:shd')
        shd.set(qn('w:val'), 'clear')
        shd.set(qn('w:color'), 'auto')
        shd.set(qn('w:fill'), '1A56DB')
        tcPr.append(shd)
    # Data rows
    for r_idx, row_data in enumerate(rows):
        row = table.rows[r_idx + 1]
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.text = val
            cell.paragraphs[0].runs[0].font.size = Pt(10)
            if r_idx % 2 == 1:
                tc = cell._tc
                tcPr = tc.get_or_add_tcPr()
                shd = OxmlElement('w:shd')
                shd.set(qn('w:val'), 'clear')
                shd.set(qn('w:color'), 'auto')
                shd.set(qn('w:fill'), 'EBF5FB')
                tcPr.append(shd)
    # Column widths
    if col_widths:
        for i, w in enumerate(col_widths):
            for row in table.rows:
                row.cells[i].width = Cm(w)
    return table

# ================================================================
# TITLE PAGE
# ================================================================
doc.add_paragraph()
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run("WuLab — Siam Master Concrete")
run.font.size = Pt(22)
run.font.bold = True
run.font.color.rgb = RGBColor(0x1A, 0x56, 0xDB)

subtitle = doc.add_paragraph()
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
run2 = subtitle.add_run("แผนพัฒนาเว็บไซต์และระบบขาย  |  Feature List & Roadmap")
run2.font.size = Pt(13)
run2.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

date_p = doc.add_paragraph()
date_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run3 = date_p.add_run(f"จัดทำวันที่ {datetime.date.today().strftime('%d/%m/%Y')}")
run3.font.size = Pt(10)
run3.font.color.rgb = RGBColor(0x88, 0x88, 0x88)
run3.italic = True

doc.add_paragraph()
divider()
doc.add_paragraph()

# ================================================================
# 1. COMPANY OVERVIEW
# ================================================================
heading("1. ข้อมูลบริษัท", 1)

add_table(
    ["หัวข้อ", "รายละเอียด"],
    [
        ["ชื่อบริษัท", "บริษัท สยามมาสเตอร์คอนกรีต จำกัด"],
        ["ธุรกิจ", "ผลิตและจำหน่ายคอนกรีตอัดแรงสำเร็จรูป (Prestressed Concrete)"],
        ["ก่อตั้ง", "ปี พ.ศ. 2537  (ประสบการณ์กว่า 30 ปี)"],
        ["ภาษาเว็บ", "ไทย + อังกฤษ (Bilingual)"],
        ["ช่องทางติดต่อ", "ออนไลน์  /  โทรศัพท์  /  Walk-in"],
        ["ระบบลูกค้า", "ไม่มี Login — ใช้ฟอร์มขอใบเสนอราคา (RFQ)"],
        ["ERP / ราคา", "ไม่มีระบบเชื่อมต่อ — บริหารราคา Manual ในระบบ"],
    ],
    col_widths=[5, 10.5]
)

doc.add_paragraph()
heading("จุดแข็ง (Competitive Advantages)", 2)
bullet("มาตรฐาน มอก. — ผลิตภัณฑ์ผ่านการรับรองมาตรฐานอุตสาหกรรมไทย")
bullet("Hollow Core หายาก — ผู้ผลิตแผ่นพื้น Hollow Core มีน้อย ได้เปรียบในตลาด")
bullet("กำลังการผลิตสูง — รองรับโครงการขนาดใหญ่ได้")
bullet("คุณภาพและความสวยงาม — ควบคุมคุณภาพจากโรงงาน ได้มาตรฐาน")

doc.add_paragraph()

# ================================================================
# 2. PRODUCTS
# ================================================================
heading("2. ผลิตภัณฑ์หลัก", 1)

add_table(
    ["#", "ผลิตภัณฑ์", "คำอธิบาย / การใช้งาน"],
    [
        ["1", "เสาไฟฟ้าคอนกรีตอัดแรง", "เสาไฟฟ้าแรงสูง — งานระบบสาธารณูปโภค"],
        ["2", "แผ่นพื้น Hollow Core", "พื้นสำเร็จรูป — อาคาร, คอนโด, คลังสินค้า, อาคารจอดรถ"],
        ["3", "เสาเข็มคอนกรีตอัดแรง", "งานฐานราก — บ้านจัดสรร, อาคาร, โครงสร้างพื้นฐาน"],
    ],
    col_widths=[1.2, 5.5, 8.8]
)

doc.add_paragraph()

# ================================================================
# 3. TARGET CUSTOMERS
# ================================================================
heading("3. กลุ่มลูกค้าเป้าหมาย", 1)

add_table(
    ["กลุ่ม", "ลักษณะ", "Use Cases", "Journey หลัก"],
    [
        ["ลูกค้าทั่วไป", "บุคคล / ผู้รับเหมารายย่อย",
         "บ้านจัดสรร, งานก่อสร้างขนาดเล็ก",
         "ดูสินค้า → ขอใบเสนอราคา → ติดต่อ"],
        ["ลูกค้าเอกชน", "บริษัทรับเหมา / Developer",
         "อาคาร, คลังสินค้า, โรงงาน, คอนโด",
         "ดูสินค้า → Spec → RFQ → เจรจา"],
        ["ลูกค้ารัฐ", "หน่วยงานราชการ / รัฐวิสาหกิจ",
         "สะพาน, ถนน, รถไฟ, สาธารณูปโภค",
         "ดูเอกสาร → ข้อมูลประกวดราคา → ติดต่อ"],
    ],
    col_widths=[3, 4, 4.5, 4]
)

doc.add_paragraph()

# ================================================================
# 4. FEATURE LIST
# ================================================================
heading("4. Feature List ทั้งหมด", 1)

# --- 4.1 Company Storytelling ---
heading("4.1  Company Storytelling", 2)
add_table(
    ["Feature", "รายละเอียด", "Priority"],
    [
        ["Landing Page", "Hero section, จุดเด่นบริษัท, CTA ขอใบเสนอราคา", "Must"],
        ["เกี่ยวกับเรา", "ประวัติ 30 ปี, วิสัยทัศน์, ค่านิยม, ทีมงาน", "Must"],
        ["ความน่าเชื่อถือ", "โลโก้ มอก., ใบรับรองมาตรฐาน, จำนวนโปรเจคที่ผ่านมา", "Must"],
        ["Portfolio / ผลงาน", "ภาพและรายละเอียดโปรเจคอ้างอิง แยกตาม Use Case", "Should"],
        ["ข่าวสาร / บทความ", "ข่าวบริษัท, บทความวิชาการ Prestressed Concrete", "Could"],
    ],
    col_widths=[4, 9, 2.5]
)

doc.add_paragraph()

# --- 4.2 Product Catalog ---
heading("4.2  Product Catalog", 2)
add_table(
    ["Feature", "รายละเอียด", "Priority"],
    [
        ["รายการสินค้าทั้งหมด", "Grid/List view ครบ 3 ผลิตภัณฑ์ + รูปภาพ", "Must"],
        ["หน้าสินค้ารายการ", "Spec ครบ, ขนาด, น้ำหนัก, กำลังรับแรง, Use Case, ภาพ", "Must"],
        ["ดาวน์โหลด Datasheet", "PDF Spec Sheet / ใบรับรอง มอก. ดาวน์โหลดได้", "Must"],
        ["ตัวกรองสินค้า", "Filter ตามประเภท / การใช้งาน", "Should"],
        ["เปรียบเทียบสินค้า", "Compare ข้าม Spec ได้", "Could"],
    ],
    col_widths=[4, 9, 2.5]
)

doc.add_paragraph()

# --- 4.3 Sales Flow ---
heading("4.3  Sales Flow (RFQ System)", 2)
add_table(
    ["Feature", "รายละเอียด", "Priority"],
    [
        ["ฟอร์ม RFQ — ทั่วไป", "ชื่อ, เบอร์โทร, อีเมล, สินค้าที่สนใจ, ปริมาณ, ข้อความ", "Must"],
        ["ฟอร์ม RFQ — เอกชน", "ข้อมูลบริษัท + ประเภทโปรเจค + ไฟล์แนบ (แบบ)", "Must"],
        ["ฟอร์ม RFQ — รัฐ", "ข้อมูลหน่วยงาน + เลขที่จัดซื้อจัดจ้าง + เอกสาร", "Must"],
        ["Email Notification", "ส่ง email ยืนยันให้ลูกค้า + แจ้งเตือน Admin", "Must"],
        ["หน้า Thank You", "แสดงเลข Reference + สรุปข้อมูลที่ส่งมา", "Must"],
        ["ติดตาม Inquiry", "ลูกค้า track status ด้วย Reference Number", "Should"],
    ],
    col_widths=[4.5, 8.5, 2.5]
)

doc.add_paragraph()

# --- 4.4 Admin Dashboard ---
heading("4.4  Admin Dashboard", 2)
add_table(
    ["Feature", "รายละเอียด", "Priority"],
    [
        ["Admin Login", "Username + Password ปลอดภัย (JWT)", "Must"],
        ["รายการ Inquiry", "ดู Inquiry ทั้งหมด พร้อม filter ตามสถานะ / วันที่ / กลุ่ม", "Must"],
        ["จัดการ Inquiry", "เปลี่ยน status (ใหม่ → กำลังดำเนินการ → เสร็จสิ้น)", "Must"],
        ["จัดการสินค้า", "CRUD ข้อมูลสินค้า + อัปโหลดภาพ + Datasheet", "Must"],
        ["จัดการเนื้อหา", "แก้ไข About / Portfolio / ข่าวสาร", "Should"],
        ["Dashboard สรุป", "จำนวน Inquiry วันนี้ / เดือนนี้ / กราฟ", "Could"],
        ["Export รายงาน", "Export Inquiry เป็น Excel / CSV", "Could"],
    ],
    col_widths=[4.5, 8.5, 2.5]
)

doc.add_paragraph()

# --- 4.5 Customer Portal (Optional) ---
heading("4.5  Customer Portal (Optional — Phase 3)", 2)
add_table(
    ["Feature", "รายละเอียด", "Priority"],
    [
        ["Login ลูกค้าเอกชน", "Account สำหรับลูกค้าที่สั่งประจำ", "Could"],
        ["ประวัติ Inquiry", "ดูรายการ RFQ ที่เคยส่ง + สถานะ", "Could"],
        ["เอกสารสำหรับลูกค้ารัฐ", "ข้อมูล + เอกสารสนับสนุนการจัดซื้อจัดจ้าง", "Could"],
    ],
    col_widths=[4.5, 8.5, 2.5]
)

doc.add_paragraph()

# ================================================================
# 5. TECH STACK
# ================================================================
heading("5. Tech Stack", 1)

add_table(
    ["Layer", "Technology", "หมายเหตุ"],
    [
        ["Frontend + Backend", "Next.js 14  (App Router)", "Full-stack framework"],
        ["Database (Dev)", "Prisma ORM + SQLite", "ไม่ต้อง Docker"],
        ["Database (Prod)", "Prisma ORM + PostgreSQL", "Migrate ตอน deploy"],
        ["Styling", "Tailwind CSS", "Utility-first"],
        ["Images", "Cloudinary หรือ Local", "รูปสินค้า / Portfolio"],
        ["Auth (Admin)", "bcryptjs + JWT", "Session ปลอดภัย"],
        ["Email", "Resend หรือ Nodemailer", "RFQ notification"],
        ["Deploy", "Vercel", "CI/CD อัตโนมัติ"],
        ["Repo", "github.com/tiw25999/WuLab", "Branch: main"],
    ],
    col_widths=[4, 5, 6.5]
)

doc.add_paragraph()

# ================================================================
# 6. ROADMAP
# ================================================================
heading("6. Roadmap", 1)

heading("Phase 1 — MVP Showcase  (Demo / Pitch)", 2)
numbered("Landing page — Hero, จุดเด่น, CTA")
numbered("เกี่ยวกับเรา — ประวัติบริษัท 30 ปี, ใบรับรอง มอก.")
numbered("Product Catalog — 3 สินค้า + Spec + ภาพจริง + ดาวน์โหลด Datasheet")
numbered("ฟอร์ม RFQ แยก 3 กลุ่มลูกค้า + Email Notification")
numbered("Bilingual (TH / EN) ทุกหน้า")

doc.add_paragraph()
heading("Phase 2 — Sales System", 2)
numbered("Admin Dashboard — จัดการ Inquiry, เปลี่ยน Status")
numbered("จัดการสินค้าผ่าน Admin (CRUD + อัปโหลดภาพ)")
numbered("Customer Inquiry Tracking (Reference Number)")
numbered("Portfolio / ผลงาน")
numbered("Export รายงาน Excel")

doc.add_paragraph()
heading("Phase 3 — Customer Portal  (Optional)", 2)
numbered("Login ลูกค้าเอกชน")
numbered("ประวัติ Inquiry / คำสั่งซื้อ")
numbered("เอกสารจัดซื้อจัดจ้างสำหรับลูกค้ารัฐ")

doc.add_paragraph()

# ================================================================
# 7. PRIORITY LEGEND
# ================================================================
heading("7. Priority Legend", 1)
add_table(
    ["ระดับ", "ความหมาย"],
    [
        ["Must", "ต้องมีใน Phase 1 — ขาดไม่ได้"],
        ["Should", "ควรมีใน Phase 2 — เพิ่มคุณค่า"],
        ["Could", "มีถ้าเวลาเหลือ — Nice to have"],
    ],
    col_widths=[3, 12.5]
)

doc.add_paragraph()
divider()
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("WuLab  —  บริษัท สยามมาสเตอร์คอนกรีต จำกัด  |  เอกสารนี้จัดทำโดย AI Planning Assistant")
run.font.size = Pt(9)
run.font.color.rgb = RGBColor(0xAA, 0xAA, 0xAA)
run.italic = True

# ================================================================
# SAVE
# ================================================================
output_path = r"C:\Users\Win11\Desktop\CLAUDE MAX\Project\WuLab\docs\WuLab-FeaturePlan.docx"
doc.save(output_path)
print(f"Saved: {output_path}")
