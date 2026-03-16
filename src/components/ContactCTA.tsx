export default function ContactCTA() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="glass-panel mx-auto max-w-6xl overflow-hidden rounded-[38px] p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--earth-deep)]">
              Contact Studio
            </span>
            <h2 className="mt-4 font-display text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
              พร้อมวางแผนทริปที่จังหวะพอดีกับลูกค้าแล้วหรือยัง
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
              คุยกับทีมได้เลยถ้าต้องการปรับโปรแกรม เลือกช่วงงบ
              หรือหาทริปที่ภาพรวมดูนุ่มนวลและขายง่ายขึ้น เราช่วยวางโทนให้ตั้งแต่หน้าเว็บจนถึงหน้าแพ็กเกจได้
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
              <span className="rounded-full bg-white/70 px-4 py-2">
                ใบอนุญาตนำเที่ยว
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2">
                ปรึกษาฟรี
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2">
                ปรับแพ็กเกจได้
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[30px] bg-[rgba(123,101,132,0.94)] px-6 py-6 text-white transition-all hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                LINE
              </p>
              <p className="mt-2 font-display text-3xl leading-none">
                แอดไลน์สอบถาม
              </p>
              <p className="mt-3 text-sm text-white/80">
                คุยรายละเอียดทริป โปรโมชั่น และช่วงวันเดินทางได้ทันที
              </p>
            </a>

            <a
              href="tel:0812345678"
              className="soft-card rounded-[30px] px-6 py-6 transition-all hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--earth-deep)]">
                Phone
              </p>
              <p className="mt-2 font-display text-3xl leading-none text-[color:var(--foreground)]">
                081-234-5678
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                สำหรับลูกค้าที่ต้องการคุยรายละเอียดแบบรวดเร็วหรือจองทริปทันที
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
