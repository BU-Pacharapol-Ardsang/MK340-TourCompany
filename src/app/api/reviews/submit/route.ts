import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { requireDatabaseUrl, getBlobReadWriteToken } from "@/lib/env";

const sql = neon(requireDatabaseUrl());

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const tourId = formData.get("tourId") as string;
    const reviewCode = formData.get("reviewCode") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    // Validate inputs
    if (!tourId || !reviewCode || !name || !email || !rating) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    // Validate and mark review code as used
    const codeResult = await sql`
      SELECT id FROM review_codes
      WHERE code = ${reviewCode} AND tour_id = ${tourId} AND used = false
      LIMIT 1
    `;

    if (codeResult.length === 0) {
      return Response.json(
        { error: "Invalid or already used review code" },
        { status: 400 }
      );
    }

    const reviewCodeId = codeResult[0].id;

    // Handle image uploads
    const imageUrls: string[] = [];
    const files = formData.getAll("images");

    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const buffer = await file.arrayBuffer();
        const timestamp = Date.now();
        const filename = `${tourId}/${email}/${timestamp}-${file.name}`;

        const blob = await put(filename, buffer, {
          access: "public",
          token: getBlobReadWriteToken(),
        });

        imageUrls.push(blob.url);
      }
    }

    // Limit to 5 images
    const limitedImageUrls = imageUrls.slice(0, 5);

    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const insertResult = await sql`
      WITH updated_code AS (
        UPDATE review_codes
        SET used = true, used_by = ${email}, updated_at = NOW()
        WHERE id = ${reviewCodeId} AND used = false
        RETURNING id
      ), inserted_review AS (
        INSERT INTO reviews (
          id,
          tour_id,
          review_code_id,
          name,
          email,
          rating,
          comment,
          images
        )
        SELECT
          ${reviewId},
          ${tourId},
          updated_code.id,
          ${name},
          ${email},
          ${rating},
          ${comment || null},
          ${JSON.stringify(limitedImageUrls)}
        FROM updated_code
        RETURNING id
      )
      SELECT id FROM inserted_review
    `;

    if (insertResult.length === 0) {
      return Response.json(
        { error: "Invalid or already used review code" },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      reviewId,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return Response.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
