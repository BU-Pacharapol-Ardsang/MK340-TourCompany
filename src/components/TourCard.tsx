import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/data/tours";

function formatPrice(value: number) {
  return value.toLocaleString("th-TH");
}

function getTripPaceLabel(days: number) {
  if (days <= 4) return "สั้นกำลังดี";
  if (days >= 7) return "เที่ยวเต็มอิ่ม";
  return "จังหวะพอดี";
}

export default function TourCard({ tour }: { tour: Tour }) {
  const savings = tour.originalPrice ? tour.originalPrice - tour.price : 0;

  return (
    <article className="soft-card group flex h-full flex-col overflow-hidden rounded-[32px] p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_74px_-44px_rgba(21,74,136,0.48)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[26px]">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(12,48,94,0.46))]" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {tour.tag && (
            <span className="rounded-full bg-[color:var(--lavender-deep)] px-3 py-1 text-xs font-semibold text-white">
              {tour.tag}
            </span>
          )}
          <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-[color:var(--foreground)] backdrop-blur">
            {tour.type === "international" ? "ต่างประเทศ" : "ในประเทศ"}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 rounded-full bg-[rgba(8,31,61,0.58)] px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
          {tour.days} วัน {tour.nights} คืน
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <p className="text-sm text-[color:var(--earth-deep)]">
          {tour.destination} • {tour.country}
        </p>

        <h3 className="mt-2 line-clamp-2 font-display text-[1.8rem] leading-tight text-[color:var(--foreground)] transition-colors group-hover:text-[color:var(--lavender-deep)]">
          {tour.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[rgba(102,204,255,0.18)] px-3 py-1 text-xs font-semibold text-[color:var(--earth-deep)]">
            {getTripPaceLabel(tour.days)}
          </span>
          {savings > 0 ? (
            <span className="rounded-full bg-[color:var(--price-accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--price-accent)]">
              ประหยัด ฿{formatPrice(savings)}
            </span>
          ) : (
            <span className="rounded-full bg-[rgba(19,131,211,0.12)] px-3 py-1 text-xs font-semibold text-[color:var(--foreground)]">
              คัดแล้วว่าคุ้ม
            </span>
          )}
        </div>

        <ul className="mt-5 flex-1 space-y-2 text-sm leading-6 text-[color:var(--muted)]">
          {tour.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--lavender-deep)]" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-end justify-between border-t border-[color:var(--line)] pt-4">
          <div>
            {tour.originalPrice && (
              <p className="text-sm text-[color:var(--muted)] line-through">
                ฿{formatPrice(tour.originalPrice)}
              </p>
            )}
            <p className="font-display text-4xl leading-none text-[color:var(--price-accent)]">
              ฿{formatPrice(tour.price)}
            </p>
            <span className="text-xs text-[color:var(--muted)]">ต่อท่าน</span>
          </div>

          <Link
            href={`/tour/${tour.id}`}
            className="rounded-full bg-[color:var(--lavender-deep)] px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)]"
          >
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </article>
  );
}
