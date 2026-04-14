import { neon } from "@neondatabase/serverless";
import { requireDatabaseUrl } from "@/lib/env";

const sql = neon(requireDatabaseUrl());

function generateCode(): string {
  // Generate a readable 8-character code
  return Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
}

export async function POST(req: Request) {
  try {
    const { tourId, count } = await req.json();

    if (!tourId || !count || typeof count !== "number" || count < 1) {
      return Response.json(
        { error: "Invalid tourId or count" },
        { status: 400 }
      );
    }

    if (count > 100) {
      return Response.json(
        { error: "Cannot generate more than 100 codes at once" },
        { status: 400 }
      );
    }

    // Verify tour exists
    const tourCheck = await sql`
      SELECT id FROM tours WHERE id = ${tourId}
    `;

    if (tourCheck.length === 0) {
      return Response.json({ error: "Tour not found" }, { status: 404 });
    }

    // Generate codes
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = generateCode();
      const id = `code_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      await sql`
        INSERT INTO review_codes (id, code, tour_id)
        VALUES (${id}, ${code}, ${tourId})
      `;

      codes.push(code);
    }

    return Response.json({
      success: true,
      generatedCount: codes.length,
      codes,
    });
  } catch (error) {
    console.error("Error generating review codes:", error);
    return Response.json(
      { error: "Failed to generate codes" },
      { status: 500 }
    );
  }
}
