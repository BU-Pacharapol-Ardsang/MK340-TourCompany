const DATABASE_URL_KEYS = [
  "STORAGE_URL",
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "NEON_DATABASE_URL",
  "NEON_URL",
] as const;

export function getDatabaseUrl() {
  for (const key of DATABASE_URL_KEYS) {
    const value = process.env[key];

    if (value) {
      return value;
    }
  }

  return null;
}

export function requireDatabaseUrl() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error(
      `Missing database connection string. Set one of: ${DATABASE_URL_KEYS.join(", ")}`,
    );
  }

  return databaseUrl;
}

export function getBlobReadWriteToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || undefined;
}
