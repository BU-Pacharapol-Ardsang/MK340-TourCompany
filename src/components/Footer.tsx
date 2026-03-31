import Link from "next/link";
import BrandMark from "./BrandMark";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--line)] px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.8fr]">
        <div>
          <Link href="/" className="inline-flex items-end gap-3">
            <BrandMark size="sm" showWordmark />
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-[color:var(--muted)]">
            รวมแพ็กเกจทัวร์ไทยและต่างประเทศที่เลือกง่าย
            ดูรายละเอียดชัด และมีทีมช่วยดูแลตั้งแต่เริ่มวางแผนจนถึงวันเดินทาง
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--earth-deep)]">
            Explore
          </h3>
          <div className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
            <a href="#packages" className="block transition hover:text-[color:var(--foreground)]">
              แพ็กเกจทัวร์
            </a>
            <a href="#why-us" className="block transition hover:text-[color:var(--foreground)]">
              เหตุผลที่เลือกเรา
            </a>
            <a href="#contact" className="block transition hover:text-[color:var(--foreground)]">
              ติดต่อทีมงาน
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--earth-deep)]">
            Destinations
          </h3>
          <div className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
            <p>ญี่ปุ่น</p>
            <p>เกาหลีใต้</p>
            <p>ยุโรป</p>
            <p>เชียงใหม่ / กระบี่</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--earth-deep)]">
            Contact
          </h3>
          <div className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
            <p>081-234-5678</p>
            <p>info@travietour.com</p>
            <p>กรุงเทพมหานคร</p>
            <p>จันทร์ - เสาร์ 09:00 - 18:00</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-[color:var(--line)] pt-6 text-sm text-[color:var(--muted)]">
        © 2026 Travie Tour. All rights reserved.
      </div>
    </footer>
  );
}
