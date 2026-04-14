import "server-only";

import { neon } from "@neondatabase/serverless";
import { getDatabaseUrl } from "./env";

const databaseUrl = getDatabaseUrl();
const sql = databaseUrl ? neon(databaseUrl) : null;

let schemaPromise: Promise<void> | null = null;

export function getToursSql() {
  return sql;
}

export async function ensureToursSchema() {
  if (!sql) {
    return null;
  }

  if (!schemaPromise) {
    schemaPromise = (async () => {
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

      await sql`
        CREATE TABLE IF NOT EXISTS review_codes (
          id TEXT PRIMARY KEY,
          code TEXT NOT NULL UNIQUE,
          tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
          used BOOLEAN NOT NULL DEFAULT FALSE,
          used_by TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_review_codes_tour_id ON review_codes(tour_id)
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_review_codes_code ON review_codes(code)
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS reviews (
          id TEXT PRIMARY KEY,
          tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
          review_code_id TEXT NOT NULL REFERENCES review_codes(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          images JSONB NOT NULL DEFAULT '[]'::jsonb,
          visible BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_reviews_tour_id ON reviews(tour_id)
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_reviews_review_code_id ON reviews(review_code_id)
      `;
    })();
  }

  await schemaPromise;
  return sql;
}
