import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/data/tours";

function formatPrice(n: number) {
  return n.toLocaleString("th-TH");
}

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay info */}
        <div className="absolute top-3 left-3 flex gap-2">
          {tour.tag && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {tour.tag}
            </span>
          )}
          <span className="bg-white/90 backdrop-blur text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
            {tour.type === "international" ? "🌏 ต่างประเทศ" : "🇹🇭 ในประเทศ"}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
          {tour.days} วัน {tour.nights} คืน
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Destination & Country */}
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-1">
          <span>📍</span>
          <span>
            {tour.destination} · {tour.country}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {tour.title}
        </h3>

        {/* Highlights */}
        <ul className="text-sm text-gray-500 space-y-1 mb-4 flex-1">
          {tour.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✓</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            {tour.originalPrice && (
              <span className="text-sm text-gray-400 line-through mr-2">
                ฿{formatPrice(tour.originalPrice)}
              </span>
            )}
            <div className="text-2xl font-extrabold text-blue-700">
              ฿{formatPrice(tour.price)}
            </div>
            <span className="text-xs text-gray-400">ต่อท่าน</span>
          </div>
          <Link
            href={`/tour/${tour.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
}
