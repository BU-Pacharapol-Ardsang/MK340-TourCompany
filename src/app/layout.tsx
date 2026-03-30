import type { Metadata } from "next";
import { Kanit, Prompt } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin", "thai"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const prompt = Prompt({
  subsets: ["latin", "thai"],
  variable: "--font-display-source",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Travie Tour | ทริปโทนฟ้า สดใส เลือกง่าย เดินทางสบาย",
  description:
    "แพ็กเกจทัวร์ในประเทศและต่างประเทศที่คัดเส้นทางให้ภาพลักษณ์สดใส อ่านง่าย ราคาโปร่งใส และพร้อมทีมดูแลตลอดทริป",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo/travie-logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo/travie-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${kanit.variable} ${prompt.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
