interface SpecValue {
  [key: string]: string | number | object | object[];
}

const LABEL_MAP: Record<string, string> = {
  standard: "มาตรฐาน",
  width: "ความกว้าง",
  maxLength: "ความยาวสูงสุด",
  concreteGrade: "กำลังคอนกรีต",
  prestressType: "ระบบอัดแรง",
  unit: "หน่วย",
  pricingNote: "หมายเหตุราคา",
  priceStandard: "มาตรฐานราคา",
};

export default function ProductSpec({ specs }: { specs: SpecValue }) {
  const simpleEntries = Object.entries(specs).filter(
    ([, v]) => typeof v === "string" || typeof v === "number"
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <tbody>
          {simpleEntries.map(([key, value], i) => (
            <tr
              key={key}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td
                className="px-4 py-2.5 font-medium text-gray-600 w-2/5 border-r border-gray-100"
                style={{ fontFamily: "Sarabun, sans-serif" }}
              >
                {LABEL_MAP[key] ?? key}
              </td>
              <td
                className="px-4 py-2.5"
                style={{ fontFamily: "DM Mono, monospace", color: "#1a2f6e" }}
              >
                {String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
