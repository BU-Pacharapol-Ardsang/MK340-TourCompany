"use client";

import { useState } from "react";
import Image from "next/image";

interface TourCardImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

export default function TourCardImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority,
}: TourCardImageProps) {
  const [showFallback, setShowFallback] = useState(false);

  if (showFallback) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),rgba(104,128,158,0.2)_42%,rgba(21,74,136,0.42))]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(12,48,94,0.36))]" />
        <div className="absolute inset-x-4 bottom-4 rounded-xl bg-[rgba(8,31,61,0.52)] px-3 py-2 text-xs font-medium text-white/90 backdrop-blur-sm">
          ไม่สามารถโหลดรูปภาพได้
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes={sizes}
      priority={priority}
      onError={() => setShowFallback(true)}
    />
  );
}
