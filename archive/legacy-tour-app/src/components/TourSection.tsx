"use client";

import { useState } from "react";
import { tours } from "@/data/tours";
import TourCard from "./TourCard";

type Filter = "all" | "international" | "domestic";

export default function TourSection() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? tours : tours.filter((t) => t.type === filter);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "ทั้งหมด" },
    { key: "international", label: "🌏 ต่างประเทศ" },
    { key: "domestic", label: "🇹🇭 ในประเทศ" },
  ];

  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">
            Our Packages
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            แพ็กเกจทัวร์ยอดนิยม
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            เลือกทริปที่ใช่ — เห็นชัดทั้งจำนวนวัน จุดหมาย ไฮไลท์ และราคา กดจองได้ทันที
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                filter === tab.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
