import BrandMark from "./BrandMark";

const heroVideoUrl =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim() ||
  "https://rxldxotfic8tqsrr.public.blob.vercel-storage.com/page-header/mainpage-header.mp4";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-32 sm:pb-24 sm:pt-36">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/vietnam-halong-bay.webp"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,28,26,0.72)_0%,rgba(73,54,57,0.48)_38%,rgba(246,240,233,0.16)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,173,220,0.32),transparent_26%),radial-gradient(circle_at_left_center,rgba(228,212,191,0.28),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.34fr]">
        <div className="glass-panel max-w-3xl rounded-[38px] p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-4">
            <BrandMark size="sm" showWordmark />
            <span className="rounded-full border border-[color:var(--line)] bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--earth-deep)]">
              ไม่ใช้เว็บขายทัวร์จริงๆ เป็นแค่โปรเจกต์ของสถานศึกษาเท่านั้น
            </span>
          </div>

          <h1 className="mt-8 font-display text-5xl leading-[0.95] tracking-[-0.04em] text-[color:var(--foreground)] sm:text-6xl lg:text-[5.2rem]">
            Travel
            <span className="ml-3 font-script text-[color:var(--lavender-deep)]">
              ที่นุ่มนวล
            </span>
            <br />
            เรียบง่าย และน่าจดจำ
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            ภาพลักษณ์ของแบรนด์ถูกแปลงเป็นหน้าเว็บที่ดูอบอุ่น พรีเมียม และสบายตา
            พร้อมยังคงฟังก์ชันการขายทัวร์และการเลือกแพ็กเกจให้ใช้งานได้จริง
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#packages"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--lavender-deep)] px-8 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)]"
            >
              ดูแพ็กเกจทั้งหมด
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-white/60 px-8 py-4 text-sm font-semibold text-[color:var(--foreground)] transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              ปรึกษาทริปฟรี
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { value: "500+", label: "ทริปที่จัดแล้ว" },
              { value: "4.9/5", label: "คะแนนรีวิวเฉลี่ย" },
              { value: "15 นาที", label: "เวลาตอบกลับโดยเฉลี่ย" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[26px] border border-[color:var(--line)] bg-white/58 px-5 py-5"
              >
                <p className="font-display text-3xl text-[color:var(--foreground)]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden self-end lg:block">
          <div className="rounded-[34px] border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/80">
              Brand Philosophy
            </p>
            <p className="mt-3 font-display text-4xl leading-tight text-white">
              Travel softly
              <br />
              remember deeply
              
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
