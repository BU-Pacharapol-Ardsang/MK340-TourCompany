import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Travie Tours — ทัวร์ต่างประเทศ & ในประเทศ",
  description:
    "แพ็กเกจทัวร์คุณภาพ ราคาโปร่งใส ทั้งทัวร์ต่างประเทศและในประเทศ พร้อมทีมดูแลตลอดการเดินทาง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
