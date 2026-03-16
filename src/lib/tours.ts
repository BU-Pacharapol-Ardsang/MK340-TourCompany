import "server-only";

import { cache } from "react";
import {
  tours as fallbackTours,
  type Tour,
  type TourGalleryItem,
} from "@/data/tours";
import { ensureToursSchema, getToursSql } from "./tours-schema";

type TourRow = {
  id: string;
  title: string;
  destination: string;
  country: string;
  type: Tour["type"];
  days: number;
  nights: number;
  price: number;
  original_price: number | null;
  image: string;
  gallery: unknown;
  highlights: unknown;
  description: string;
  includes: unknown;
  itinerary: unknown;
  tag: string | null;
};

function parseStringArray(value: unknown) {
  const parsed = parseJsonValue<unknown[]>(value, []);

  return parsed.filter((item): item is string => typeof item === "string");
}

function parseGallery(value: unknown): TourGalleryItem[] {
  const parsed = parseJsonValue<unknown[]>(value, []);
  const items: TourGalleryItem[] = [];

  for (const item of parsed) {
    if (typeof item === "string") {
      items.push({
        url: item,
        caption: "",
      });
      continue;
    }

    if (!item || typeof item !== "object") {
      continue;
    }

    const candidate = item as Record<string, unknown>;

    if (typeof candidate.url !== "string") {
      continue;
    }

    items.push({
      url: candidate.url,
      caption: typeof candidate.caption === "string" ? candidate.caption : "",
    });
  }

  return items;
}

function parseItinerary(value: unknown): Tour["itinerary"] {
  const parsed = parseJsonValue<unknown[]>(value, []);

  return parsed
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      const day = Number(candidate.day);
      const title = candidate.title;
      const detail = candidate.detail;

      if (!Number.isFinite(day) || typeof title !== "string" || typeof detail !== "string") {
        return null;
      }

      return {
        day,
        title,
        detail,
      };
    })
    .filter((item): item is Tour["itinerary"][number] => item !== null)
    .sort((a, b) => a.day - b.day);
}

function parseJsonValue<T>(value: unknown, fallback: T) {
  if (value == null) {
    return fallback;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
}

function normalizeTour(tour: Tour): Tour {
  return {
    ...tour,
    gallery: parseGallery(tour.gallery ?? []),
  };
}

function mapTourRow(row: TourRow): Tour {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    country: row.country,
    type: row.type,
    days: Number(row.days),
    nights: Number(row.nights),
    price: Number(row.price),
    originalPrice: row.original_price ?? undefined,
    image: row.image,
    gallery: parseGallery(row.gallery),
    highlights: parseStringArray(row.highlights),
    description: row.description,
    includes: parseStringArray(row.includes),
    itinerary: parseItinerary(row.itinerary),
    tag: row.tag ?? undefined,
  };
}

export const isDatabaseConfigured = Boolean(getToursSql());

export const getTours = cache(async () => {
  const sql = await ensureToursSchema();

  if (!sql) {
    return fallbackTours.map(normalizeTour);
  }

  const rows = (await sql`
    SELECT
      id,
      title,
      destination,
      country,
      type,
      days,
      nights,
      price,
      original_price,
      image,
      gallery,
      highlights,
      description,
      includes,
      itinerary,
      tag
    FROM tours
    ORDER BY sort_order ASC, id ASC
  `) as TourRow[];

  return rows.map(mapTourRow);
});

export const getTourById = cache(async (id: string) => {
  const sql = await ensureToursSchema();

  if (!sql) {
    const fallbackTour = fallbackTours.find((tour) => tour.id === id);
    return fallbackTour ? normalizeTour(fallbackTour) : undefined;
  }

  const rows = (await sql`
    SELECT
      id,
      title,
      destination,
      country,
      type,
      days,
      nights,
      price,
      original_price,
      image,
      gallery,
      highlights,
      description,
      includes,
      itinerary,
      tag
    FROM tours
    WHERE id = ${id}
    LIMIT 1
  `) as TourRow[];

  return rows[0] ? mapTourRow(rows[0]) : undefined;
});
