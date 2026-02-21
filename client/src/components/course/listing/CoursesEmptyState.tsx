"use client";

import { BookOpen } from "lucide-react";

interface CoursesEmptyStateProps {
  hasActiveFilters: boolean;
  onReset: () => void;
}

export default function CoursesEmptyState({
  hasActiveFilters,
  onReset,
}: CoursesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {hasActiveFilters ? "No courses match your filters" : "No courses yet"}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {hasActiveFilters
          ? "Try adjusting or clearing your filters to see more results."
          : "Check back soon — new courses are added regularly."}
      </p>
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
