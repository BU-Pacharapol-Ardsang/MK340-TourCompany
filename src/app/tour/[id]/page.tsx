import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandMark from "@/components/BrandMark";
import { MessageIcon, PhoneIcon } from "@/components/CtaIcons";
import TourGallery from "@/components/TourGallery";
import { getTourById } from "@/lib/tours";

export const revalidate = 300;

function formatPrice(value: number) {
  return value.toLocaleString("th-TH");
}

export default async function TourDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tour = await getTourById(params.id);

  if (!tour) {
    notFound();
  }

  const gallery = tour.gallery ?? [];

  return (
    <>
      <Navbar />

      <main className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          <section className="glass-panel overflow-hidden rounded-[40px] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
              <div className="relative min-h-[360px] overflow-hidden rounded-[32px]">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(12,48,94,0.44))]" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  {tour.tag && (
                    <span className="rounded-full bg-[color:var(--lavender-deep)] px-3 py-1 text-xs font-semibold text-white">
                      {tour.tag}
                    </span>
                  )}
                  <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-[color:var(--foreground)] backdrop-blur">
                    {tour.type === "international" ? "ต่างประเทศ" : "ในประเทศ"}
                  </span>
                  <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-[color:var(--foreground)] backdrop-blur">
                    {tour.days} วัน {tour.nights} คืน
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <Link
                  href="/#packages"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--earth-deep)] transition hover:text-[color:var(--foreground)]"
                >
                  <span aria-hidden="true">←</span>
                  กลับไปหน้าแพ็กเกจ
                </Link>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--earth-deep)]">
                  Curated Tour Detail
                </p>
                <h1 className="mt-3 font-display text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
                  {tour.title}
                </h1>
                <p className="mt-3 text-sm text-[color:var(--muted)] sm:text-base">
                  {tour.destination} • {tour.country}
                </p>

                <p className="mt-6 text-base leading-8 text-[color:var(--muted)]">
                  {tour.description}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[30px] border border-[rgba(11,143,216,0.18)] bg-[color:var(--price-accent-soft)] px-5 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--price-accent)]">
                      ราคาเริ่มต้น
                    </p>
                    {tour.originalPrice && (
                      <p className="mt-3 text-sm text-[color:var(--muted)] line-through">
                        ฿{formatPrice(tour.originalPrice)}
                      </p>
                    )}
                    <p className="font-display text-5xl leading-none text-[color:var(--price-accent)]">
                      ฿{formatPrice(tour.price)}
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--muted)]">ต่อท่าน</p>
                  </div>

                  <div className="rounded-[30px] border border-[rgba(74,150,255,0.24)] bg-[rgba(74,150,255,0.12)] px-5 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--lavender-deep)]">
                      พร้อมปรับได้
                    </p>
                    <p className="mt-3 font-display text-3xl leading-tight text-[color:var(--foreground)]">
                      ปรับช่วงวัน
                      <br />
                      หรือแพ็กเกจเพิ่มได้
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                      เหมาะกับการคุยต่อทั้งเรื่องงบ ที่พัก และกิจกรรมเสริมตามกลุ่มลูกค้า
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="https://line.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--lavender-deep)] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)]"
                  >
                    <MessageIcon className="h-4 w-4" />
                    ปรึกษาทริปนี้ทาง LINE
                  </a>
                  <a
                    href="tel:0812345678"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/70 px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] transition-all hover:-translate-y-0.5 hover:bg-white"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    โทร 081-234-5678
                  </a>
                </div>

                
              </div>
            </div>
          </section>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.38fr]">
            <div className="space-y-8">
              <section className="soft-card rounded-[34px] p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--earth-deep)]">
                  Highlights
                </p>
                <h2 className="mt-3 font-display text-4xl text-[color:var(--foreground)]">
                  ไฮไลต์ของทริป
                </h2>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {tour.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-[24px] border border-[color:var(--line)] bg-white/70 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--lavender-deep)]" />
                        <span className="text-sm leading-7 text-[color:var(--foreground)]">
                          {highlight}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {gallery.length > 0 && <TourGallery items={gallery} title={tour.title} />}

              <section className="soft-card rounded-[34px] p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--earth-deep)]">
                  Itinerary
                </p>
                <h2 className="mt-3 font-display text-4xl text-[color:var(--foreground)]">
                  โปรแกรมการเดินทาง
                </h2>

                <div className="mt-8 space-y-0">
                  {tour.itinerary.map((item, index) => (
                    <div key={item.day} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--lavender-deep)] text-sm font-semibold text-white">
                          {item.day}
                        </div>
                        {index < tour.itinerary.length - 1 && (
                          <div className="my-1 w-px flex-1 bg-[rgba(29,95,191,0.24)]" />
                        )}
                      </div>

                      <div className="pb-8">
                        <h3 className="font-display text-2xl leading-tight text-[color:var(--foreground)]">
                          วันที่ {item.day} • {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:pt-2">
              <div className="soft-card sticky top-28 rounded-[34px] p-6">
                <BrandMark size="sm" showWordmark />

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--earth-deep)]">
                    Included
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-[color:var(--foreground)]">
                    รวมในแพ็กเกจ
                  </h2>
                </div>

                <ul className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
                  {tour.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--earth)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 grid gap-3">
                  <a
                    href="https://line.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--lavender-deep)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)]"
                  >
                    <MessageIcon className="h-4 w-4" />
                    ขอราคาและวันเดินทาง
                  </a>
                  <a
                    href="tel:0812345678"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/70 px-5 py-3 text-center text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    โทรสอบถามทันที
                  </a>
                </div>

                <p className="mt-5 text-xs leading-6 text-[color:var(--muted)]">
                  ปรึกษาฟรี ไม่มีค่าใช้จ่ายเพิ่มเติมก่อนตัดสินใจจอง
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
