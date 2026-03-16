import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Travie Tour | ทริปโทนอุ่น เลือกง่าย เดินทางสบาย",
  description:
    "แพ็กเกจทัวร์ในประเทศและต่างประเทศที่คัดเส้นทางให้จังหวะการเดินทางสบายขึ้น พร้อมบริการอบอุ่น ราคาโปร่งใส และทีมดูแลตลอดทริป",
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
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
