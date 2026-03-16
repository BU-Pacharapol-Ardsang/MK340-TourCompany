import BrandMark from "./BrandMark";

const pillars = [
  {
    title: "อบอุ่นและผ่อนคลาย",
    desc: "โทนการสื่อสารและการจัดทริปถูกออกแบบให้ลูกค้ารู้สึกสบาย ไม่เร่ง และไม่กดดัน",
  },
  {
    title: "น่าเชื่อถือและชัดเจน",
    desc: "ข้อมูลราคา สิ่งที่รวม และจังหวะการเดินทางถูกสรุปให้ดูง่ายตั้งแต่หน้าแรก",
  },
  {
    title: "เรียบง่ายแต่มีรสนิยม",
    desc: "เลือกเส้นทาง ที่พัก และ mood ของทริปให้ภาพรวมดูพรีเมียมแบบไม่ต้องแข็งเกินไป",
  },
  {
    title: "มีจินตนาการพอดี",
    desc: "เติมความละมุนด้วยสีลาเวนเดอร์และงานภาพที่ทำให้แบรนด์ดูมีเอกลักษณ์ขึ้น",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel rounded-[36px] p-7 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--earth-deep)]">
            Why Travie
          </span>
          <h2 className="mt-4 font-display text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
            ความอบอุ่น ความไว้วางใจ
            <br />
            และความละมุนในหน้าเดียว
          </h2>
          <p className="mt-5 text-base leading-8 text-[color:var(--muted)]">
            ภาพอ้างอิงที่คุณให้มาชัดเจนว่าอยากได้แบรนด์ที่ดู soft, organic
            และมีมิติ เราเลยแปลงแนวคิดนั้นเป็นภาษาหน้าเว็บที่ใช้ได้จริงกับการขายแพ็กเกจทัวร์
          </p>

          <div className="mt-8 rounded-[30px] bg-white/70 p-6">
            <BrandMark size="md" showWordmark />
            <ul className="mt-6 space-y-4 text-sm leading-7 text-[color:var(--muted)]">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--earth)]" />
                <span>ทำให้บริการดูเป็นกันเองขึ้น แต่ยังไม่หลุดจากความเป็นมืออาชีพ</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--lavender-deep)]" />
                <span>ลดความแข็งของเว็บทัวร์แบบโปรโมชัน ให้ภาพรวมดูร่วมสมัยและจดจำง่าย</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--earth-deep)]" />
                <span>เหมาะกับแบรนด์ที่อยากสื่อความละเอียด อ่อนโยน และพร้อมดูแลลูกค้าตลอดทริป</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className="soft-card rounded-[30px] p-6 sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-5xl leading-none text-[rgba(123,101,132,0.32)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-[rgba(255,255,255,0.72)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--earth-deep)]">
                  pillar
                </span>
              </div>
              <h3 className="mt-8 font-display text-3xl leading-tight text-[color:var(--foreground)]">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                {pillar.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
