"use client";

import { useDeferredValue, useState } from "react";
import { tours, type Tour } from "@/data/tours";
import TourCard from "./TourCard";

type TypeFilter = "all" | Tour["type"];
type BudgetFilter = "all" | "under10k" | "10k-30k" | "over30k";
type DurationFilter = "all" | "short" | "medium" | "long";
type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "duration-asc"
  | "duration-desc";

const typeTabs: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "international", label: "ต่างประเทศ" },
  { key: "domestic", label: "ในประเทศ" },
];

const budgetTabs: { key: BudgetFilter; label: string }[] = [
  { key: "all", label: "ทุกงบ" },
  { key: "under10k", label: "ไม่เกิน ฿10,000" },
  { key: "10k-30k", label: "฿10,000 - ฿30,000" },
  { key: "over30k", label: "฿30,000 ขึ้นไป" },
];

const durationTabs: { key: DurationFilter; label: string }[] = [
  { key: "all", label: "ทุกช่วงวัน" },
  { key: "short", label: "ทริปสั้น 2-4 วัน" },
  { key: "medium", label: "ทริปกลาง 5-6 วัน" },
  { key: "long", label: "ทริปยาว 7 วัน+" },
];

const sortOptions: { key: SortOption; label: string }[] = [
  { key: "recommended", label: "แนะนำก่อน" },
  { key: "price-asc", label: "ราคาต่ำไปสูง" },
  { key: "price-desc", label: "ราคาสูงไปต่ำ" },
  { key: "duration-asc", label: "วันน้อยไปมาก" },
  { key: "duration-desc", label: "วันมากไปน้อย" },
];

function formatPrice(value: number) {
  return value.toLocaleString("th-TH");
}

function splitSegments(value: string) {
  return value
    .split(/[\u00B7,/]/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function getPrimaryDomesticDestination(tour: Tour) {
  return splitSegments(tour.destination)[0] ?? tour.destination;
}

function matchesBudget(tour: Tour, budgetFilter: BudgetFilter) {
  if (budgetFilter === "all") return true;
  if (budgetFilter === "under10k") return tour.price <= 10000;
  if (budgetFilter === "10k-30k") {
    return tour.price > 10000 && tour.price <= 30000;
  }
  return tour.price > 30000;
}

function matchesDuration(tour: Tour, durationFilter: DurationFilter) {
  if (durationFilter === "all") return true;
  if (durationFilter === "short") return tour.days <= 4;
  if (durationFilter === "medium") return tour.days >= 5 && tour.days <= 6;
  return tour.days >= 7;
}

function sortTours(list: Tour[], sortBy: SortOption) {
  if (sortBy === "recommended") return list;

  return [...list].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "duration-asc") return a.days - b.days || a.price - b.price;
    return b.days - a.days || a.price - b.price;
  });
}

function getPillClass(
  active: boolean,
  tone: "slate" | "blue" | "emerald" | "amber" = "slate",
) {
  const base =
    "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200";

  if (!active) {
    return `${base} border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm`;
  }

  if (tone === "blue") {
    return `${base} border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20`;
  }

  if (tone === "emerald") {
    return `${base} border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20`;
  }

  if (tone === "amber") {
    return `${base} border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20`;
  }

  return `${base} border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10`;
}

export default function TourSection() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>("all");
  const [durationFilter, setDurationFilter] =
    useState<DurationFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [domesticFilter, setDomesticFilter] = useState("all");

  const deferredSearch = useDeferredValue(searchQuery.trim().toLowerCase());

  const internationalCountries = Array.from(
    new Set(
      tours
        .filter((tour) => tour.type === "international")
        .flatMap((tour) => splitSegments(tour.country)),
    ),
  ).sort((a, b) => a.localeCompare(b, "th"));

  const domesticDestinations = Array.from(
    new Set(
      tours
        .filter((tour) => tour.type === "domestic")
        .map((tour) => getPrimaryDomesticDestination(tour)),
    ),
  ).sort((a, b) => a.localeCompare(b, "th"));

  const filtered = sortTours(
    tours.filter((tour) => {
      const searchableText = [
        tour.title,
        tour.destination,
        tour.country,
        ...tour.highlights,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        deferredSearch.length === 0 || searchableText.includes(deferredSearch);
      const matchesType = typeFilter === "all" || tour.type === typeFilter;
      const matchesCountry =
        countryFilter === "all" ||
        (tour.type === "international" &&
          splitSegments(tour.country).includes(countryFilter));
      const matchesDomestic =
        domesticFilter === "all" ||
        (tour.type === "domestic" &&
          splitSegments(tour.destination).includes(domesticFilter));

      return (
        matchesSearch &&
        matchesType &&
        matchesCountry &&
        matchesDomestic &&
        matchesBudget(tour, budgetFilter) &&
        matchesDuration(tour, durationFilter)
      );
    }),
    sortBy,
  );

  const averageDays = filtered.length
    ? (filtered.reduce((total, tour) => total + tour.days, 0) / filtered.length)
        .toFixed(1)
        .replace(".0", "")
    : "0";
  const lowestPrice = filtered.length
    ? Math.min(...filtered.map((tour) => tour.price))
    : 0;

  const activeFilters = [
    searchQuery.trim()
      ? {
          label: `ค้นหา: ${searchQuery.trim()}`,
          clear: () => setSearchQuery(""),
        }
      : null,
    typeFilter !== "all"
      ? {
          label: `ประเภท: ${
            typeFilter === "international" ? "ต่างประเทศ" : "ในประเทศ"
          }`,
          clear: () => setTypeFilter("all"),
        }
      : null,
    countryFilter !== "all"
      ? {
          label: `ประเทศ: ${countryFilter}`,
          clear: () => setCountryFilter("all"),
        }
      : null,
    domesticFilter !== "all"
      ? {
          label: `ปลายทางในไทย: ${domesticFilter}`,
          clear: () => setDomesticFilter("all"),
        }
      : null,
    budgetFilter !== "all"
      ? {
          label: `งบ: ${
            budgetTabs.find((tab) => tab.key === budgetFilter)?.label ?? ""
          }`,
          clear: () => setBudgetFilter("all"),
        }
      : null,
    durationFilter !== "all"
      ? {
          label: `ช่วงวัน: ${
            durationTabs.find((tab) => tab.key === durationFilter)?.label ?? ""
          }`,
          clear: () => setDurationFilter("all"),
        }
      : null,
    sortBy !== "recommended"
      ? {
          label: `เรียง: ${
            sortOptions.find((option) => option.key === sortBy)?.label ?? ""
          }`,
          clear: () => setSortBy("recommended"),
        }
      : null,
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const clearAllFilters = () => {
    setTypeFilter("all");
    setBudgetFilter("all");
    setDurationFilter("all");
    setSortBy("recommended");
    setSearchQuery("");
    setCountryFilter("all");
    setDomesticFilter("all");
  };

  const handleTypeChange = (nextType: TypeFilter) => {
    setTypeFilter(nextType);
    if (nextType === "international") {
      setDomesticFilter("all");
    }
    if (nextType === "domestic") {
      setCountryFilter("all");
    }
  };

  const handleCountrySelect = (country: string) => {
    setTypeFilter("international");
    setDomesticFilter("all");
    setCountryFilter((current) => (current === country ? "all" : country));
  };

  const handleDomesticSelect = (destination: string) => {
    setTypeFilter("domestic");
    setCountryFilter("all");
    setDomesticFilter((current) =>
      current === destination ? "all" : destination,
    );
  };

  const internationalActive =
    typeFilter === "international" || countryFilter !== "all";
  const domesticActive = typeFilter === "domestic" || domesticFilter !== "all";

  return (
    <section id="packages" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Our Packages
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            แพ็กเกจทัวร์ยอดนิยม
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            เลือกทริปได้ละเอียดขึ้น ทั้งประเภท ประเทศ งบประมาณ และช่วงวัน
            เพื่อให้เจอแพ็กเกจที่เหมาะกับลูกค้าได้เร็วกว่าเดิม
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_22px_70px_-36px_rgba(37,99,235,0.35)] sm:p-8">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-blue-100/80 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Smart Filter
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  เลือกได้ตั้งแต่ประเทศ ไปจนถึงช่วงราคาและจำนวนวัน
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  ลองพิมพ์ชื่อประเทศ เมือง หรือไฮไลต์อย่าง ซากุระ ทะเล
                  หรือฮาลองเบย์ แล้วค่อยเจาะต่อด้วยตัวกรองย่อย
                </p>

                <label htmlFor="tour-search" className="sr-only">
                  ค้นหาแพ็กเกจ
                </label>
                <div className="relative mt-5">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                    ⌕
                  </span>
                  <input
                    id="tour-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="ค้นหา ญี่ปุ่น, กระบี่, ซากุระ, ฮาลองเบย์..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pl-12 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
                <div className="rounded-2xl bg-slate-900 px-4 py-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                    พบแพ็กเกจ
                  </p>
                  <p className="mt-2 text-3xl font-extrabold">{filtered.length}</p>
                  <p className="mt-1 text-xs text-white/65">รายการที่ตรงเงื่อนไข</p>
                </div>
                <div className="rounded-2xl bg-blue-50 px-4 py-4 text-slate-900 ring-1 ring-blue-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                    ราคาเริ่ม
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-blue-700">
                    {filtered.length ? `฿${formatPrice(lowestPrice)}` : "-"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">สำหรับชุดผลลัพธ์ปัจจุบัน</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-slate-50/90 p-4 ring-1 ring-slate-200">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      ประเภททริป
                    </p>
                    <p className="text-xs text-slate-500">
                      เลือกภาพรวมก่อน หรือแตะประเทศ/ปลายทางด้านล่างเพื่อสลับประเภทอัตโนมัติ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {typeTabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => handleTypeChange(tab.key)}
                      className={getPillClass(typeFilter === tab.key, "blue")}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-3xl border p-4 transition-all ${
                  internationalActive
                    ? "border-blue-200 bg-blue-50/70 shadow-sm"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    ต่างประเทศ
                  </p>
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                    แตะประเทศเพื่อโฟกัสแพ็กเกจเฉพาะประเทศนั้น
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCountryFilter("all");
                      if (typeFilter === "international") {
                        setTypeFilter("all");
                      }
                    }}
                    className={getPillClass(countryFilter === "all", "blue")}
                  >
                    ทุกประเทศ
                  </button>
                  {internationalCountries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={getPillClass(countryFilter === country, "blue")}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-3xl border p-4 transition-all ${
                  domesticActive
                    ? "border-emerald-200 bg-emerald-50/70 shadow-sm"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">ในประเทศ</p>
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                    เลือกปลายทางหลักของทริปในไทยได้ทันที
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDomesticFilter("all");
                      if (typeFilter === "domestic") {
                        setTypeFilter("all");
                      }
                    }}
                    className={getPillClass(domesticFilter === "all", "emerald")}
                  >
                    ทุกทริปในไทย
                  </button>
                  {domesticDestinations.map((destination) => (
                    <button
                      key={destination}
                      type="button"
                      onClick={() => handleDomesticSelect(destination)}
                      className={getPillClass(
                        domesticFilter === destination,
                        "emerald",
                      )}
                    >
                      {destination}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.2fr,1.2fr,1fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    งบประมาณ
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {budgetTabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setBudgetFilter(tab.key)}
                        className={getPillClass(
                          budgetFilter === tab.key,
                          "emerald",
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    ระยะเวลาทริป
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {durationTabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setDurationFilter(tab.key)}
                        className={getPillClass(
                          durationFilter === tab.key,
                          "amber",
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    เรียงลำดับผลลัพธ์
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSortBy(option.key)}
                        className={getPillClass(sortBy === option.key)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    กำลังกรอง
                  </span>
                  {activeFilters.map((filter) => (
                    <button
                      key={filter.label}
                      type="button"
                      onClick={filter.clear}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
                    >
                      {filter.label}
                      <span className="text-white/70">×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  พบ {filtered.length} แพ็กเกจที่ตรงเงื่อนไข
                </p>
                <p className="text-sm text-slate-500">
                  ราคาเริ่มต้น ฿{formatPrice(lowestPrice)} ต่อท่าน ·
                  ระยะเวลาเฉลี่ย {averageDays} วัน
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-slate-900">
              ยังไม่พบแพ็กเกจที่ตรงกับเงื่อนไขนี้
            </p>
            <p className="mt-2 text-sm text-slate-500">
              ลองล้างตัวกรองบางตัว หรือค้นหาด้วยคำที่กว้างขึ้นอีกนิด
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-6 inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              กลับไปดูทุกแพ็กเกจ
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
