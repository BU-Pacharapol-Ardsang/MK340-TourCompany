import { neon } from "@neondatabase/serverless";
import { requireDatabaseUrl } from "@/lib/env";

const sql = neon(requireDatabaseUrl());

export async function GET(
  _req: Request,
  { params }: { params: { tourId: string } },
) {
  try {
    const { tourId } = params;

    const rows = await sql`
      SELECT
        rc.code,
        rc.used,
        rc.used_by,
        rc.created_at,
        r.rating AS review_rating,
        r.comment AS review_comment,
        r.images AS review_images,
        r.name AS reviewer_name,
        r.email AS reviewer_email,
        r.created_at AS reviewed_at
      FROM review_codes rc
      LEFT JOIN reviews r ON r.review_code_id = rc.id
      WHERE rc.tour_id = ${tourId}
      ORDER BY rc.created_at DESC
      LIMIT 200
    `;

    const normalizedCodes = rows.map((item) => ({
      code: item.code,
      used: Boolean(item.used),
      used_by: item.used_by ?? null,
      created_at: item.created_at,
      review: item.review_rating
        ? {
            rating: Number(item.review_rating),
            comment: item.review_comment ?? null,
            images: Array.isArray(item.review_images) ? item.review_images : [],
            name: item.reviewer_name ?? null,
            email: item.reviewer_email ?? null,
            created_at: item.reviewed_at ?? null,
          }
        : null,
    }));

    return Response.json({
      codes: normalizedCodes,
      total: normalizedCodes.length,
      unusedCount: normalizedCodes.filter((item) => !item.used).length,
      usedCount: normalizedCodes.filter((item) => item.used).length,
    });
  } catch (error) {
    console.error("Error fetching review codes:", error);
    return Response.json({ error: "Failed to fetch review codes" }, { status: 500 });
  }
}
