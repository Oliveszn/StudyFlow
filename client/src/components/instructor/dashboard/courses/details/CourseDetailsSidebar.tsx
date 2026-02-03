"use client";

import { BookOpen, Users, Star, DollarSign } from "lucide-react";
import type { CourseDetails } from "@/api/endpoints/instructor/courses";
import type { ReviewStatsData } from "@/api/endpoints/instructor/reviews";

interface CourseDetailsSidebarProps {
  course: CourseDetails;
  reviewStats?: ReviewStatsData;
}

const StatItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

export default function CourseDetailsSidebar({
  course,
  reviewStats,
}: CourseDetailsSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-300" />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ${course.price}
            </span>
            {course.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${course.discountPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Course Stats
        </h3>
        <StatItem
          icon={BookOpen}
          label="Sections"
          value={course._count?.sections ?? 0}
        />
        <StatItem
          icon={Users}
          label="Enrollments"
          value={course._count?.enrollments ?? 0}
        />
        <StatItem
          icon={Star}
          label="Avg Rating"
          value={
            reviewStats?.averageRating
              ? reviewStats.averageRating.toFixed(1)
              : "—"
          }
        />
        <StatItem
          icon={DollarSign}
          label="Total Reviews"
          value={reviewStats?.totalReviews ?? 0}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Details</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Language</span>
          <span className="font-medium text-gray-900 uppercase">
            {course.language}
          </span>
        </div>
      </div>
    </div>
  );
}
