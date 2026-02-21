"use client";

import CoursesPagination from "./CoursesPagination";
import CoursesEmptyState from "./CoursesEmptyState";
import type { CourseFilters } from "@/app/courses/page";
import type { CourseResponse } from "@/api/endpoints/courses";
import CourseCard from "../CourseCard";
import CourseCardSkeleton from "../CourseCardSkeleton";

interface CoursesGridProps {
  data?: CourseResponse;
  isLoading: boolean;
  error: Error | null;
  filters: CourseFilters;
  onPageChange: (page: number) => void;
  onReset: () => void;
}

const hasActiveFilters = (filters: CourseFilters) =>
  filters.categoryId !== "" ||
  filters.minPrice !== "" ||
  filters.maxPrice !== "" ||
  filters.rating !== "" ||
  filters.language !== "" ||
  filters.search !== "";

export default function CoursesGrid({
  data,
  isLoading,
  error,
  filters,
  onPageChange,
  onReset,
}: CoursesGridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-600 mb-4">
          Something went wrong loading courses.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const courses = data?.data ?? [];
  const pagination = data?.pagination;

  if (courses.length === 0) {
    return (
      <CoursesEmptyState
        hasActiveFilters={hasActiveFilters(filters)}
        onReset={onReset}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {pagination && (
        <CoursesPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
