import path from "path";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

const fontsDir = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: "Sarabun",
  fonts: [
    { src: path.join(fontsDir, "Sarabun-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "Sarabun-Bold.ttf"), fontWeight: 700 },
  ],
});

const navy = "#1a2f6e";
const yellow = "#f5c200";
const gray = "#5a6480";
const lightGray = "#f0f2f8";

const s = StyleSheet.create({
  page: { fontFamily: "Sarabun", fontSize: 10, color: "#1a2440", padding: "32px 40px" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  companyBlock: { flex: 1, paddingRight: 16 },
  companyName: { fontSize: 16, fontWeight: 700, color: navy, marginBottom: 3 },
  companySubtitle: { fontSize: 9, color: yellow, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 },
  companyAddress: { fontSize: 8, color: gray, lineHeight: 1.6 },
  quoteBlock: { alignItems: "flex-end" },
  quoteTitle: { fontSize: 20, fontWeight: 700, color: navy, marginBottom: 4 },
  quoteCode: { fontSize: 11, color: gray, fontFamily: "Sarabun", marginBottom: 2 },
  quoteDate: { fontSize: 9, color: gray },
  divider: { height: 2, backgroundColor: navy, marginBottom: 16, marginTop: 8 },
  yellowLine: { height: 3, backgroundColor: yellow, width: 40, marginTop: 4 },
  sectionTitle: { fontSize: 10, fontWeight: 700, color: navy, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  customerBox: { backgroundColor: lightGray, padding: "10px 14px", borderRadius: 4, marginBottom: 20 },
  customerRow: { flexDirection: "row", marginBottom: 4 },
  customerLabel: { width: 80, color: gray, fontSize: 9 },
  customerValue: { flex: 1, fontWeight: 700 },
  tableHeader: { flexDirection: "row", backgroundColor: navy, padding: "6px 10px", borderRadius: "4px 4px 0 0" },
  tableRow: { flexDirection: "row", padding: "7px 10px", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tableRowAlt: { flexDirection: "row", padding: "7px 10px", backgroundColor: lightGray, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  colProduct: { flex: 3, color: "white", fontSize: 9, fontWeight: 700 },
  colSpec: { flex: 3, color: "white", fontSize: 9, fontWeight: 700 },
  colQty: { flex: 1.6, color: "white", fontSize: 9, fontWeight: 700, textAlign: "center" },
  colPrice: { flex: 1.5, color: "white", fontSize: 9, fontWeight: 700, textAlign: "right" },
  colTotal: { flex: 1.5, color: "white", fontSize: 9, fontWeight: 700, textAlign: "right" },
  colProductVal: { flex: 3, fontSize: 9 },
  colSpecVal: { flex: 3, fontSize: 9, color: gray },
  colQtyVal: { flex: 1.6, fontSize: 9, textAlign: "center", paddingHorizontal: 4 },
  colPriceVal: { flex: 1.5, fontSize: 9, textAlign: "right" },
  colTotalVal: { flex: 1.5, fontSize: 9, textAlign: "right", fontWeight: 700 },
  summaryBox: { alignItems: "flex-end", marginTop: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 4, width: 240 },
  summaryLabel: { flex: 1, fontSize: 10, color: gray, textAlign: "right", paddingRight: 16 },
  summaryValue: { width: 90, fontSize: 10, textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 6, width: 240, backgroundColor: navy, padding: "7px 10px", borderRadius: 4 },
  totalLabel: { flex: 1, fontSize: 12, fontWeight: 700, color: "white", textAlign: "right", paddingRight: 16 },
  totalValue: { width: 90, fontSize: 12, fontWeight: 700, color: yellow, textAlign: "right" },
  notesBox: { marginTop: 20, padding: "10px 14px", borderLeftWidth: 3, borderLeftColor: yellow, backgroundColor: lightGray },
  notesText: { fontSize: 9, color: gray, lineHeight: 1.6 },
  footer: { position: "absolute", bottom: 28, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 8 },
  footerText: { fontSize: 8, color: gray },
  validNote: { marginTop: 20, fontSize: 9, color: gray },
});

function fmt(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface QuotationItem {
  productName: string;
  spec?: string;
  quantity: string;
  unit: string;
  unitPrice: number;
  total: number;
}

interface QuotationData {
  quoteCode: string;
  createdAt: string | Date;
  validDays: number;
  notes?: string | null;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  items: QuotationItem[];
  inquiry: {
    name: string;
    phone: string;
    company?: string | null;
    email?: string | null;
    taxId?: string | null;
    address?: string | null;
    govRef?: string | null;
    customerType: string;
  };
}

export function QuotationPDF({ data }: { data: QuotationData }) {
  const issueDate = new Date(data.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
  const validDate = new Date(new Date(data.createdAt).getTime() + data.validDays * 86400000)
    .toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.companyBlock}>
            <Text style={s.companyName}>บริษัท สยามมาสเตอส์คอนกรีต จำกัด</Text>
            <Text style={s.companySubtitle}>SICON · ก่อตั้ง พ.ศ. 2537</Text>
            <Text style={s.companyAddress}>222 หมู่ที่ 5 ตำบลนาสาร อำเภอพระพรหม{"\n"}จังหวัดนครศรีธรรมราช 80000{"\n"}โทร: 075-330-777-9  |  075-846-048</Text>
            <View style={s.yellowLine} />
          </View>
          <View style={s.quoteBlock}>
            <Text style={s.quoteTitle}>ใบเสนอราคา</Text>
            <Text style={s.quoteCode}>{data.quoteCode}</Text>
            <Text style={s.quoteDate}>วันที่: {issueDate}</Text>
            <Text style={s.quoteDate}>ใช้ได้ถึง: {validDate}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Customer */}
        <Text style={s.sectionTitle}>ข้อมูลลูกค้า</Text>
        <View style={s.customerBox}>
          <View style={s.customerRow}>
            <Text style={s.customerLabel}>ชื่อ</Text>
            <Text style={s.customerValue}>{data.inquiry.name}</Text>
          </View>
          {data.inquiry.company && (
            <View style={s.customerRow}>
              <Text style={s.customerLabel}>บริษัท/หน่วยงาน</Text>
              <Text style={s.customerValue}>{data.inquiry.company}</Text>
            </View>
          )}
          <View style={s.customerRow}>
            <Text style={s.customerLabel}>โทรศัพท์</Text>
            <Text style={s.customerValue}>{data.inquiry.phone}</Text>
          </View>
          {data.inquiry.email && (
            <View style={s.customerRow}>
              <Text style={s.customerLabel}>อีเมล</Text>
              <Text style={s.customerValue}>{data.inquiry.email}</Text>
            </View>
          )}
          {data.inquiry.taxId && (
            <View style={s.customerRow}>
              <Text style={s.customerLabel}>เลขผู้เสียภาษี</Text>
              <Text style={s.customerValue}>{data.inquiry.taxId}</Text>
            </View>
          )}
          {data.inquiry.address && (
            <View style={s.customerRow}>
              <Text style={s.customerLabel}>ที่อยู่</Text>
              <Text style={s.customerValue}>{data.inquiry.address}</Text>
            </View>
          )}
          {data.inquiry.govRef && (
            <View style={s.customerRow}>
              <Text style={s.customerLabel}>เลขที่หนังสือ</Text>
              <Text style={s.customerValue}>{data.inquiry.govRef}</Text>
            </View>
          )}
        </View>

        {/* Items table */}
        <Text style={s.sectionTitle}>รายการสินค้า</Text>
        <View style={s.tableHeader}>
          <Text style={s.colProduct}>สินค้า</Text>
          <Text style={s.colSpec}>สเปค</Text>
          <Text style={s.colQty}>จำนวน</Text>
          <Text style={s.colPrice}>ราคา/หน่วย</Text>
          <Text style={s.colTotal}>รวม</Text>
        </View>
        {data.items.map((item, i) => (
          <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
            <Text style={s.colProductVal}>{item.productName}</Text>
            <Text style={s.colSpecVal}>{item.spec ?? "-"}</Text>
            <Text style={s.colQtyVal}>{item.quantity} {item.unit}</Text>
            <Text style={s.colPriceVal}>{fmt(item.unitPrice)}</Text>
            <Text style={s.colTotalVal}>{fmt(item.total)}</Text>
          </View>
        ))}

        {/* Summary */}
        <View style={s.summaryBox}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>ราคาก่อนภาษี</Text>
            <Text style={s.summaryValue}>{fmt(data.subtotal)} บาท</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>ภาษีมูลค่าเพิ่ม {data.vatRate}%</Text>
            <Text style={s.summaryValue}>{fmt(data.vatAmount)} บาท</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>ยอดรวมทั้งสิ้น</Text>
            <Text style={s.totalValue}>{fmt(data.total)} บาท</Text>
          </View>
        </View>

        {/* Valid note */}
        <Text style={s.validNote}>* ใบเสนอราคานี้มีอายุ {data.validDays} วัน นับจากวันที่ออกเอกสาร</Text>

        {/* Notes */}
        {data.notes && (
          <View style={s.notesBox}>
            <Text style={[s.sectionTitle, { marginBottom: 4 }]}>หมายเหตุ</Text>
            <Text style={s.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>บริษัท สยามมาสเตอส์คอนกรีต จำกัด  |  siammasters@gmail.com</Text>
          <Text style={s.footerText}>{data.quoteCode}</Text>
        </View>
      </Page>
    </Document>
  );
}
