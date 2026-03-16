import { readFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { loadEnvConfig } from "@next/env";
import { head, put } from "@vercel/blob";
import { tours } from "../src/data/tours";
import { getBlobReadWriteToken, requireDatabaseUrl } from "../src/lib/env";

loadEnvConfig(process.cwd());

const sql = neon(requireDatabaseUrl());
const blobToken = getBlobReadWriteToken();

function getContentType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".svg") return "image/svg+xml";

  return "image/jpeg";
}

async function ensureBlobImage(imagePath: string, tourId: string) {
  if (/^https?:\/\//i.test(imagePath) || !blobToken) {
    return imagePath;
  }

  const localAssetPath = path.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
  const blobPath = `tours/${tourId}${path.extname(imagePath).toLowerCase()}`;

  try {
    const existingBlob = await head(blobPath, { token: blobToken });
    return existingBlob.url;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const name = error instanceof Error ? error.name : "";

    if (
      name !== "BlobNotFoundError" &&
      !message.toLowerCase().includes("not found") &&
      !message.toLowerCase().includes("does not exist")
    ) {
      throw error;
    }
  }

  const file = await readFile(localAssetPath);
  const uploadedBlob = await put(blobPath, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: getContentType(imagePath),
    token: blobToken,
  });

  return uploadedBlob.url;
}

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS tours (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      destination TEXT NOT NULL,
      country TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('domestic', 'international')),
      days INTEGER NOT NULL,
      nights INTEGER NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER,
      image TEXT NOT NULL,
      gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
      highlights JSONB NOT NULL,
      description TEXT NOT NULL,
      includes JSONB NOT NULL,
      itinerary JSONB NOT NULL,
      tag TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE tours
    ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb
  `;

  for (let index = 0; index < tours.length; index += 1) {
    const tour = tours[index];
    const image = await ensureBlobImage(tour.image, tour.id);

    await sql`
      INSERT INTO tours (
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
        tag,
        sort_order,
        updated_at
      )
      VALUES (
        ${tour.id},
        ${tour.title},
        ${tour.destination},
        ${tour.country},
        ${tour.type},
        ${tour.days},
        ${tour.nights},
        ${tour.price},
        ${tour.originalPrice ?? null},
        ${image},
        ${JSON.stringify(tour.gallery ?? [])},
        ${JSON.stringify(tour.highlights)},
        ${tour.description},
        ${JSON.stringify(tour.includes)},
        ${JSON.stringify(tour.itinerary)},
        ${tour.tag ?? null},
        ${index},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        destination = EXCLUDED.destination,
        country = EXCLUDED.country,
        type = EXCLUDED.type,
        days = EXCLUDED.days,
        nights = EXCLUDED.nights,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        image = EXCLUDED.image,
        gallery = EXCLUDED.gallery,
        highlights = EXCLUDED.highlights,
        description = EXCLUDED.description,
        includes = EXCLUDED.includes,
        itinerary = EXCLUDED.itinerary,
        tag = EXCLUDED.tag,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `;

    console.log(`Seeded ${tour.id}`);
  }

  if (!blobToken) {
    console.log("BLOB_READ_WRITE_TOKEN not found, kept local image paths.");
  }

  console.log(`Seed complete: ${tours.length} tours`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
