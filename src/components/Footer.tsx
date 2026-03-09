import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-white tracking-tight">
                MK340 <span className="font-light">Tours</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              บริษัททัวร์ครบวงจร จัดทริปทั้งในและต่างประเทศ
              ดูแลทุกรายละเอียด ให้คุณเที่ยวแบบไร้กังวล
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">ลิงก์ด่วน</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#packages" className="hover:text-white transition-colors">
                  แพ็กเกจทัวร์
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  ทำไมต้องเรา
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  ติดต่อ
                </a>
              </li>
            </ul>
          </div>

          {/* Tour types */}
          <div>
            <h4 className="text-white font-semibold mb-4">ประเภททัวร์</h4>
            <ul className="space-y-2 text-sm">
              <li>ทัวร์ญี่ปุ่น</li>
              <li>ทัวร์เกาหลี</li>
              <li>ทัวร์ยุโรป</li>
              <li>ทัวร์ในประเทศ</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm">
              <li>📞 081-234-5678</li>
              <li>📧 info@mk340tours.com</li>
              <li>📍 กรุงเทพมหานคร</li>
              <li>🕗 จันทร์-เสาร์ 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          © 2026 MK340 Tours. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
