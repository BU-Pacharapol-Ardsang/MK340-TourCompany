import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 pb-8 pt-16 text-gray-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/25">
                TT
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Travie <span className="font-light">Tours</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              เว็บไซต์ทัวร์ครบวงจรสำหรับลูกค้าที่มองหาทริปทั้งในประเทศและต่างประเทศ
              พร้อมข้อมูลชัดเจน ราคาโปร่งใส และทีมงานคอยดูแลตลอดการเดินทาง
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">ลิงก์ด่วน</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#packages" className="transition-colors hover:text-white">
                  แพ็กเกจทัวร์
                </a>
              </li>
              <li>
                <a href="#why-us" className="transition-colors hover:text-white">
                  ทำไมต้องเรา
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-white">
                  ติดต่อ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">ประเภททัวร์</h4>
            <ul className="space-y-2 text-sm">
              <li>ทัวร์ญี่ปุ่น</li>
              <li>ทัวร์เกาหลี</li>
              <li>ทัวร์ยุโรป</li>
              <li>ทัวร์ในประเทศ</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm">
              <li>โทร 081-234-5678</li>
              <li>อีเมล info@travietours.com</li>
              <li>กรุงเทพมหานคร</li>
              <li>จันทร์-เสาร์ 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          © 2026 Travie Tours. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
