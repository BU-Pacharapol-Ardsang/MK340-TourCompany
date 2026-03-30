"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { TourGalleryItem } from "@/data/tours";

type AdminGalleryEditorProps = {
  initialItems: TourGalleryItem[];
};

type UrlGalleryEditorItem = {
  id: string;
  kind: "url";
  url: string;
  caption: string;
};

type FileGalleryEditorItem = {
  id: string;
  kind: "file";
  fileKey: string;
  file: File;
  previewUrl: string;
  caption: string;
};

type GalleryEditorItem = UrlGalleryEditorItem | FileGalleryEditorItem;

type SerializedGalleryEditorItem =
  | {
      kind: "url";
      url: string;
      caption: string;
    }
  | {
      kind: "file";
      fileKey: string;
      caption: string;
    };

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeCaption(value: string) {
  return value.trim();
}

function normalizeUrl(value: string) {
  return value.trim();
}

function createUrlItem(item?: TourGalleryItem): UrlGalleryEditorItem {
  return {
    id: makeId("gallery-url"),
    kind: "url",
    url: item?.url ?? "",
    caption: item?.caption ?? "",
  };
}

function createFileItem(file: File): FileGalleryEditorItem {
  return {
    id: makeId("gallery-file"),
    kind: "file",
    fileKey: makeId("upload"),
    file,
    previewUrl: URL.createObjectURL(file),
    caption: "",
  };
}

function toSerializedGalleryItems(items: GalleryEditorItem[]): SerializedGalleryEditorItem[] {
  return items
    .map((item) => {
      if (item.kind === "url") {
        const url = normalizeUrl(item.url);

        if (!url) {
          return null;
        }

        return {
          kind: "url" as const,
          url,
          caption: normalizeCaption(item.caption),
        };
      }

      return {
        kind: "file" as const,
        fileKey: item.fileKey,
        caption: normalizeCaption(item.caption),
      };
    })
    .filter((item): item is SerializedGalleryEditorItem => item !== null);
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function dropIndicatorClass(isActive: boolean) {
  return isActive
    ? "border-[color:var(--lavender-deep)] bg-[rgba(74,150,255,0.14)]"
    : "border-[color:var(--line)] bg-white/70";
}

export default function AdminGalleryEditor({
  initialItems,
}: AdminGalleryEditorProps) {
  const [items, setItems] = useState<GalleryEditorItem[]>(() =>
    initialItems.map((item) => createUrlItem(item)),
  );
  const [urlDraft, setUrlDraft] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previousPreviewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!fileInputRef.current) {
      return;
    }

    const fileItems = items.filter(
      (item): item is FileGalleryEditorItem => item.kind === "file",
    );

    const dataTransfer = new DataTransfer();

    for (let index = 0; index < fileItems.length; index += 1) {
      dataTransfer.items.add(fileItems[index].file);
    }

    fileInputRef.current.files = dataTransfer.files;
  }, [items]);

  useEffect(() => {
    const currentPreviewUrls = items
      .filter((item): item is FileGalleryEditorItem => item.kind === "file")
      .map((item) => item.previewUrl);

    for (let index = 0; index < previousPreviewUrlsRef.current.length; index += 1) {
      const previewUrl = previousPreviewUrlsRef.current[index];

      if (!currentPreviewUrls.includes(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    }

    previousPreviewUrlsRef.current = currentPreviewUrls;
  }, [items]);

  useEffect(() => {
    return () => {
      for (let index = 0; index < previousPreviewUrlsRef.current.length; index += 1) {
        URL.revokeObjectURL(previousPreviewUrlsRef.current[index]);
      }
    };
  }, []);

  const serializedItems = toSerializedGalleryItems(items);
  const pendingFileItems = items.filter(
    (item): item is FileGalleryEditorItem => item.kind === "file",
  );

  const handleAddUrl = () => {
    if (!normalizeUrl(urlDraft)) {
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      createUrlItem({
        url: urlDraft,
        caption: "",
      }),
    ]);
    setUrlDraft("");
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      ...selectedFiles.map((file) => createFileItem(file)),
    ]);

    event.target.value = "";
  };

  const updateItem = (
    itemId: string,
    updater: (item: GalleryEditorItem) => GalleryEditorItem,
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? updater(item) : item)),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const moveByOffset = (itemId: string, direction: -1 | 1) => {
    setItems((currentItems) => {
      const currentIndex = currentItems.findIndex((item) => item.id === itemId);
      const targetIndex = currentIndex + direction;

      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= currentItems.length) {
        return currentItems;
      }

      return moveItem(currentItems, currentIndex, targetIndex);
    });
  };

  const handleDropOnItem = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    setItems((currentItems) => {
      const fromIndex = currentItems.findIndex((item) => item.id === draggedId);
      const toIndex = currentItems.findIndex((item) => item.id === targetId);

      if (fromIndex < 0 || toIndex < 0) {
        return currentItems;
      }

      return moveItem(currentItems, fromIndex, toIndex);
    });

    setDraggedId(null);
    setDropTargetId(null);
  };

  return (
    <div className="grid gap-5">
      <input
        type="hidden"
        name="currentGallery"
        value={JSON.stringify(initialItems)}
        readOnly
      />
      <input
        type="hidden"
        name="galleryItems"
        value={JSON.stringify(serializedItems)}
        readOnly
      />
      {pendingFileItems.map((item) => (
        <input
          key={item.fileKey}
          type="hidden"
          name="galleryFileKeys"
          value={item.fileKey}
          readOnly
        />
      ))}

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <FieldShellLike
          label="Add Gallery URL"
          hint="วางลิงก์รูปแล้วกดเพิ่ม ระบบจะสร้าง item ที่ลากเรียงและใส่ caption ได้"
        >
          <div className="flex gap-3">
            <input
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
              placeholder="https://... หรือ /images/..."
              className="w-full rounded-[18px] border border-[color:var(--line)] bg-white/85 px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--lavender-deep)] focus:bg-white"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="shrink-0 rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
            >
              เพิ่ม URL
            </button>
          </div>
        </FieldShellLike>

        <FieldShellLike
          label="Upload Gallery Images To Blob"
          hint="เลือกรูปใหม่ได้หลายไฟล์ จากนั้นลากเรียง, แก้ caption, หรือลบออกก่อนบันทึกได้"
        >
          <input
            ref={fileInputRef}
            type="file"
            name="galleryFiles"
            accept="image/*"
            multiple
            onChange={handleFileSelection}
            className="block w-full rounded-[18px] border border-dashed border-[color:var(--line)] bg-white/55 px-4 py-3 text-sm text-[color:var(--muted)]"
          />
        </FieldShellLike>
      </div>

      <div className="rounded-[28px] border border-dashed border-[color:var(--line)] bg-white/45 px-5 py-4 text-xs leading-6 text-[color:var(--muted)]">
        เรียงลำดับได้ด้วยการลากการ์ดบนเดสก์ท็อป หรือใช้ปุ่มขึ้น/ลงในแต่ละรูปบนมือถือ
      </div>

      {items.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item, index) => {
            const previewUrl = item.kind === "file" ? item.previewUrl : item.url;
            const hasPreview = normalizeUrl(previewUrl).length > 0;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDraggedId(item.id)}
                onDragEnd={() => {
                  setDraggedId(null);
                  setDropTargetId(null);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDropTargetId(item.id);
                }}
                onDragLeave={() => {
                  if (dropTargetId === item.id) {
                    setDropTargetId(null);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDropOnItem(item.id);
                }}
                className={`rounded-[28px] border p-4 transition ${dropIndicatorClass(
                  dropTargetId === item.id,
                )}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[rgba(74,150,255,0.18)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--lavender-deep)]">
                      #{index + 1}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--muted)]">
                      {item.kind === "file" ? "New Upload" : "URL Image"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveByOffset(item.id, -1)}
                      className="rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-xs font-semibold text-[color:var(--foreground)]"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveByOffset(item.id, 1)}
                      className="rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-xs font-semibold text-[color:var(--foreground)]"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-full border border-[rgba(19,131,211,0.24)] bg-[rgba(19,131,211,0.08)] px-3 py-2 text-xs font-semibold text-[color:var(--foreground)]"
                    >
                      ลบ
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[170px_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[color:var(--line)] bg-white/70">
                    {hasPreview ? (
                      <Image
                        src={previewUrl}
                        alt={item.caption || `Gallery item ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="170px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-xs font-medium text-[color:var(--muted)]">
                        ใส่ URL ของรูปเพื่อแสดงตัวอย่าง
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3">
                    {item.kind === "url" ? (
                      <FieldShellLike
                        label="Image URL"
                        hint="แก้ไข URL ได้โดยตรง และลำดับจะยึดตามการ์ดนี้"
                      >
                        <input
                          value={item.url}
                          onChange={(event) =>
                            updateItem(item.id, (currentItem) => ({
                              ...currentItem,
                              url: event.target.value,
                            }))
                          }
                          placeholder="https://... หรือ /images/..."
                          className="w-full rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--lavender-deep)]"
                        />
                      </FieldShellLike>
                    ) : (
                      <div className="rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)]">
                        <p className="font-medium">{item.file.name}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                          ไฟล์นี้จะถูกอัปโหลดขึ้น Blob ตอนกดบันทึก
                        </p>
                      </div>
                    )}

                    <FieldShellLike
                      label="Caption"
                      hint="ข้อความนี้จะแสดงใน popup ของ gallery และช่วยอธิบายภาพแต่ละรูป"
                    >
                      <input
                        value={item.caption}
                        onChange={(event) =>
                          updateItem(item.id, (currentItem) => ({
                            ...currentItem,
                            caption: event.target.value,
                          }))
                        }
                        placeholder="เช่น วิวเขาในช่วงเช้า / จุดชมวิวหลักของทริป"
                        className="w-full rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--lavender-deep)]"
                      />
                    </FieldShellLike>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-[color:var(--line)] bg-white/60 px-5 py-8 text-center text-sm text-[color:var(--muted)]">
          ยังไม่มีรูปใน Gallery เพิ่มจาก URL หรืออัปโหลดไฟล์ใหม่ได้ด้านบน
        </div>
      )}
    </div>
  );
}

function FieldShellLike({
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
