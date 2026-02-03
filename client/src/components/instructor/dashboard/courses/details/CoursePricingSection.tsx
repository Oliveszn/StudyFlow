"use client";

import type { CourseDetails } from "@/api/endpoints/instructor/courses";

interface CoursePricingSectionProps {
  course: CourseDetails;
}

export default function CoursePricingSection({
  course,
}: CoursePricingSectionProps) {
  const hasSavings =
    course.discountPrice && course.discountPrice < course.price;
  const savingsPercent = hasSavings
    ? Math.round(((course.price - course.discountPrice!) / course.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Original Price
          </label>
          <p
            className={`text-2xl font-bold ${hasSavings ? "text-gray-400 line-through" : "text-gray-900"}`}
          >
            ₦{Number(course.price).toFixed(2)}
          </p>
        </div>

        {hasSavings && (
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Discount Price
            </label>
            <p className="text-2xl font-bold text-green-600">
              ₦{Number(course.discountPrice!).toFixed(2)}
            </p>
          </div>
        )}

        {hasSavings && (
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Savings
            </label>
            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full">
              {savingsPercent}% off
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
