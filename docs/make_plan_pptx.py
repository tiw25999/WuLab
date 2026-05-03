"""
สร้าง Project Plan Presentation — WuLab / สยามมาสเตอส์คอนกรีต
รัน: python docs/make_plan_pptx.py
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import copy

OUT = "docs/SICON-ProjectPlan.pptx"

# ── Brand colors ──────────────────────────────────────────────────────────
NAVY   = RGBColor(0x1A, 0x2F, 0x6E)
YELLOW = RGBColor(0xF5, 0xC2, 0x00)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
GRAY   = RGBColor(0x5A, 0x64, 0x80)
LIGHT  = RGBColor(0xF0, 0xF2, 0xF8)
GREEN  = RGBColor(0x16, 0xA3, 0x4A)
AMBER  = RGBColor(0xD9, 0x77, 0x06)
DARK   = RGBColor(0x1A, 0x1A, 0x2E)

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]  # totally blank

W = prs.slide_width
H = prs.slide_height

# ── helpers ───────────────────────────────────────────────────────────────
def add_rect(slide, x, y, w, h, fill=None, line=None):
    shape = slide.shapes.add_shape(1, x, y, w, h)
    shape.line.fill.background()
    if fill:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill
    else:
        shape.fill.background()
    if line:
        shape.line.color.rgb = line
        shape.line.width = Pt(1)
    else:
        shape.line.fill.background()
    return shape

def add_text(slide, text, x, y, w, h,
             size=18, bold=False, color=DARK,
             align=PP_ALIGN.LEFT, wrap=True):
    txb = slide.shapes.add_textbox(x, y, w, h)
    tf  = txb.text_frame
    tf.word_wrap = wrap
    p   = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size  = Pt(size)
    run.font.bold  = bold
    run.font.color.rgb = color
    run.font.name  = "Sarabun"
    return txb

def slide_header(slide, title, subtitle=None):
    # top bar
    add_rect(slide, 0, 0, W, Inches(1.1), fill=NAVY)
    add_rect(slide, 0, Inches(1.1), Inches(0.08), H - Inches(1.1), fill=YELLOW)
    add_text(slide, title,
             Inches(0.35), Inches(0.15), W - Inches(1), Inches(0.65),
             size=28, bold=True, color=WHITE)
    if subtitle:
        add_text(slide, subtitle,
                 Inches(0.35), Inches(0.72), W - Inches(1), Inches(0.4),
                 size=13, color=YELLOW)

def footer(slide, text="WuLab · บริษัท สยามมาสเตอส์คอนกรีต จำกัด"):
    add_rect(slide, 0, H - Inches(0.38), W, Inches(0.38), fill=NAVY)
    add_text(slide, text, Inches(0.3), H - Inches(0.36), W - Inches(0.6), Inches(0.33),
             size=9, color=RGBColor(0xCC, 0xD4, 0xFF), align=PP_ALIGN.CENTER)

def card(slide, x, y, w, h, bg=WHITE, border=None):
    add_rect(slide, x, y, w, h, fill=bg, line=border or RGBColor(0xE2, 0xE8, 0xF0))

# ══════════════════════════════════════════════════════════════════════════
# SLIDE 1 — TITLE
# ══════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(BLANK)

# full-bleed navy bg
add_rect(sl, 0, 0, W, H, fill=NAVY)

# yellow accent bar left
add_rect(sl, 0, 0, Inches(0.5), H, fill=YELLOW)

# yellow accent bar bottom
add_rect(sl, 0, H - Inches(0.55), W, Inches(0.55), fill=YELLOW)

# company tag
add_text(sl, "บริษัท สยามมาสเตอส์คอนกรีต จำกัด  ·  SICON",
         Inches(0.9), Inches(1.2), Inches(11), Inches(0.5),
         size=14, bold=False, color=YELLOW)

# main title
add_text(sl, "WuLab",
         Inches(0.9), Inches(2.0), Inches(11), Inches(1.2),
         size=72, bold=True, color=WHITE)

add_text(sl, "ระบบเว็บไซต์และรับใบเสนอราคาออนไลน์",
         Inches(0.9), Inches(3.1), Inches(11), Inches(0.7),
         size=26, color=WHITE)

add_text(sl, "สินค้าคอนกรีตอัดแรง  ·  ลูกค้า 3 กลุ่ม  ·  MVP 2 Sprint",
         Inches(0.9), Inches(3.85), Inches(11), Inches(0.5),
         size=16, color=RGBColor(0xCC, 0xD4, 0xFF))

add_text(sl, "Project Plan  ·  2026",
         Inches(0.9), H - Inches(0.48), W - Inches(1.2), Inches(0.4),
         size=11, color=NAVY, align=PP_ALIGN.RIGHT)

# ══════════════════════════════════════════════════════════════════════════
# SLIDE 2 — ปัญหา & เป้าหมาย
# ══════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(BLANK)
add_rect(sl, 0, 0, W, H, fill=LIGHT)
slide_header(sl, "ปัญหาที่แก้ & เป้าหมาย", "Problem Statement & Objective")
footer(sl)

# left card — problem
card(sl, Inches(0.25), Inches(1.3), Inches(5.9), Inches(5.6), bg=WHITE)
add_text(sl, "ปัญหาปัจจุบัน",
         Inches(0.45), Inches(1.45), Inches(5.5), Inches(0.4),
         size=16, bold=True, color=NAVY)

problems = [
    ("📞", "ลูกค้าต้องโทรหรือมาพบเพื่อขอใบเสนอราคา"),
    ("📋", "ไม่มีระบบ track สถานะ — ลูกค้าไม่รู้ว่า order อยู่ขั้นตอนไหน"),
    ("📄", "เอกสารใบเสนอราคาทำมือ ใช้เวลานาน"),
    ("🗂", "ไม่มี workflow ชัดเจนจาก RFQ → ใบเสนอ → PO → จัดส่ง"),
]
for i, (icon, txt) in enumerate(problems):
    y = Inches(2.0) + i * Inches(1.0)
    add_rect(sl, Inches(0.45), y, Inches(0.45), Inches(0.45),
             fill=RGBColor(0xFE, 0xE2, 0xE2), line=RGBColor(0xFE, 0xA3, 0xA3))
    add_text(sl, icon, Inches(0.46), y, Inches(0.44), Inches(0.44),
             size=18, align=PP_ALIGN.CENTER)
    add_text(sl, txt, Inches(1.05), y + Inches(0.03), Inches(4.9), Inches(0.5),
             size=13, color=DARK)

# right card — solution
card(sl, Inches(6.35), Inches(1.3), Inches(6.7), Inches(5.6), bg=WHITE)
add_text(sl, "เป้าหมาย (WuLab)",
         Inches(6.55), Inches(1.45), Inches(6.3), Inches(0.4),
         size=16, bold=True, color=NAVY)

solutions = [
    ("✅", "ลูกค้าดูสินค้า + ส่ง RFQ ออนไลน์ได้ทันที"),
    ("✅", "Track สถานะด้วยรหัส SMC-YYYYMMDD-XXXX"),
    ("✅", "Admin สร้างใบเสนอราคา + ส่ง PDF link ให้ลูกค้า"),
    ("✅", "Kanban board ติดตาม PO → ผลิต → จัดส่ง"),
    ("✅", "ระบบรองรับลูกค้า 3 กลุ่ม พร้อมเอกสารที่ต่างกัน"),
]
for i, (icon, txt) in enumerate(solutions):
    y = Inches(2.0) + i * Inches(1.0)
    add_rect(sl, Inches(6.55), y, Inches(0.45), Inches(0.45),
             fill=RGBColor(0xDC, 0xFC, 0xE7), line=RGBColor(0x86, 0xEF, 0xAC))
    add_text(sl, icon, Inches(6.56), y, Inches(0.44), Inches(0.44),
             size=18, align=PP_ALIGN.CENTER)
    add_text(sl, txt, Inches(7.15), y + Inches(0.03), Inches(5.6), Inches(0.5),
             size=13, color=DARK)

# ══════════════════════════════════════════════════════════════════════════
# SLIDE 3 — สินค้า 3 ประเภท
# ══════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(BLANK)
add_rect(sl, 0, 0, W, H, fill=LIGHT)
slide_header(sl, "สินค้า 3 ประเภท", "Product Catalog")
footer(sl)

products = [
    {
        "icon": "⚡",
        "name": "เสาไฟฟ้าคอนกรีตอัดแรง",
        "en": "Prestressed Concrete Poles",
        "type": "Standard",
        "type_color": GREEN,
        "details": [
            "ความยาว 8–14 ม.",
            "ราคาคงที่ตาม กฟภ",
            "พร้อมส่งทันที",
            "ราคาเริ่มต้น 4,000 บาท/ต้น",
        ],
        "badge_bg": RGBColor(0xDC, 0xFC, 0xE7),
    },
    {
        "icon": "🏗",
        "name": "เสาเข็มคอนกรีตอัดแรง",
        "en": "Prestressed Concrete Piles",
        "type": "Pre-order",
        "type_color": AMBER,
        "details": [
            "หน้าตัด 0.22–0.40 ม.",
            "ความยาว 6–27 ม.",
            "ราคาต่อเมตร × ความยาว",
            "ผลิตตามสั่ง 7–14 วัน",
        ],
        "badge_bg": RGBColor(0xFE, 0xF3, 0xC7),
    },
    {
        "icon": "🧱",
        "name": "แผ่นพื้น Hollow Core",
        "en": "Hollow Core Slabs",
        "type": "Pre-order",
        "type_color": AMBER,
        "details": [
            "ความหนา 8–30 ซม.",
            "สั่งขั้นต่ำ 120 ตร.ม.",
            "ราคาต่อ ตร.ม. ตามความหนา",
            "ผลิตตามสั่ง 7–14 วัน",
        ],
        "badge_bg": RGBColor(0xFE, 0xF3, 0xC7),
    },
]

col_w = Inches(3.9)
gap   = Inches(0.2)
start_x = Inches(0.35)

for i, p in enumerate(products):
    x = start_x + i * (col_w + gap)
    card(sl, x, Inches(1.25), col_w, Inches(5.7), bg=WHITE)

    # icon circle
    add_rect(sl, x + Inches(0.2), Inches(1.45), Inches(0.7), Inches(0.7),
             fill=LIGHT, line=RGBColor(0xE2, 0xE8, 0xF0))
    add_text(sl, p["icon"], x + Inches(0.2), Inches(1.45),
             Inches(0.7), Inches(0.7), size=22, align=PP_ALIGN.CENTER)

    # type badge
    add_rect(sl, x + Inches(1.05), Inches(1.55), Inches(1.4), Inches(0.35),
             fill=p["badge_bg"])
    add_text(sl, p["type"], x + Inches(1.05), Inches(1.55),
             Inches(1.4), Inches(0.35), size=11, bold=True,
             color=p["type_color"], align=PP_ALIGN.CENTER)

    add_text(sl, p["name"], x + Inches(0.2), Inches(2.25),
             col_w - Inches(0.4), Inches(0.55),
             size=15, bold=True, color=NAVY)
    add_text(sl, p["en"], x + Inches(0.2), Inches(2.8),
             col_w - Inches(0.4), Inches(0.35),
             size=11, color=GRAY)

    # divider
    add_rect(sl, x + Inches(0.2), Inches(3.22), col_w - Inches(0.4),
             Inches(0.02), fill=RGBColor(0xE2, 0xE8, 0xF0))

    for j, detail in enumerate(p["details"]):
        dy = Inches(3.35) + j * Inches(0.5)
        add_text(sl, "·  " + detail,
                 x + Inches(0.25), dy, col_w - Inches(0.5), Inches(0.45),
                 size=12, color=DARK)

# ══════════════════════════════════════════════════════════════════════════
# SLIDE 4 — ลูกค้า 3 กลุ่ม
# ══════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(BLANK)
add_rect(sl, 0, 0, W, H, fill=LIGHT)
slide_header(sl, "กลุ่มลูกค้าเป้าหมาย", "3 Customer Segments")
footer(sl)

segments = [
    {
        "icon": "👤",
        "name": "ทั่วไป / บุคคล",
        "en": "General / Individual",
        "color": NAVY,
        "bg": RGBColor(0xE8, 0xED, 0xF8),
        "who": "บุคคล, ช่างก่อสร้าง, เจ้าของบ้าน",
        "needs": ["ดูสินค้า + ราคา", "ส่ง RFQ ง่ายๆ", "ติดตาม status ด้วย SMC code"],
        "fields": ["ชื่อ-นามสกุล", "เบอร์โทร", "อีเมล / Line ID"],
    },
    {
        "icon": "🏢",
        "name": "บริษัท / เอกชน",
        "en": "Private Company",
        "color": RGBColor(0x09, 0x50, 0x28),
        "bg": RGBColor(0xDC, 0xFC, 0xE7),
        "who": "บริษัทก่อสร้าง, ผู้รับเหมา, Developer",
        "needs": ["ใบเสนอราคาพร้อมภาษี", "เลข Tax ID สำหรับหักภาษี", "ออก PO + ติดตาม workflow"],
        "fields": ["ชื่อบริษัท", "เลขประจำตัวผู้เสียภาษี", "ที่อยู่ออกใบกำกับภาษี"],
    },
    {
        "icon": "🏛",
        "name": "ภาครัฐ",
        "en": "Government Agency",
        "color": RGBColor(0x78, 0x35, 0x00),
        "bg": RGBColor(0xFE, 0xF3, 0xC7),
        "who": "หน่วยงานราชการ, อปท., การไฟฟ้า",
        "needs": ["เลขที่หนังสือราชการ", "ใบเสนอราคาตามระเบียบ", "เอกสารครบสำหรับการจัดซื้อ"],
        "fields": ["ชื่อหน่วยงาน", "เลขประจำตัวผู้เสียภาษี", "เลขที่หนังสือราชการ"],
    },
]

for i, seg in enumerate(segments):
    x = Inches(0.25) + i * Inches(4.35)
    card(sl, x, Inches(1.25), Inches(4.15), Inches(5.7), bg=WHITE)

    add_rect(sl, x, Inches(1.25), Inches(4.15), Inches(0.7), fill=seg["bg"])
    add_text(sl, seg["icon"] + "  " + seg["name"],
             x + Inches(0.15), Inches(1.3), Inches(3.85), Inches(0.55),
             size=15, bold=True, color=seg["color"])

    add_text(sl, seg["en"], x + Inches(0.15), Inches(2.05),
             Inches(3.85), Inches(0.3), size=11, color=GRAY)
    add_text(sl, seg["who"], x + Inches(0.15), Inches(2.35),
             Inches(3.85), Inches(0.35), size=11, color=DARK)

    add_rect(sl, x + Inches(0.15), Inches(2.75), Inches(3.85),
             Inches(0.02), fill=RGBColor(0xE2, 0xE8, 0xF0))

    add_text(sl, "ความต้องการ", x + Inches(0.15), Inches(2.85),
             Inches(3.85), Inches(0.3), size=11, bold=True, color=NAVY)
    for j, need in enumerate(seg["needs"]):
        add_text(sl, "·  " + need,
                 x + Inches(0.2), Inches(3.2) + j * Inches(0.4),
                 Inches(3.75), Inches(0.4), size=11, color=DARK)

    add_text(sl, "ข้อมูลที่กรอก", x + Inches(0.15), Inches(4.45),
             Inches(3.85), Inches(0.3), size=11, bold=True, color=NAVY)
    for j, f in enumerate(seg["fields"]):
        add_rect(sl, x + Inches(0.2), Inches(4.8) + j * Inches(0.38),
                 Inches(3.6), Inches(0.32), fill=LIGHT,
                 line=RGBColor(0xCB, 0xD5, 0xE1))
        add_text(sl, f, x + Inches(0.35), Inches(4.82) + j * Inches(0.38),
                 Inches(3.4), Inches(0.3), size=11, color=DARK)

# ══════════════════════════════════════════════════════════════════════════
# SLIDE 5 — System Flow
# ══════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(BLANK)
add_rect(sl, 0, 0, W, H, fill=LIGHT)
slide_header(sl, "System Flow — End to End", "จาก RFQ ถึง จัดส่ง")
footer(sl)

# flow steps
steps = [
    ("1", "ลูกค้าดูสินค้า\n& เลือก spec", RGBColor(0xE8, 0xED, 0xF8), NAVY),
    ("2", "กรอกฟอร์ม RFQ\nตามประเภทลูกค้า", RGBColor(0xE8, 0xED, 0xF8), NAVY),
    ("3", "ได้รหัส SMC\nใช้ track สถานะ", RGBColor(0xFE, 0xF3, 0xC7), AMBER),
    ("4", "Admin สร้าง\nใบเสนอราคา (QT)", RGBColor(0xDC, 0xFC, 0xE7), GREEN),
    ("5", "ลูกค้าดู QT\n& ส่ง PO", RGBColor(0xFE, 0xF3, 0xC7), AMBER),
    ("6", "Admin บันทึก PO\n& เริ่มผลิต", RGBColor(0xDC, 0xFC, 0xE7), GREEN),
    ("7", "Kanban:\nผลิต → จัดส่ง", RGBColor(0xDC, 0xFC, 0xE7), GREEN),
]

box_w = Inches(1.6)
box_h = Inches(1.2)
y_box = Inches(2.4)
total_w = len(steps) * box_w + (len(steps) - 1) * Inches(0.28)
start = (W - total_w) / 2

for i, (num, txt, bg, col) in enumerate(steps):
    x = start + i * (box_w + Inches(0.28))
    card(sl, x, y_box, box_w, box_h, bg=bg,
         border=RGBColor(0xCB, 0xD5, 0xE1))
    add_text(sl, num, x, y_box - Inches(0.45), box_w, Inches(0.4),
             size=11, bold=True, color=col, align=PP_ALIGN.CENTER)
    # circle
    add_rect(sl, x + box_w/2 - Inches(0.18), y_box - Inches(0.3),
             Inches(0.36), Inches(0.36), fill=col)
    add_text(sl, txt, x + Inches(0.05), y_box + Inches(0.1),
             box_w - Inches(0.1), box_h - Inches(0.2),
             size=11, color=col, align=PP_ALIGN.CENTER)

    if i < len(steps) - 1:
        ax = x + box_w + Inches(0.04)
        add_text(sl, "→", ax, y_box + Inches(0.35),
                 Inches(0.2), Inches(0.5), size=18, bold=True, color=GRAY,
                 align=PP_ALIGN.CENTER)

# two actor rows
actor_data = [
    (Inches(0.4), "👤 ลูกค้า", NAVY,
     "ดูสินค้า / กรอก RFQ / track SMC / ดูใบเสนอ / ส่ง PO"),
    (Inches(1.2), "⚙ Admin (ทีมงาน)", GREEN,
     "รับ RFQ / สร้างใบเสนอ / บันทึก PO / อัพสถานะ Kanban"),
]
for ay, label, col, desc in actor_data:
    y = Inches(3.95) + ay
    add_rect(sl, Inches(0.25), y, Inches(12.8), Inches(0.75),
             fill=WHITE, line=RGBColor(0xE2, 0xE8, 0xF0))
    add_text(sl, label, Inches(0.35), y + Inches(0.1),
             Inches(2.2), Inches(0.55), size=13, bold=True, color=col)
    add_text(sl, desc, Inches(2.7), y + Inches(0.1),
             Inches(10.1), Inches(0.55), size=12, color=DARK)

# ── helper: render 4 stories in 2×2 grid ─────────────────────────────────
def render_stories_grid(sl, stories, badge_color):
    CARD_W  = Inches(6.3)
    CARD_H  = Inches(2.82)
    GAP_X   = Inches(0.13)
    START_X = Inches(0.3)
    START_Y = Inches(1.28)
    GAP_Y   = Inches(0.1)

    positions = [
        (START_X,              START_Y),
        (START_X + CARD_W + GAP_X, START_Y),
        (START_X,              START_Y + CARD_H + GAP_Y),
        (START_X + CARD_W + GAP_X, START_Y + CARD_H + GAP_Y),
    ]

    for i, (code, title, desc, sp, acs) in enumerate(stories):
        cx, cy = positions[i]
        card(sl, cx, cy, CARD_W, CARD_H, bg=WHITE)

        # top stripe
        add_rect(sl, cx, cy, CARD_W, Inches(0.48), fill=LIGHT,
                 line=RGBColor(0xE2, 0xE8, 0xF0))

        # code badge
        add_rect(sl, cx + Inches(0.15), cy + Inches(0.08),
                 Inches(0.72), Inches(0.33), fill=badge_color)
        add_text(sl, code,
                 cx + Inches(0.15), cy + Inches(0.08),
                 Inches(0.72), Inches(0.33),
                 size=12, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

        # title
        add_text(sl, title,
                 cx + Inches(1.0), cy + Inches(0.08),
                 Inches(4.2), Inches(0.38),
                 size=14, bold=True, color=NAVY)

        # SP badge (top-right)
        add_rect(sl, cx + CARD_W - Inches(1.05), cy + Inches(0.08),
                 Inches(0.9), Inches(0.33), fill=YELLOW)
        add_text(sl, sp,
                 cx + CARD_W - Inches(1.05), cy + Inches(0.08),
                 Inches(0.9), Inches(0.33),
                 size=13, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

        # story description
        add_text(sl, desc,
                 cx + Inches(0.18), cy + Inches(0.56),
                 CARD_W - Inches(0.36), Inches(0.62),
                 size=11, color=GRAY)

        # divider
        add_rect(sl, cx + Inches(0.18), cy + Inches(1.22),
                 CARD_W - Inches(0.36), Inches(0.02),
                 fill=RGBColor(0xE2, 0xE8, 0xF0))

        # AC header
        add_text(sl, "Acceptance Criteria:",
                 cx + Inches(0.18), cy + Inches(1.3),
                 CARD_W - Inches(0.36), Inches(0.32),
                 size=12, bold=True, color=NAVY)

        # AC items
        for j, ac in enumerate(acs):
            add_text(sl, "✓  " + ac,
                     cx + Inches(0.22), cy + Inches(1.65) + j * Inches(0.38),
                     CARD_W - Inches(0.44), Inches(0.36),
                     size=12, color=DARK)


# ══════════════════════════════════════════════════════════════════════════
# SLIDE 6 — Sprint 1
# ══════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(BLANK)
add_rect(sl, 0, 0, W, H, fill=LIGHT)
slide_header(sl, "Sprint 1 — Customer Flow & Basic Admin",
             "รวม 13 Story Points  ·  4 User Stories")
footer(sl)

stories_s1 = [
    ("US1", "ดูรายการสินค้า",
     "ในฐานะลูกค้า ฉันต้องการดูรายการสินค้าคอนกรีตอัดแรงพร้อมสเปคและราคา เพื่อเลือกสินค้าที่ต้องการก่อนส่งคำขอ",
     "3 SP",
     ["แสดงสินค้าครบ 3 ประเภท + badge preorder", "แสดง spec, ตารางราคา, ปุ่มขอใบเสนอ", "filter ตาม category / type"]),
    ("US2", "กรอกฟอร์ม RFQ",
     "ในฐานะลูกค้า ฉันต้องการกรอกแบบฟอร์มขอใบเสนอราคาออนไลน์ตามประเภทลูกค้า (ทั่วไป / เอกชน / ภาครัฐ) เพื่อให้ทีมงานรับทราบ",
     "5 SP",
     ["แบ่ง 3 tab ตามประเภทลูกค้า", "เพิ่มสินค้าหลายรายการได้", "Generate รหัส SMC-YYYYMMDD-XXXX"]),
    ("US3", "ติดตามสถานะ",
     "ในฐานะลูกค้า ฉันต้องการติดตามสถานะคำขอด้วยรหัส SMC เพื่อทราบว่าทีมงานดำเนินการถึงขั้นตอนใดแล้ว",
     "2 SP",
     ["กรอก SMC code เดียวติดตามได้ตลอด", "แสดง 3 stage: กำลังจัดทำ / รอ PO / มี PO", "แสดง 4-step timeline เมื่อมี PO"]),
    ("US4", "Admin Dashboard",
     "ในฐานะ Admin ฉันต้องการ login และดูรายการ RFQ พร้อม filter สถานะ เพื่อจัดการและติดตามคำขอของลูกค้า",
     "3 SP",
     ["Login ด้วย username/password + JWT", "ดูรายการ RFQ เรียงตามวันล่าสุด", "Filter: ทั้งหมด / ใหม่ / กำลังดำเนินการ / เสร็จ"]),
]
render_stories_grid(sl, stories_s1, NAVY)

# ══════════════════════════════════════════════════════════════════════════
# SLIDE 7 — Sprint 2
# ══════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(BLANK)
add_rect(sl, 0, 0, W, H, fill=LIGHT)
slide_header(sl, "Sprint 2 — Quotation & Order Management",
             "รวม 16 Story Points  ·  4 User Stories")
footer(sl)

stories_s2 = [
    ("US5", "สร้างใบเสนอราคา",
     "ในฐานะ Admin ฉันต้องการสร้างใบเสนอราคา กำหนดราคา และส่ง link พร้อมดาวน์โหลด PDF ได้",
     "5 SP",
     ["กรอกราคา → คำนวณ subtotal + VAT 7% + total", "Generate QT-YYYYMMDD-XXXX + link", "ดาวน์โหลด PDF ฟอนต์ภาษาไทย Sarabun"]),
    ("US6", "ลูกค้าดูใบเสนอราคา",
     "ในฐานะลูกค้า ฉันต้องการเปิดดูใบเสนอราคาผ่าน link และทราบว่าทีมงานได้รับ PO ของฉันแล้วหรือยัง",
     "3 SP",
     ["เปิด /quotation?ref=QT-... เห็นราคา VAT รวม", "สถานะ: รอรับ PO (เหลือง) / ได้รับ PO (เขียว)", "ดาวน์โหลด PDF + โทรหาทีมงาน"]),
    ("US7", "บันทึก PO",
     "ในฐานะ Admin ฉันต้องการบันทึกการรับ PO จากลูกค้าพร้อมแนบไฟล์ และระบบ generate รหัส PO อัตโนมัติ",
     "5 SP",
     ["กรอกเลข PO + แนบไฟล์ PDF/JPG/PNG", "Generate PO-YYYYMMDD-XXXX อัตโนมัติ", "Redirect ไปหน้า Kanban หลังบันทึก"]),
    ("US8", "Kanban Board",
     "ในฐานะ Admin ฉันต้องการดูและอัปเดตสถานะคำสั่งซื้อในรูปแบบ Kanban board เพื่อจัดการผลิต/จัดส่ง",
     "3 SP",
     ["4 column: ได้รับ PO / กำลังผลิต / กำลังจัดส่ง / จัดส่งแล้ว", "ย้าย card ระหว่าง column ได้", "Card แสดงชื่อลูกค้า มูลค่า วันที่รับ PO"]),
]
render_stories_grid(sl, stories_s2, RGBColor(0x06, 0x5F, 0x46))

# ══════════════════════════════════════════════════════════════════════════
# SLIDE 8 — Summary & Tech Stack
# ══════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(BLANK)
add_rect(sl, 0, 0, W, H, fill=LIGHT)
slide_header(sl, "Tech Stack & สรุป MVP", "Summary")
footer(sl)

# left: sprint summary
card(sl, Inches(0.25), Inches(1.25), Inches(5.5), Inches(5.7), bg=WHITE)
add_text(sl, "Sprint Summary", Inches(0.45), Inches(1.4),
         Inches(5.1), Inches(0.4), size=15, bold=True, color=NAVY)

# table fits inside card (0.25 → 5.75, inner padding 0.15 each side)
# usable: 0.40 → 5.60  (5.20 inches total)
# cols: Sprint(1.0) | Name(2.3) | US(0.9) | SP(0.9)  = 5.1 + gaps
rows = [
    ("Sprint 1", "Customer Flow & Basic Admin", "4 US", "13 SP"),
    ("Sprint 2", "Quotation & Order Management", "4 US", "16 SP"),
    ("รวม", "", "8 US", "29 SP"),
]
headers  = ["Sprint", "ชื่อ Sprint", "User Stories", "Story Points"]
col_xs   = [Inches(0.40), Inches(1.45), Inches(3.80), Inches(4.75)]
col_ws   = [Inches(1.00), Inches(2.30), Inches(0.90), Inches(0.90)]

add_rect(sl, Inches(0.35), Inches(1.9), Inches(5.35), Inches(0.42), fill=NAVY)
for hdr, cx, cw in zip(headers, col_xs, col_ws):
    add_text(sl, hdr, cx, Inches(1.9), cw, Inches(0.42),
             size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

for i, (s, name, us, sp) in enumerate(rows):
    y = Inches(2.36) + i * Inches(0.56)
    bg_row = LIGHT if i == 2 else WHITE
    add_rect(sl, Inches(0.35), y, Inches(5.35), Inches(0.53), fill=bg_row,
             line=RGBColor(0xE2, 0xE8, 0xF0))
    bold_row = (i == 2)
    for val, cx, cw in zip([s, name, us, sp], col_xs, col_ws):
        add_text(sl, val, cx, y + Inches(0.06), cw, Inches(0.44),
                 size=12 if bold_row else 12,
                 bold=bold_row,
                 color=NAVY if bold_row else DARK,
                 align=PP_ALIGN.CENTER)

# features done
add_text(sl, "Features ที่ implement แล้ว",
         Inches(0.45), Inches(4.1), Inches(5.1), Inches(0.35),
         size=12, bold=True, color=NAVY)
features = [
    "Product catalog + filter 3 ประเภท",
    "RFQ form 3 tab + SMC tracking",
    "Admin dashboard + Kanban board",
    "Quotation PDF ฟอนต์ภาษาไทย",
    "PO management + status workflow",
]
for i, f in enumerate(features):
    add_text(sl, "✅ " + f, Inches(0.45), Inches(4.5) + i * Inches(0.38),
             Inches(5.1), Inches(0.36), size=11, color=DARK)

# right: tech stack
card(sl, Inches(6.0), Inches(1.25), Inches(7.0), Inches(5.7), bg=WHITE)
add_text(sl, "Tech Stack", Inches(6.2), Inches(1.4),
         Inches(6.6), Inches(0.4), size=15, bold=True, color=NAVY)

techs = [
    ("Framework",  "Next.js 16.2.4  (App Router + Turbopack)"),
    ("Language",   "TypeScript"),
    ("Styling",    "Tailwind CSS 4"),
    ("ORM",        "Prisma 7"),
    ("Database",   "SQLite (dev) → PostgreSQL (prod)"),
    ("Auth",       "bcryptjs + JWT (httpOnly cookie)"),
    ("PDF",        "@react-pdf/renderer  ฟอนต์ Sarabun"),
    ("Email",      "Resend (Admin alert + Customer confirm)"),
    ("Deploy",     "Vercel"),
]
for i, (layer, tech) in enumerate(techs):
    y = Inches(1.95) + i * Inches(0.5)
    add_rect(sl, Inches(6.1), y, Inches(1.5), Inches(0.4),
             fill=LIGHT, line=RGBColor(0xCB, 0xD5, 0xE1))
    add_text(sl, layer, Inches(6.1), y, Inches(1.5), Inches(0.4),
             size=10, bold=True, color=NAVY, align=PP_ALIGN.CENTER)
    add_text(sl, tech, Inches(7.75), y + Inches(0.02),
             Inches(4.9), Inches(0.38), size=11, color=DARK)

# ══════════════════════════════════════════════════════════════════════════
prs.save(OUT)
print(f"Saved -> {OUT}")
