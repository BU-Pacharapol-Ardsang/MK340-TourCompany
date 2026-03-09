import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tours } from "@/data/tours";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function formatPrice(n: number) {
  return n.toLocaleString("th-TH");
}

export function generateStaticParams() {
  return tours.map((t) => ({ id: t.id }));
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = tours.find((t) => t.id === id);
  if (!tour) notFound();

  return (
    <>
      <Navbar />

      {/* Hero banner */}
      <section className="relative h-[50vh] min-h-[350px]">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto">
          <Link
            href="/#packages"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            ← กลับไปหน้าแพ็กเกจ
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {tour.tag && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {tour.tag}
              </span>
            )}
            <span className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
              {tour.type === "international" ? "🌏 ต่างประเทศ" : "🇹🇭 ในประเทศ"}
            </span>
            <span className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
              {tour.days} วัน {tour.nights} คืน
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            {tour.title}
          </h1>
          <p className="text-white/70 mt-2 flex items-center gap-2">
            <span>📍</span> {tour.destination} · {tour.country}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left – Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                เกี่ยวกับทริปนี้
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ไฮไลท์
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl"
                  >
                    <span className="text-blue-500 text-lg mt-0.5">✓</span>
                    <span className="text-gray-700 font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                โปรแกรมการเดินทาง
              </h2>
              <div className="space-y-0">
                {tour.itinerary.map((item, index) => (
                  <div key={item.day} className="flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {item.day}
                      </div>
                      {index < tour.itinerary.length - 1 && (
                        <div className="w-0.5 flex-1 bg-blue-200 my-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-8">
                      <h3 className="font-bold text-gray-900 text-lg">
                        วันที่ {item.day}: {item.title}
                      </h3>
                      <p className="text-gray-500 mt-1">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right – Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg space-y-6">
              {/* Price */}
              <div>
                {tour.originalPrice && (
                  <span className="text-gray-400 line-through text-lg">
                    ฿{formatPrice(tour.originalPrice)}
                  </span>
                )}
                <div className="text-4xl font-extrabold text-blue-700">
                  ฿{formatPrice(tour.price)}
                </div>
                <span className="text-gray-400 text-sm">ต่อท่าน</span>
              </div>

              {/* Includes */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">รวมในแพ็กเกจ</h3>
                <ul className="space-y-2">
                  {tour.includes.map((inc) => (
                    <li
                      key={inc}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl text-center transition-all hover:scale-[1.02]"
                >
                  💬 สนใจ แอดไลน์เลย
                </a>
                <a
                  href="tel:0812345678"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-center transition-all hover:scale-[1.02]"
                >
                  📞 โทรจอง 081-234-5678
                </a>
              </div>

              <p className="text-xs text-gray-400 text-center">
                ✅ ปรึกษาฟรี ไม่มีค่าใช้จ่าย
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
