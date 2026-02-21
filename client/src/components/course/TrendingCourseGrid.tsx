"use client";

import { useGetTrendingCourses } from "@/hooks/endpoints/usePublicCourses";
import CourseCard from "./CourseCard";
import CourseCardSkeleton from "./CourseCardSkeleton";

interface TrendingCourseGridProps {
  limit?: number;
}

export default function TrendingCourseGrid({
  limit = 6,
}: TrendingCourseGridProps) {
  const { data, isLoading, error } = useGetTrendingCourses(limit);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Unable to load trending courses right now.
        </p>
      </div>
    );
  }

  if (isLoading == true) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const courses = data?.data ?? [];

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No trending courses at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
