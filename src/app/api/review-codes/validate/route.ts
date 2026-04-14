import { neon } from "@neondatabase/serverless";
import { requireDatabaseUrl } from "@/lib/env";

const sql = neon(requireDatabaseUrl());

export async function POST(req: Request) {
  try {
    const { code, tourId } = await req.json();

    if (!code || !tourId) {
      return Response.json(
        { error: "Code and tourId are required" },
        { status: 400 }
      );
    }

    // Check if code exists and hasn't been used
    const result = await sql`
      SELECT id, used FROM review_codes
      WHERE code = ${code} AND tour_id = ${tourId}
      LIMIT 1
    `;

    if (result.length === 0) {
      return Response.json({ valid: false, message: "Review code not found" });
    }

    if (result[0].used) {
      return Response.json({
        valid: false,
        message: "This review code has already been used",
      });
    }

    return Response.json({ valid: true });
  } catch (error) {
    console.error("Error validating review code:", error);
    return Response.json(
      { error: "Failed to validate code" },
      { status: 500 }
    );
  }
}
