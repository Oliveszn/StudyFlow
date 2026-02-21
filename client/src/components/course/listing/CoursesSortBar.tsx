"use client";

import { SlidersHorizontal } from "lucide-react";

interface CoursesSortBarProps {
  sort: string;
  onSortChange: (value: string) => void;
  total?: number;
  isLoading: boolean;
  hasActiveFilters: boolean;
  onMobileFilterOpen: () => void;
}

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

export default function CoursesSortBar({
  sort,
  onSortChange,
  total,
  isLoading,
  hasActiveFilters,
  onMobileFilterOpen,
}: CoursesSortBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileFilterOpen}
          className={`lg:hidden flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition ${
            hasActiveFilters
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>

        {!isLoading && total !== undefined && (
          <p className="text-sm text-gray-500">
            {total.toLocaleString()} result{total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-600 hidden sm:block">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
