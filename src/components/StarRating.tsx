"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const displayRating = hoveredRating !== null ? hoveredRating : value;

  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }[size];

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          title={`ให้คะแนน ${rating} ดาว`}
          aria-label={`ให้คะแนน ${rating} ดาว`}
          disabled={readOnly}
          className={`${sizeClass} ${!readOnly && "cursor-pointer hover:scale-110 transition-transform"} ${readOnly && "cursor-default"}`}
          onMouseEnter={() => !readOnly && setHoveredRating(rating)}
          onMouseLeave={() => !readOnly && setHoveredRating(null)}
          onClick={() => !readOnly && onChange?.(rating)}
        >
          <svg
            className={`w-full h-full ${
              rating <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            } transition-colors`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15L3.82 18.18L5.39 11.36L0 7.36L7.19 6.63L10 0L12.81 6.63L20 7.36L14.61 11.36L16.18 18.18Z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
