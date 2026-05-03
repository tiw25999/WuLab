import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "SICON — สยามมาสเตอส์คอนกรีต",
  description:
    "บริษัท สยามมาสเตอส์คอนกรีต จำกัด ผู้ผลิตและจำหน่ายแผ่นพื้น Hollow Core, เสาเข็มคอนกรีตอัดแรง และเสาไฟฟ้าคอนกรีตอัดแรง มาตรฐาน มอก.",
  keywords: "hollow core slab, เสาเข็ม, แผ่นพื้นสำเร็จรูป, เสาไฟฟ้า, คอนกรีตอัดแรง",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
