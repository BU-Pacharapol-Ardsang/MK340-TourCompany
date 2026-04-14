"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import StarRating from "./StarRating";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment?: string;
  images: string[];
  created_at: string;
}

interface ReviewsListProps {
  tourId: string;
}

export default function ReviewsList({ tourId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${tourId}`);
        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [tourId]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500">กำลังโหลดรีวิว...</p>
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">ยังไม่มีรีวิวสำหรับแพ็คเกจนี้</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-lg bg-gray-50 border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-2">คะแนนเฉลี่ย</div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <div>
                <StarRating value={Math.round(averageRating)} readOnly size="lg" />
                <p className="text-sm text-gray-600 mt-1">
                  จาก {totalReviews} รีวิว
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const reviewDate = new Date(review.created_at).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-xs text-gray-500">{reviewDate}</p>
                </div>
                <StarRating value={review.rating} readOnly size="sm" />
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {review.comment}
                </p>
              )}

              {/* Images */}
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {review.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={image}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
