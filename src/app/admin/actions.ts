"use server";

import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getBlobReadWriteToken, requireDatabaseUrl } from "@/lib/env";
import { ensureToursSchema } from "@/lib/tours-schema";

const sql = neon(requireDatabaseUrl());

type TourType = "domestic" | "international";
type AdminRedirectStatus = "saved" | "deleted" | "error";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getRequiredString(formData: FormData, key: string, label: string) {
  const value = getString(formData, key);

  if (!value) {
    throw new Error(`Missing ${label}`);
  }

  return value;
}

function getPositiveInteger(
  formData: FormData,
  key: string,
  label: string,
  { allowZero = false }: { allowZero?: boolean } = {},
) {
  const raw = getRequiredString(formData, key, label);
  const value = Number(raw);

  if (!Number.isInteger(value) || (!allowZero && value <= 0) || (allowZero && value < 0)) {
    throw new Error(`${label} must be an integer${allowZero ? " >= 0" : " > 0"}`);
  }

  return value;
}

function parseOptionalInteger(formData: FormData, key: string) {
  const raw = getString(formData, key);

  if (!raw) {
    return null;
  }

  const value = Number(raw);

  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${key} must be an integer >= 0`);
  }

  return value;
}

function parseList(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseItinerary(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [dayPart, titlePart, ...detailParts] = line.split("|");
      const day = Number(dayPart?.trim());
      const title = titlePart?.trim() ?? "";
      const detail = detailParts.join("|").trim();

      if (!Number.isInteger(day) || day <= 0 || !title || !detail) {
        throw new Error("Each itinerary line must follow: day | title | detail");
      }

      return {
        day,
        title,
        detail,
      };
    })
    .sort((a, b) => a.day - b.day);
}

function normalizeTourType(value: string): TourType {
  if (value === "domestic" || value === "international") {
    return value;
  }

  throw new Error("type must be domestic or international");
}

function isBlobUrl(value: string) {
  return /^https:\/\/.+\.blob\.vercel-storage\.com\/.+/i.test(value);
}

function validateImageUrl(value: string) {
  if (!value) {
    return "";
  }

  if (value.startsWith("/") || isBlobUrl(value)) {
    return value;
  }

  throw new Error(
    "Image URL must be a local path or a Vercel Blob URL. Use file upload for new images.",
  );
}

function parseImageList(value: string) {
  return uniqueValues(parseList(value).map(validateImageUrl));
}

function sanitizeFileNameSegment(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

function uniqueValues<T>(values: T[]) {
  return Array.from(new Set(values));
}

async function uploadBlobFile(file: File, pathname: string) {
  const token = getBlobReadWriteToken();

  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for image upload");
  }

  const uploaded = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: file.type || undefined,
    token,
  });

  return uploaded.url;
}

async function maybeUploadImage(formData: FormData, id: string) {
  const fileEntry = formData.get("imageFile");

  if (!(fileEntry instanceof File) || fileEntry.size === 0) {
    return null;
  }

  const extension = path.extname(fileEntry.name) || ".bin";
  const safeId = sanitizeFileNameSegment(id) || `tour-${Date.now()}`;
  const pathname = `tours/admin/cover/${safeId}-${Date.now()}${extension.toLowerCase()}`;

  return uploadBlobFile(fileEntry, pathname);
}

async function maybeUploadGalleryImages(formData: FormData, id: string) {
  const entries = formData.getAll("galleryFiles");
  const safeId = sanitizeFileNameSegment(id) || `tour-${Date.now()}`;
  const uploads: string[] = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];

    if (!(entry instanceof File) || entry.size === 0) {
      continue;
    }

    const extension = path.extname(entry.name) || ".bin";
    const pathname = `tours/admin/gallery/${safeId}-${Date.now()}-${index}${extension.toLowerCase()}`;
    uploads.push(await uploadBlobFile(entry, pathname));
  }

  return uploads;
}

async function cleanupBlob(url: string) {
  if (!isBlobUrl(url)) {
    return;
  }

  const token = getBlobReadWriteToken();

  if (!token) {
    return;
  }

  try {
    await del(url, { token });
  } catch (error) {
    console.error("Failed to delete blob", error);
  }
}

async function cleanupBlobs(urls: string[]) {
  for (let index = 0; index < urls.length; index += 1) {
    await cleanupBlob(urls[index]);
  }
}

function revalidateTourPaths(id: string, originalId?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/tour/${id}`);

  if (originalId && originalId !== id) {
    revalidatePath(`/tour/${originalId}`);
  }
}

function buildAdminRedirectUrl(
  status: AdminRedirectStatus,
  options?: {
    id?: string;
    message?: string;
  },
) {
  const params = new URLSearchParams();
  params.set("status", status);

  if (options?.id) {
    params.set("id", options.id);
  }

  if (options?.message) {
    params.set("message", options.message);
  }

  return `/admin?${params.toString()}`;
}

async function getExistingTourId(id: string) {
  const rows = (await sql`
    SELECT id
    FROM tours
    WHERE id = ${id}
    LIMIT 1
  `) as { id: string }[];

  return rows[0]?.id ?? null;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    const candidate = error as { code?: string; constraint?: string };

    if (candidate.code === "23505") {
      if (candidate.constraint === "tours_pkey") {
        return "Slug / ID นี้ถูกใช้แล้ว กรุณาใช้ค่าใหม่";
      }

      return "ข้อมูลซ้ำกับรายการเดิมในฐานข้อมูล";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "บันทึกข้อมูลไม่สำเร็จ";
}

export async function saveTourAction(formData: FormData) {
  await ensureToursSchema();

  const originalId = getString(formData, "originalId");
  let currentImage = "";
  let currentGallery: string[] = [];
  let id = "";
  let uploadedImageUrl: string | null = null;
  let uploadedGalleryUrls: string[] = [];
  let successRedirectUrl = "";

  try {
    currentImage = validateImageUrl(getString(formData, "currentImage"));
    currentGallery = parseImageList(getString(formData, "currentGallery"));
    id = getRequiredString(formData, "id", "slug / id");
    const title = getRequiredString(formData, "title", "title");
    const destination = getRequiredString(formData, "destination", "destination");
    const country = getRequiredString(formData, "country", "country");
    const type = normalizeTourType(getRequiredString(formData, "type", "type"));
    const days = getPositiveInteger(formData, "days", "days");
    const nights = getPositiveInteger(formData, "nights", "nights", {
      allowZero: true,
    });
    const price = getPositiveInteger(formData, "price", "price");
    const originalPrice = parseOptionalInteger(formData, "originalPrice");
    const tag = getString(formData, "tag") || null;
    const description = getRequiredString(formData, "description", "description");
    const highlights = parseList(getString(formData, "highlights"));
    const includes = parseList(getString(formData, "includes"));
    const itinerary = parseItinerary(getString(formData, "itinerary"));
    const imageUrl = validateImageUrl(getString(formData, "imageUrl"));
    const galleryUrls = parseImageList(getString(formData, "galleryUrls"));

    uploadedImageUrl = await maybeUploadImage(formData, id);
    uploadedGalleryUrls = await maybeUploadGalleryImages(formData, id);

    const image = uploadedImageUrl || imageUrl || currentImage;
    const gallery = uniqueValues([...galleryUrls, ...uploadedGalleryUrls]);

    if (!image) {
      throw new Error("Image is required. Provide a Blob upload or an existing path.");
    }

    if (nights > days) {
      throw new Error("nights cannot be greater than days");
    }

    if (originalPrice !== null && originalPrice < price) {
      throw new Error("originalPrice should be greater than or equal to price");
    }

    const existingId = await getExistingTourId(id);

    if (!originalId && existingId) {
      throw new Error("Slug / ID นี้ถูกใช้แล้ว กรุณาใช้ค่าใหม่");
    }

    if (originalId && id !== originalId && existingId) {
      throw new Error("Slug / ID ใหม่ซ้ำกับรายการเดิม");
    }

    if (originalId) {
      await sql`
        UPDATE tours
        SET
          id = ${id},
          title = ${title},
          destination = ${destination},
          country = ${country},
          type = ${type},
          days = ${days},
          nights = ${nights},
          price = ${price},
          original_price = ${originalPrice},
          image = ${image},
          gallery = ${JSON.stringify(gallery)},
          highlights = ${JSON.stringify(highlights)},
          description = ${description},
          includes = ${JSON.stringify(includes)},
          itinerary = ${JSON.stringify(itinerary)},
          tag = ${tag},
          updated_at = NOW()
        WHERE id = ${originalId}
      `;
    } else {
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
          ${id},
          ${title},
          ${destination},
          ${country},
          ${type},
          ${days},
          ${nights},
          ${price},
          ${originalPrice},
          ${image},
          ${JSON.stringify(gallery)},
          ${JSON.stringify(highlights)},
          ${description},
          ${JSON.stringify(includes)},
          ${JSON.stringify(itinerary)},
          ${tag},
          COALESCE((SELECT MAX(sort_order) + 1 FROM tours), 0),
          NOW()
        )
      `;
    }

    if (uploadedImageUrl && currentImage && currentImage !== uploadedImageUrl) {
      await cleanupBlob(currentImage);
    }

    const removedGallery = currentGallery.filter(
      (url) => !gallery.includes(url) && url !== image,
    );

    await cleanupBlobs(removedGallery);

    revalidateTourPaths(id, originalId || undefined);
    successRedirectUrl = buildAdminRedirectUrl("saved", { id });
  } catch (error) {
    const uploadedUrls = [
      ...(uploadedImageUrl ? [uploadedImageUrl] : []),
      ...uploadedGalleryUrls,
    ];

    await cleanupBlobs(uploadedUrls);

    redirect(
      buildAdminRedirectUrl("error", {
        id: id || originalId || undefined,
        message: getErrorMessage(error),
      }),
    );
  }

  redirect(successRedirectUrl);
}

export async function deleteTourAction(formData: FormData) {
  await ensureToursSchema();

  const id = getRequiredString(formData, "id", "id");
  const image = validateImageUrl(getString(formData, "image"));
  const gallery = parseImageList(getString(formData, "gallery"));

  await sql`
    DELETE FROM tours
    WHERE id = ${id}
  `;

  await cleanupBlobs(uniqueValues([image, ...gallery].filter(Boolean)));

  revalidateTourPaths(id);
  redirect(buildAdminRedirectUrl("deleted", { id }));
}
