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
    })();
  }

  await schemaPromise;
  return sql;
}
