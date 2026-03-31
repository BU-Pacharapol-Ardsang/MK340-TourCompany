import BrandMark from "./BrandMark";
import { ArrowRightIcon, MessageIcon } from "./CtaIcons";

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

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,29,61,0.74)_0%,rgba(18,67,123,0.48)_38%,rgba(234,246,255,0.14)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(117,172,255,0.34),transparent_26%),radial-gradient(circle_at_left_center,rgba(125,214,255,0.28),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.34fr]">
        <div className="glass-panel relative isolate max-w-3xl overflow-hidden rounded-[38px] p-7 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(248,252,255,0.84)_42%,rgba(233,242,252,0.72)_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(157,191,255,0.16),transparent_30%)] backdrop-blur-[22px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[1px] rounded-[37px] border border-white/35"
          />

          <div className="relative z-10 flex flex-wrap items-center gap-4">
            <BrandMark size="sm" showWordmark />
            <span className="rounded-full border border-[color:var(--line)] bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--earth-deep)] shadow-[0_10px_24px_-20px_rgba(8,29,61,0.28)]">
              ไม่ใช้เว็บขายทัวร์จริงๆ เป็นแค่โปรเจกต์ของสถานศึกษาเท่านั้น
            </span>
          </div>

          <h1 className="relative z-10 mt-8 font-display text-5xl leading-[0.95] tracking-[-0.04em] text-[color:var(--foreground)] sm:text-6xl lg:text-[5.2rem]">
            ทัวร์
            <span className="ml-3 font-script text-[color:var(--lavender-deep)]">
              ที่ใช่
            </span>
            <br />
            เลือกง่าย และน่าจดจำ
          </h1>

          <p className="relative z-10 mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            รวมแพ็กเกจทัวร์ในประเทศและต่างประเทศที่คัดทั้งปลายทาง ไฮไลต์
            ระยะเวลา และงบประมาณมาให้เลือกได้ง่าย
            พร้อมทีมช่วยแนะนำทริปที่เหมาะกับสไตล์การเที่ยวของคุณ
          </p>

          <div className="relative z-10 mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#packages"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--lavender-deep)] px-8 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)]"
            >
              <ArrowRightIcon className="order-last h-4 w-4" />
              ดูแพ็กเกจทั้งหมด
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/60 px-8 py-4 text-sm font-semibold text-[color:var(--foreground)] transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              <MessageIcon className="h-4 w-4" />
              ปรึกษาทริปฟรี
            </a>
          </div>

          <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { value: "500+", label: "ทริปที่จัดแล้ว" },
              { value: "4.9/5", label: "คะแนนรีวิวเฉลี่ย" },
              { value: "15 นาที", label: "เวลาตอบกลับโดยเฉลี่ย" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[26px] border border-[color:var(--line)] bg-white/66 px-5 py-5 shadow-[0_24px_48px_-36px_rgba(8,29,61,0.34)]"
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
              Popular Routes
            </p>
            <p className="mt-3 font-display text-4xl leading-tight text-white">
              ญี่ปุ่น เกาหลี
              <br />
              เวียดนาม กระบี่
            </p>
            <p className="mt-4 text-sm leading-7 text-white/80">
              เริ่มเลือกได้ทั้งทริปสั้นในไทยและทริปต่างประเทศเต็มอิ่ม
              ตามงบและจำนวนวันที่ต้องการ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
