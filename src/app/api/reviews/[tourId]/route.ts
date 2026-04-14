import { neon } from "@neondatabase/serverless";
import { requireDatabaseUrl } from "@/lib/env";

const sql = neon(requireDatabaseUrl());

export const revalidate = 60; // Cache for 60 seconds

export async function GET(
  req: Request,
  { params }: { params: { tourId: string } }
) {
  try {
    const { tourId } = params;

    // Get all visible reviews for the tour
    const result = await sql`
      SELECT 
        id,
        name,
        email,
        rating,
        comment,
        images,
        created_at
      FROM reviews
      WHERE tour_id = ${tourId} AND visible = true
      ORDER BY created_at DESC
    `;

    // Calculate average rating
    if (result.length === 0) {
      return Response.json({
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
      });
    }

    const averageRating =
      result.reduce((sum: number, review: any) => sum + review.rating, 0) /
      result.length;

    return Response.json({
      reviews: result,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: result.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
