"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { TourGalleryItem } from "@/data/tours";

const MAX_PREVIEW_IMAGES = 8;
const SWIPE_THRESHOLD = 56;

type TourGalleryProps = {
  items: TourGalleryItem[];
  title: string;
};

type PreviewTile = {
  item: TourGalleryItem;
  originalIndex: number;
  previewIndex: number;
  weight: number;
};

type TouchGesture = {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
};

const TWO_ITEM_PATTERNS = [
  [1.35, 1.7],
  [1.6, 1.25],
];

const THREE_ITEM_PATTERNS = [
  [1.22, 0.95, 1.3],
  [1.05, 1.24, 1.02],
  [0.92, 1.08, 1.38],
];

function getRowSizes(count: number) {
  if (count <= 2) return [count];
  if (count === 3) return [3];
  if (count === 4) return [2, 2];
  if (count === 5) return [2, 3];
  if (count === 6) return [3, 3];
  if (count === 7) return [2, 2, 3];
  return [2, 3, 3];
}

function buildPreviewRows(items: TourGalleryItem[]) {
  const previewItems = items.slice(0, MAX_PREVIEW_IMAGES);
  const rowSizes = getRowSizes(previewItems.length);
  const rows: PreviewTile[][] = [];
  let cursor = 0;
  let twoPatternIndex = 0;
  let threePatternIndex = 0;

  for (let rowIndex = 0; rowIndex < rowSizes.length; rowIndex += 1) {
    const rowSize = rowSizes[rowIndex];
    const rowItems = previewItems.slice(cursor, cursor + rowSize);
    let weights: number[];

    if (rowSize === 1) {
      weights = [1];
    } else if (rowSize === 2) {
      weights = TWO_ITEM_PATTERNS[twoPatternIndex % TWO_ITEM_PATTERNS.length];
      twoPatternIndex += 1;
    } else {
      weights = THREE_ITEM_PATTERNS[threePatternIndex % THREE_ITEM_PATTERNS.length];
      threePatternIndex += 1;
    }

    rows.push(
      rowItems.map((item, index) => ({
        item,
        originalIndex: cursor + index,
        previewIndex: cursor + index,
        weight: weights[index] ?? 1,
      })),
    );

    cursor += rowSize;
  }

  return rows;
}

function getRowHeightClass(size: number) {
  if (size === 1) {
    return "h-[250px] sm:h-[320px] lg:h-[360px]";
  }

  if (size === 2) {
    return "h-[170px] sm:h-[220px] lg:h-[250px]";
  }

  return "h-[126px] sm:h-[165px] lg:h-[190px]";
}

function trimCaption(caption?: string) {
  return caption?.trim() ?? "";
}

export default function TourGallery({ items, title }: TourGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const touchGestureRef = useRef<TouchGesture | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % items.length,
        );
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? items.length - 1 : (current - 1 + items.length) % items.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, items.length]);

  if (items.length === 0) {
    return null;
  }

  const rows = buildPreviewRows(items);
  const hiddenCount = Math.max(items.length - MAX_PREVIEW_IMAGES, 0);
  const activeItem = activeIndex === null ? null : items[activeIndex];
  const activeCaption = trimCaption(activeItem?.caption);

  const movePrevious = () => {
    setActiveIndex((current) =>
      current === null ? items.length - 1 : (current - 1 + items.length) % items.length,
    );
  };

  const moveNext = () => {
    setActiveIndex((current) =>
      current === null ? 0 : (current + 1) % items.length,
    );
  };

  const lightbox =
    isMounted && activeIndex !== null && activeItem
      ? createPortal(
          <div
            className="fixed inset-0 isolate z-[120] overflow-hidden bg-[rgba(14,11,10,0.92)] backdrop-blur-xl"
            onClick={() => setActiveIndex(null)}
          >
            <div className="absolute inset-x-4 top-4 z-[122] flex items-center justify-between gap-3 sm:inset-x-6 sm:top-5">
              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {activeIndex + 1} / {items.length}
              </div>

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                ปิด
              </button>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                movePrevious();
              }}
              className="absolute left-3 top-1/2 z-[122] hidden -translate-y-1/2 rounded-full border border-white/12 bg-white/10 px-4 py-3 text-2xl text-white transition hover:bg-white/16 sm:left-6 sm:block"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                moveNext();
              }}
              className="absolute right-3 top-1/2 z-[122] hidden -translate-y-1/2 rounded-full border border-white/12 bg-white/10 px-4 py-3 text-2xl text-white transition hover:bg-white/16 sm:right-6 sm:block"
              aria-label="Next image"
            >
              ›
            </button>

            <div
              className="mx-auto flex h-full max-w-7xl items-center justify-center px-4 py-20 sm:px-20"
              onClick={(event) => event.stopPropagation()}
              onTouchStart={(event) => {
                const touch = event.touches[0];
                touchGestureRef.current = {
                  startX: touch.clientX,
                  startY: touch.clientY,
                  deltaX: 0,
                  deltaY: 0,
                };
              }}
              onTouchMove={(event) => {
                if (!touchGestureRef.current) {
                  return;
                }

                const touch = event.touches[0];
                touchGestureRef.current.deltaX = touch.clientX - touchGestureRef.current.startX;
                touchGestureRef.current.deltaY = touch.clientY - touchGestureRef.current.startY;
              }}
              onTouchEnd={() => {
                const gesture = touchGestureRef.current;
                touchGestureRef.current = null;

                if (!gesture) {
                  return;
                }

                const horizontalDistance = Math.abs(gesture.deltaX);
                const verticalDistance = Math.abs(gesture.deltaY);

                if (
                  horizontalDistance < SWIPE_THRESHOLD ||
                  horizontalDistance <= verticalDistance
                ) {
                  return;
                }

                if (gesture.deltaX < 0) {
                  moveNext();
                  return;
                }

                movePrevious();
              }}
            >
              <div className="relative h-full w-full pb-28 pt-14 sm:pb-32 sm:pt-16">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-[121] px-4 sm:px-8">
                  <div className="mx-auto max-w-3xl rounded-[26px] bg-[rgba(8,8,8,0.44)] px-5 py-4 text-white shadow-[0_24px_80px_-36px_rgba(0,0,0,0.72)] backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                      Photo Note
                    </p>
                    <p className="mt-2 text-sm leading-7 sm:text-base">
                      {activeCaption || `${title} - ภาพที่ ${activeIndex + 1}`}
                    </p>
                    <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 sm:hidden">
                      Swipe left or right to browse
                    </p>
                  </div>
                </div>

                <div className="relative h-full max-h-[74vh] w-full">
                  <Image
                    src={activeItem.url}
                    alt={activeCaption || `${title} full image ${activeIndex + 1}`}
                    fill
                    priority
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </div>
            </div>

            {items.length > 1 && (
              <div
                className="absolute inset-x-4 bottom-4 z-[122] sm:inset-x-6"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="tour-gallery-scrollbar mx-auto flex max-w-5xl gap-3 overflow-x-auto rounded-[28px] border border-white/10 bg-[rgba(17,13,12,0.62)] px-4 py-4 backdrop-blur-xl">
                  {items.map((item, index) => (
                    <button
                      key={`${item.url}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-[18px] border transition ${
                        index === activeIndex
                          ? "border-white/80"
                          : "border-white/12 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={item.url}
                        alt={trimCaption(item.caption) || `${title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <section className="soft-card rounded-[34px] p-7 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--earth-deep)]">
              Gallery
            </p>
            <h2 className="mt-3 font-display text-4xl text-[color:var(--foreground)]">
              ภาพบรรยากาศของทริป
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              เลือกดูภาพมุมกว้างของสถานที่จริงก่อนเลื่อนลงไปอ่านโปรแกรมการเดินทางแบบวันต่อวัน
            </p>
          </div>

          <div className="rounded-full border border-[color:var(--line)] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--earth-deep)]">
            {items.length} Photos
          </div>
        </div>

        <div className="mt-7 space-y-3">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={`flex gap-3 ${getRowHeightClass(row.length)}`}
            >
              {row.map((tile) => {
                const isOverlayTile =
                  hiddenCount > 0 && tile.previewIndex === MAX_PREVIEW_IMAGES - 1;
                const caption = trimCaption(tile.item.caption);

                return (
                  <button
                    key={`${tile.item.url}-${tile.previewIndex}`}
                    type="button"
                    onClick={() => setActiveIndex(tile.originalIndex)}
                    style={{ flexGrow: tile.weight, flexBasis: 0 }}
                    className="group relative min-w-0 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/65 text-left"
                  >
                    <Image
                      src={tile.item.url}
                      alt={caption || `${title} gallery ${tile.originalIndex + 1}`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,245,0.02),rgba(28,22,20,0.18))]" />
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        {caption ? (
                          <p className="max-w-[22rem] truncate rounded-full bg-[rgba(255,255,255,0.84)] px-3 py-1 text-[11px] font-medium text-[color:var(--foreground)] backdrop-blur">
                            {caption}
                          </p>
                        ) : null}
                      </div>

                      {!isOverlayTile && (
                        <span className="shrink-0 rounded-full bg-white/82 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)] backdrop-blur">
                          View Photo
                        </span>
                      )}
                    </div>

                    {isOverlayTile && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(31,25,22,0.42)] backdrop-blur-[2px]">
                        <div className="rounded-[24px] bg-white/16 px-6 py-5 text-center text-white">
                          <p className="font-display text-5xl leading-none">+{hiddenCount}</p>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em]">
                            More Photos
                          </p>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {lightbox}

      <style jsx global>{`
        .tour-gallery-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.34) rgba(255, 255, 255, 0.08);
        }

        .tour-gallery-scrollbar::-webkit-scrollbar {
          height: 10px;
        }

        .tour-gallery-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }

        .tour-gallery-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.34);
          border: 2px solid rgba(23, 18, 16, 0.72);
          border-radius: 999px;
        }

        .tour-gallery-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.48);
        }
      `}</style>
    </>
  );
}
