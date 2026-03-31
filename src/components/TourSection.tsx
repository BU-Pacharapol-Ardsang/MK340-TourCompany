"use client";

import { useDeferredValue, useState } from "react";
import type { Tour } from "@/data/tours";
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
  { key: "over30k", label: "฿30,000+" },
];

const durationTabs: { key: DurationFilter; label: string }[] = [
  { key: "all", label: "ทุกช่วงวัน" },
  { key: "short", label: "2 - 4 วัน" },
  { key: "medium", label: "5 - 6 วัน" },
  { key: "long", label: "7 วันขึ้นไป" },
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
  tone: "lavender" | "sand" | "earth" | "plum" = "sand",
) {
  const base =
    "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200";

  if (!active) {
    return `${base} border-[color:var(--line)] bg-white/65 text-[color:var(--muted)] hover:border-[rgba(57,110,176,0.28)] hover:bg-white hover:text-[color:var(--foreground)]`;
  }

  if (tone === "lavender") {
    return `${base} border-[color:var(--lavender-deep)] bg-[color:var(--lavender-deep)] text-white shadow-[0_20px_40px_-26px_rgba(29,95,191,0.68)]`;
  }

  if (tone === "earth") {
    return `${base} border-[color:var(--earth-deep)] bg-[color:var(--earth-deep)] text-white shadow-[0_20px_40px_-26px_rgba(19,131,211,0.64)]`;
  }

  if (tone === "plum") {
    return `${base} border-[rgba(17,64,128,0.96)] bg-[rgba(17,64,128,0.96)] text-white shadow-[0_20px_40px_-26px_rgba(17,64,128,0.7)]`;
  }

  return `${base} border-[color:var(--earth)] bg-[color:var(--earth)] text-white shadow-[0_20px_40px_-26px_rgba(102,204,255,0.72)]`;
}

export default function TourSection({ tours }: { tours: Tour[] }) {
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
    <section id="packages" className="relative px-6 py-24">
      <div className="pointer-events-none absolute left-0 top-28 h-72 w-72 rounded-full bg-[rgba(102,204,255,0.15)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-56 h-72 w-72 rounded-full bg-[rgba(74,150,255,0.18)] blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <div className="fade-up grid gap-6 lg:grid-cols-[1fr_0.52fr] lg:items-end">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--earth-deep)]">
              Curated Packages
            </span>
            <h2 className="mt-4 font-display text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
              แพ็กเกจทัวร์ที่เลือกได้ตามสไตล์คุณ
            </h2>
            <p className="mt-4 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
              กรองตามปลายทาง งบประมาณ และจำนวนวัน
              เพื่อหาแพ็กเกจที่ตรงใจได้เร็วขึ้น
              ไม่ว่าจะมองหาทริปสั้นในไทยหรือทริปต่างประเทศเต็มอิ่ม
            </p>
          </div>

          <div className="soft-card rounded-[30px] px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--earth-deep)]">
              เลือกง่ายในหน้าเดียว
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              เทียบประเทศ งบ และจำนวนวันได้ทันที
              เพื่อคัดทริปที่ตรงใจแล้วค่อยเปิดดูรายละเอียดต่อได้เร็วขึ้น
            </p>
          </div>
        </div>

        <div className="glass-panel relative mt-10 overflow-hidden rounded-[38px] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-8 top-0 h-44 w-44 rounded-full bg-[rgba(74,150,255,0.18)] blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-44 w-44 rounded-full bg-[rgba(102,204,255,0.16)] blur-3xl" />

          <div className="relative">
            <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--earth-deep)]">
                  Smart Filter
                </p>
                <h3 className="mt-3 font-display text-3xl leading-tight text-[color:var(--foreground)] sm:text-[2.4rem]">
                  เลือกทริปตามประเทศ ปลายทาง งบ และจำนวนวัน
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                  ลองพิมพ์ชื่อประเทศ เมือง หรือไฮไลต์อย่าง ซากุระ ทะเล ภูเขา
                  แล้วค่อยต่อด้วยตัวกรองย่อยเพื่อหาชุดแพ็กเกจที่ใช่ได้เร็วขึ้น
                </p>

                <label htmlFor="tour-search" className="sr-only">
                  ค้นหาแพ็กเกจ
                </label>
                <div className="relative mt-5">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[color:var(--earth-deep)]">
                    ⌕
                  </span>
                  <input
                    id="tour-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="ค้นหา ญี่ปุ่น, เชียงใหม่, ซากุระ, ทะเล..."
                    className="w-full rounded-[22px] border border-[color:var(--line)] bg-white/80 px-4 py-3.5 pl-12 text-sm text-[color:var(--foreground)] outline-none transition-all placeholder:text-[color:var(--muted)] focus:border-[color:var(--lavender-deep)] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                {[
                  {
                    label: "พบแพ็กเกจ",
                    value: filtered.length.toString(),
                    note: "รายการที่ตรงเงื่อนไข",
                  },
                  {
                    label: "ราคาเริ่มต้น",
                    value: filtered.length ? `฿${formatPrice(lowestPrice)}` : "-",
                    note: "สำหรับผลลัพธ์ปัจจุบัน",
                  },
                  {
                    label: "เฉลี่ยวันเดินทาง",
                    value: `${averageDays} วัน`,
                    note: "ช่วยประเมินจังหวะทริป",
                  },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={`rounded-[26px] border px-5 py-5 ${
                      index === 1
                        ? "border-[rgba(74,150,255,0.22)] bg-[rgba(74,150,255,0.12)]"
                        : "border-[color:var(--line)] bg-white/65"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--earth-deep)]">
                      {item.label}
                    </p>
                    <p className="mt-3 font-display text-4xl leading-none text-[color:var(--foreground)]">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--muted)]">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-[30px] border border-[color:var(--line)] bg-white/55 p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--foreground)]">
                      ประเภททริป
                    </p>
                    <p className="text-xs text-[color:var(--muted)]">
                      เลือกภาพรวมก่อน หรือแตะประเทศและปลายทางด้านล่างเพื่อให้ระบบสลับประเภทให้อัตโนมัติ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
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
                      className={getPillClass(typeFilter === tab.key, "lavender")}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div
                  className={`rounded-[30px] border p-5 transition-all ${
                    internationalActive
                      ? "border-[rgba(74,150,255,0.22)] bg-[rgba(74,150,255,0.12)]"
                      : "border-[color:var(--line)] bg-white/65"
                  }`}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[color:var(--foreground)]">
                      ต่างประเทศ
                    </p>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-[color:var(--muted)]">
                      แตะประเทศเพื่อโฟกัสรายการทันที
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
                      className={getPillClass(countryFilter === "all", "lavender")}
                    >
                      ทุกประเทศ
                    </button>
                    {internationalCountries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={getPillClass(
                          countryFilter === country,
                          "lavender",
                        )}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`rounded-[30px] border p-5 transition-all ${
                    domesticActive
                      ? "border-[rgba(102,204,255,0.26)] bg-[rgba(102,204,255,0.12)]"
                      : "border-[color:var(--line)] bg-white/65"
                  }`}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[color:var(--foreground)]">
                      ในประเทศ
                    </p>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-[color:var(--muted)]">
                      เลือกจังหวัดหรือปลายทางหลักของทริป
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
                      className={getPillClass(domesticFilter === "all", "earth")}
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
                          "earth",
                        )}
                      >
                        {destination}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.1fr_1.1fr_0.95fr]">
                <div className="rounded-[30px] border border-[color:var(--line)] bg-white/65 p-5">
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    งบประมาณ
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {budgetTabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setBudgetFilter(tab.key)}
                        className={getPillClass(budgetFilter === tab.key, "sand")}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-[color:var(--line)] bg-white/65 p-5">
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    ระยะเวลาทริป
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {durationTabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setDurationFilter(tab.key)}
                        className={getPillClass(durationFilter === tab.key, "earth")}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-[color:var(--line)] bg-white/65 p-5">
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    เรียงผลลัพธ์
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSortBy(option.key)}
                        className={getPillClass(sortBy === option.key, "plum")}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--earth-deep)]">
                    Active Filters
                  </span>
                  {activeFilters.map((filter) => (
                    <button
                      key={filter.label}
                      type="button"
                      onClick={filter.clear}
                      className="inline-flex items-center gap-2 rounded-full bg-[rgba(17,64,128,0.94)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[color:var(--lavender-deep)]"
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
                <p className="text-sm font-semibold text-[color:var(--foreground)]">
                  พบ {filtered.length} แพ็กเกจที่ตรงเงื่อนไข
                </p>
                <p className="text-sm text-[color:var(--muted)]">
                  ราคาเริ่มต้น ฿{formatPrice(lowestPrice)} ต่อท่าน • ระยะเวลาเฉลี่ย{" "}
                  {averageDays} วัน
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
          <div className="soft-card mt-10 rounded-[34px] px-6 py-16 text-center">
            <p className="font-display text-3xl text-[color:var(--foreground)]">
              ยังไม่พบแพ็กเกจที่ตรงเงื่อนไขนี้
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
              ลองลดตัวกรองบางตัว หรือค้นหาด้วยคำที่กว้างขึ้นอีกนิด
              เพื่อเปิดดูแพ็กเกจที่ใกล้เคียงก่อนค่อยไล่เลือกต่อ
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-6 inline-flex items-center rounded-full bg-[color:var(--lavender-deep)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)]"
            >
              กลับไปดูทุกแพ็กเกจ
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
