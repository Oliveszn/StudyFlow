"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { ReviewStatsData } from "@/api/endpoints/instructor/reviews";
import { useGetCourseReviews } from "@/hooks/endpoints/instructor/useReviews";

interface CourseReviewsSectionProps {
  courseId: string;
  reviewStats?: ReviewStatsData;
}

const RatingBar = ({
  rating,
  count,
  percentage,
  isActive,
  onClick,
}: {
  rating: number;
  count: number;
  percentage: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full text-left transition ${isActive ? "opacity-100" : "hover:opacity-80"}`}
  >
    <span className="text-xs text-gray-500 w-4 text-right">{rating}</span>
    <Star
      className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-amber-400" : "text-gray-300"}`}
      fill={isActive ? "#fbbf24" : "none"}
    />
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-amber-400 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
  </button>
);

export default function CourseReviewsSection({
  courseId,
  reviewStats,
}: CourseReviewsSectionProps) {
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);

  const { data: reviewsData } = useGetCourseReviews(courseId, {
    page,
    limit: 5,
    rating: ratingFilter,
  });

  const reviews = reviewsData?.data || [];
  const pagination = reviewsData?.pagination;

  const handleRatingClick = (rating: number) => {
    setPage(1);
    setRatingFilter(ratingFilter === rating ? undefined : rating);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>

      {reviewStats && (
        <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
          <div className="flex-shrink-0 text-center min-w-[100px]">
            <p className="text-5xl font-bold text-gray-900">
              {reviewStats.averageRating
                ? reviewStats.averageRating.toFixed(1)
                : "0"}
            </p>
            <div className="flex justify-center gap-0.5 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-4 h-4 text-amber-400"
                  fill={
                    s <= Math.round(reviewStats.averageRating)
                      ? "#fbbf24"
                      : "none"
                  }
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {reviewStats.totalReviews} reviews
            </p>
          </div>

          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={
                  reviewStats.distribution[
                    rating as keyof typeof reviewStats.distribution
                  ]
                }
                percentage={reviewStats.percentages[rating]}
                isActive={ratingFilter === rating}
                onClick={() => handleRatingClick(rating)}
              />
            ))}
          </div>
        </div>
      )}

      {ratingFilter && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            Showing {ratingFilter}-star reviews
          </span>
          <button
            onClick={() => {
              setRatingFilter(undefined);
              setPage(1);
            }}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Clear filter
          </button>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">
                  {review.user.firstName[0]}
                  {review.user.lastName[0]}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {review.user.firstName} {review.user.lastName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 text-amber-400"
                      fill={s <= review.rating ? "#fbbf24" : "none"}
                    />
                  ))}
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-sm rounded-lg transition ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
