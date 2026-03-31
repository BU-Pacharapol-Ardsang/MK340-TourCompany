import BrandMark from "./BrandMark";

const pillars = [
  {
    title: "เลือกง่าย สบายตา",
    desc: "แยกประเภททริปไทยและต่างประเทศชัดเจน ช่วยให้ลูกค้าไล่ดูแพ็กเกจที่สนใจได้เร็วขึ้น",
  },
  {
    title: "ราคาและรายละเอียดชัด",
    desc: "ดูงบ ระยะเวลา และไฮไลต์หลักได้ตั้งแต่หน้าแรก ช่วยลดความลังเลก่อนทักมาสอบถาม",
  },
  {
    title: "มีหลายสไตล์ให้เทียบ",
    desc: "จะสายธรรมชาติ เมือง คาเฟ่ หรือทริปครอบครัว ก็มีแพ็กเกจให้เปรียบเทียบในหน้าเดียว",
  },
  {
    title: "มีทีมช่วยวางแผนต่อ",
    desc: "ถ้ายังไม่แน่ใจเรื่องวันเดินทาง งบ หรือปลายทาง ทีมงานช่วยแนะนำและปรับแพ็กเกจได้",
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
            เลือกทัวร์ง่าย ข้อมูลชัด
            <br />
            และคุยกับทีมได้จริง
          </h2>
          <p className="mt-5 text-base leading-8 text-[color:var(--muted)]">
            เรารวบรวมแพ็กเกจที่ลูกค้าตัดสินใจได้จริงไว้ในหน้าเดียว
            โดยเน้นข้อมูลที่ต้องใช้ก่อนจอง เช่น จุดหมาย ไฮไลต์ ราคา
            ระยะเวลา และความคุ้มค่า เพื่อให้หาทริปที่เหมาะได้เร็วขึ้น
          </p>

          <div className="mt-8 rounded-[30px] bg-white/70 p-6">
            <BrandMark size="md" showWordmark />
            <ul className="mt-6 space-y-4 text-sm leading-7 text-[color:var(--muted)]">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--earth)]" />
                <span>รวมแพ็กเกจยอดนิยมทั้งในประเทศและต่างประเทศไว้ให้เลือกต่อได้ทันที</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--lavender-deep)]" />
                <span>ดูราคาเริ่มต้น จำนวนวัน และจุดเด่นของแต่ละทริปได้แบบไม่ต้องไล่ถามหลายรอบ</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--earth-deep)]" />
                <span>มีทีมช่วยแนะนำ ปรับงบ และเลือกช่วงวันเดินทางให้เหมาะกับแผนเที่ยวของลูกค้า</span>
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
                <span className="font-display text-5xl leading-none text-[rgba(29,95,191,0.24)]">
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
