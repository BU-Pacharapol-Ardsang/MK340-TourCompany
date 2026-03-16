import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/data/tours";
import BrandMark from "@/components/BrandMark";
import { getTours } from "@/lib/tours";
import { deleteTourAction, saveTourAction } from "./actions";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: {
    status?: string;
    id?: string;
    message?: string;
  };
};

function formatPrice(value: number) {
  return value.toLocaleString("th-TH");
}

function formatList(items: string[]) {
  return items.join("\n");
}

function formatGallery(items?: string[]) {
  return (items ?? []).join("\n");
}

function formatItinerary(items: Tour["itinerary"]) {
  return items.map((item) => `${item.day} | ${item.title} | ${item.detail}`).join("\n");
}

function StatusBanner({
  status,
  id,
  message,
}: {
  status?: string;
  id?: string;
  message?: string;
}) {
  if (!status) {
    return null;
  }

  if (status === "saved") {
    return (
      <div className="rounded-[26px] border border-[rgba(123,101,132,0.22)] bg-[rgba(186,160,216,0.14)] px-5 py-4 text-sm text-[color:var(--foreground)]">
        บันทึกทัวร์เรียบร้อย{ id ? `: ${id}` : "" }
      </div>
    );
  }

  if (status === "deleted") {
    return (
      <div className="rounded-[26px] border border-[rgba(143,115,102,0.2)] bg-[rgba(196,162,131,0.16)] px-5 py-4 text-sm text-[color:var(--foreground)]">
        ลบทัวร์เรียบร้อย{ id ? `: ${id}` : "" }
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-[26px] border border-[rgba(181,73,73,0.24)] bg-[rgba(181,73,73,0.12)] px-5 py-4 text-sm text-[color:var(--foreground)]">
        {message ?? "บันทึกข้อมูลไม่สำเร็จ"}{id ? ` (${id})` : ""}
      </div>
    );
  }

  return null;
}

function FieldShell({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[color:var(--foreground)]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[color:var(--muted)]">{hint}</span> : null}
    </label>
  );
}

function inputClassName() {
  return "w-full rounded-[18px] border border-[color:var(--line)] bg-white/85 px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--lavender-deep)] focus:bg-white";
}

function textareaClassName() {
  return `${inputClassName()} min-h-[120px] resize-y`;
}

function GalleryPreview({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[color:var(--line)] bg-white/70"
        >
          <Image
            src={image}
            alt={`${title} gallery ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}

function TourForm({
  description,
  submitLabel,
  tour,
}: {
  description: string;
  submitLabel: string;
  tour?: Tour;
}) {
  const gallery = tour?.gallery ?? [];

  return (
    <form action={saveTourAction} className="grid gap-5">
      <input type="hidden" name="originalId" defaultValue={tour?.id ?? ""} />
      <input type="hidden" name="currentImage" defaultValue={tour?.image ?? ""} />
      <input type="hidden" name="currentGallery" defaultValue={formatGallery(gallery)} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FieldShell
          label="Slug / ID"
          hint="ใช้ตัวอักษรอังกฤษ ตัวเลข และขีด เช่น japan-tokyo-osaka"
        >
          <input
            name="id"
            defaultValue={tour?.id ?? ""}
            placeholder="new-tour-slug"
            className={inputClassName()}
            required
          />
        </FieldShell>

        <FieldShell label="Type">
          <select
            name="type"
            defaultValue={tour?.type ?? "international"}
            className={inputClassName()}
          >
            <option value="international">ต่างประเทศ</option>
            <option value="domestic">ในประเทศ</option>
          </select>
        </FieldShell>

        <FieldShell label="Days">
          <input
            type="number"
            min={1}
            name="days"
            defaultValue={tour?.days ?? 5}
            className={inputClassName()}
            required
          />
        </FieldShell>

        <FieldShell label="Nights">
          <input
            type="number"
            min={0}
            name="nights"
            defaultValue={tour?.nights ?? 4}
            className={inputClassName()}
            required
          />
        </FieldShell>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Title">
          <input
            name="title"
            defaultValue={tour?.title ?? ""}
            className={inputClassName()}
            required
          />
        </FieldShell>

        <FieldShell label="Tag" hint="ไม่จำเป็น เช่น แนะนำ, ขายดี">
          <input
            name="tag"
            defaultValue={tour?.tag ?? ""}
            className={inputClassName()}
          />
        </FieldShell>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Destination">
          <input
            name="destination"
            defaultValue={tour?.destination ?? ""}
            className={inputClassName()}
            required
          />
        </FieldShell>

        <FieldShell label="Country">
          <input
            name="country"
            defaultValue={tour?.country ?? ""}
            className={inputClassName()}
            required
          />
        </FieldShell>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FieldShell label="Price">
          <input
            type="number"
            min={1}
            name="price"
            defaultValue={tour?.price ?? 1000}
            className={inputClassName()}
            required
          />
        </FieldShell>

        <FieldShell label="Original Price" hint="เว้นว่างได้">
          <input
            type="number"
            min={0}
            name="originalPrice"
            defaultValue={tour?.originalPrice ?? ""}
            className={inputClassName()}
          />
        </FieldShell>

        <FieldShell
          label="Image URL"
          hint="ใช้ path local เช่น /images/xxx.jpg หรือ Blob URL ถ้าไม่อัปโหลดไฟล์ใหม่"
        >
          <input
            name="imageUrl"
            defaultValue={tour?.image ?? ""}
            className={inputClassName()}
          />
        </FieldShell>
      </div>

      <FieldShell
        label="Upload Cover Image To Blob"
        hint="ถ้าเลือกไฟล์ใหม่ ระบบจะอัปโหลดขึ้น Blob และใช้เป็นรูปหลักแทน"
      >
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          className="block w-full rounded-[18px] border border-dashed border-[color:var(--line)] bg-white/55 px-4 py-3 text-sm text-[color:var(--muted)]"
        />
      </FieldShell>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <FieldShell
          label="Gallery URLs"
          hint="หนึ่งบรรทัดต่อหนึ่งรูป ใช้ path local หรือ Blob URL ได้"
        >
          <textarea
            name="galleryUrls"
            defaultValue={formatGallery(gallery)}
            className={`${textareaClassName()} min-h-[160px]`}
          />
        </FieldShell>

        <FieldShell
          label="Upload Gallery Images To Blob"
          hint="เลือกได้หลายไฟล์ รูปที่อัปโหลดใหม่จะถูกต่อท้ายรายการ gallery เดิม"
        >
          <input
            type="file"
            name="galleryFiles"
            accept="image/*"
            multiple
            className="block w-full rounded-[18px] border border-dashed border-[color:var(--line)] bg-white/55 px-4 py-3 text-sm text-[color:var(--muted)]"
          />
        </FieldShell>
      </div>

      {gallery.length > 0 ? (
        <div className="grid gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--earth-deep)]">
            Current Gallery
          </p>
          <GalleryPreview images={gallery} title={tour?.title ?? "Tour"} />
        </div>
      ) : null}

      <FieldShell label="Description">
        <textarea
          name="description"
          defaultValue={tour?.description ?? ""}
          className={textareaClassName()}
          required
        />
      </FieldShell>

      <div className="grid gap-4 xl:grid-cols-3">
        <FieldShell
          label="Highlights"
          hint="หนึ่งบรรทัดต่อหนึ่งข้อ"
        >
          <textarea
            name="highlights"
            defaultValue={tour ? formatList(tour.highlights) : ""}
            className={textareaClassName()}
          />
        </FieldShell>

        <FieldShell
          label="Includes"
          hint="หนึ่งบรรทัดต่อหนึ่งข้อ"
        >
          <textarea
            name="includes"
            defaultValue={tour ? formatList(tour.includes) : ""}
            className={textareaClassName()}
          />
        </FieldShell>

        <FieldShell
          label="Itinerary"
          hint="หนึ่งบรรทัดต่อหนึ่งวัน รูปแบบ: 1 | ชื่อวัน | รายละเอียด"
        >
          <textarea
            name="itinerary"
            defaultValue={tour ? formatItinerary(tour.itinerary) : ""}
            className={`${textareaClassName()} min-h-[180px]`}
          />
        </FieldShell>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
        <div className="text-xs leading-6 text-[color:var(--muted)]">
          {description}
        </div>
        <button
          type="submit"
          className="rounded-full bg-[color:var(--lavender-deep)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const tours = await getTours();

  return (
    <main className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="glass-panel rounded-[36px] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <BrandMark size="sm" showWordmark />
                <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--earth-deep)]">
                  Admin
                </span>
              </div>
              <h1 className="mt-5 font-display text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
                จัดการแพ็กเกจทัวร์ที่ `/admin`
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                หน้านี้เชื่อมกับ Neon โดยตรง และอัปโหลดรูปขึ้น Vercel Blob ได้จากฟอร์มเดียวกัน
                ตอนนี้รองรับทั้งรูปหลักและ Gallery ของแต่ละแพ็กเกจแล้ว
                แต่ยังไม่มีระบบล็อกอิน ดังนั้นอย่าเผย URL นี้ต่อสาธารณะจนกว่าจะเพิ่ม auth
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-[color:var(--line)] bg-white/70 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--earth-deep)]">
                  ทั้งหมด
                </p>
                <p className="mt-2 font-display text-4xl text-[color:var(--foreground)]">
                  {tours.length}
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(186,160,216,0.22)] bg-[rgba(186,160,216,0.12)] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--lavender-deep)]">
                  Database
                </p>
                <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
                  Neon
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(196,162,131,0.24)] bg-[rgba(196,162,131,0.14)] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--earth-deep)]">
                  Images
                </p>
                <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
                  Vercel Blob
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              href="/"
              className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
            >
              กลับหน้าเว็บ
            </Link>
          </div>
        </header>

        <StatusBanner
          status={searchParams?.status}
          id={searchParams?.id}
          message={searchParams?.message}
        />

        <section className="soft-card rounded-[36px] p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--earth-deep)]">
                Create Tour
              </p>
              <h2 className="mt-3 font-display text-4xl text-[color:var(--foreground)]">
                เพิ่มแพ็กเกจใหม่
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[color:var(--muted)]">
              ตอนสร้างรายการใหม่ คุณใส่ได้ทั้งรูปหลัก, gallery URLs และ gallery files
              จากนั้นหน้า detail จะมี section แกลเลอรีแสดงเหนือโปรแกรมการเดินทางให้ทันที
            </p>
          </div>

          <TourForm
            description="เมื่อกดบันทึก ระบบจะ insert ลง Neon และ revalidate หน้าเว็บหลักให้อัตโนมัติ"
            submitLabel="สร้างแพ็กเกจ"
          />
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--earth-deep)]">
                Existing Tours
              </p>
              <h2 className="mt-3 font-display text-4xl text-[color:var(--foreground)]">
                แก้ไขและลบรายการเดิม
              </h2>
            </div>
          </div>

          {tours.map((tour) => {
            const gallery = tour.gallery ?? [];

            return (
              <details
                key={tour.id}
                className="soft-card overflow-hidden rounded-[34px]"
              >
                <summary className="list-none cursor-pointer px-6 py-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-[18px] border border-[color:var(--line)] bg-white/60">
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          width={112}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[rgba(123,101,132,0.14)] px-3 py-1 text-xs font-semibold text-[color:var(--lavender-deep)]">
                            {tour.type === "international" ? "ต่างประเทศ" : "ในประเทศ"}
                          </span>
                          <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-[color:var(--muted)]">
                            {tour.id}
                          </span>
                          <span className="rounded-full bg-[rgba(196,162,131,0.16)] px-3 py-1 text-xs font-semibold text-[color:var(--earth-deep)]">
                            Gallery {gallery.length}
                          </span>
                        </div>
                        <h3 className="mt-3 line-clamp-2 font-display text-3xl leading-tight text-[color:var(--foreground)]">
                          {tour.title}
                        </h3>
                        <p className="mt-2 text-sm text-[color:var(--muted)]">
                          {tour.destination} • {tour.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="rounded-[22px] border border-[color:var(--line)] bg-white/72 px-4 py-3 text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--earth-deep)]">
                          ราคา
                        </p>
                        <p className="mt-1 font-display text-3xl text-[color:var(--foreground)]">
                          ฿{formatPrice(tour.price)}
                        </p>
                      </div>

                      <Link
                        href={`/tour/${tour.id}`}
                        className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
                      >
                        เปิดหน้ารายละเอียด
                      </Link>
                    </div>
                  </div>
                </summary>

                <div className="border-t border-[color:var(--line)] px-6 py-6">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-[color:var(--muted)]">
                      แก้ไขข้อมูลรายการนี้, เปลี่ยนรูปหลัก หรือเพิ่ม Gallery เพิ่มเติมได้จากฟอร์มด้านล่าง
                    </p>

                    <form action={deleteTourAction}>
                      <input type="hidden" name="id" value={tour.id} />
                      <input type="hidden" name="image" value={tour.image} />
                      <input type="hidden" name="gallery" value={formatGallery(gallery)} />
                      <button
                        type="submit"
                        className="rounded-full border border-[rgba(143,115,102,0.24)] bg-[rgba(143,115,102,0.08)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:bg-[rgba(143,115,102,0.14)]"
                      >
                        ลบรายการนี้
                      </button>
                    </form>
                  </div>

                  <TourForm
                    description="เมื่อกดบันทึก ระบบจะ update row เดิมใน Neon, ปรับ gallery ใหม่, และ refresh หน้าเว็บที่เกี่ยวข้อง"
                    submitLabel="บันทึกการแก้ไข"
                    tour={tour}
                  />
                </div>
              </details>
            );
          })}
        </section>
      </div>
    </main>
  );
}
