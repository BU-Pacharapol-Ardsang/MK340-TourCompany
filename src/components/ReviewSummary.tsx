"use client";

import { useEffect, useState } from "react";
import StarRating from "./StarRating";

interface ReviewSummaryProps {
  tourId: string;
}

export default function ReviewSummary({ tourId }: ReviewSummaryProps) {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviewsSummary = async () => {
      try {
        const response = await fetch(`/api/reviews/${tourId}`);
        const data = await response.json();
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      } catch (error) {
        console.error("Error fetching reviews summary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewsSummary();
  }, [tourId]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 animate-pulse">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-gray-300" />
          ))}
        </div>
        <span>-</span>
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} className="w-3 h-3 fill-gray-300" viewBox="0 0 20 20">
              <path d="M10 15L3.82 18.18L5.39 11.36L0 7.36L7.19 6.63L10 0L12.81 6.63L20 7.36L14.61 11.36L16.18 18.18Z" />
            </svg>
          ))}
        </div>
        <span>ยังไม่มีรีวิว</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors">
      <div className="flex gap-0.5">
        <StarRating value={Math.round(averageRating)} readOnly size="sm" />
      </div>
      <span className="whitespace-nowrap">({totalReviews})</span>
    </div>
  );
}
