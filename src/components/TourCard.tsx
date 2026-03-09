import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/data/tours";

function formatPrice(n: number) {
  return n.toLocaleString("th-TH");
}

function getTripPaceLabel(days: number) {
  if (days <= 4) return "ทริปสั้น";
  if (days >= 7) return "จัดเต็มหลายวัน";
  return "บาลานซ์กำลังดี";
}

export default function TourCard({ tour }: { tour: Tour }) {
  const savings = tour.originalPrice ? tour.originalPrice - tour.price : 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/10">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {tour.tag && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              {tour.tag}
            </span>
          )}
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
            {tour.type === "international" ? "ต่างประเทศ" : "ในประเทศ"}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 rounded-xl bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          {tour.days} วัน {tour.nights} คืน
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 text-sm font-medium text-blue-600">
          {tour.destination} · {tour.country}
        </div>

        <h3 className="mb-3 line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700">
          {tour.title}
        </h3>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {getTripPaceLabel(tour.days)}
          </span>
          {savings > 0 ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              ประหยัด ฿{formatPrice(savings)}
            </span>
          ) : (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              ราคาโปรไฟล์คุ้มค่า
            </span>
          )}
        </div>

        <ul className="flex-1 space-y-1 text-sm text-slate-500">
          {tour.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-400">✓</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            {tour.originalPrice && (
              <span className="mr-2 text-sm text-slate-400 line-through">
                ฿{formatPrice(tour.originalPrice)}
              </span>
            )}
            <div className="text-2xl font-extrabold text-blue-700">
              ฿{formatPrice(tour.price)}
            </div>
            <span className="text-xs text-slate-400">ต่อท่าน</span>
          </div>

          <Link
            href={`/tour/${tour.id}`}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-blue-700"
          >
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
}
