"use client";

import { useState, useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useGetCourses } from "@/hooks/endpoints/usePublicCourses";
import CoursesPageHeader from "@/components/course/listing/CoursesPageHeader";
import CoursesFilterSidebar from "@/components/course/listing/CoursesFilterSidebar";
import CoursesSortBar from "@/components/course/listing/CoursesSortBar";
import CoursesGrid from "@/components/course/listing/CoursesGrid";

export interface CourseFilters {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  language: string;
  sort: string;
  page: number;
}

const DEFAULT_FILTERS: CourseFilters = {
  search: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  rating: "",
  language: "",
  sort: "popular",
  page: 1,
};

export default function CoursesPage() {
  const [filters, setFilters] = useState<CourseFilters>(DEFAULT_FILTERS);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Strip empty values before sending to API
  const activeParams = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, v]) => (v !== "" && v !== 1) || _ === "page",
    ),
  );

  const { data, isLoading, error } = useGetCourses(activeParams);

  const updateFilter = useCallback(
    <K extends keyof CourseFilters>(key: K, value: CourseFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        // Reset to page 1 on any filter change (except page itself)
        ...(key !== "page" ? { page: 1 } : {}),
      }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.categoryId !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.rating !== "" ||
    filters.language !== "" ||
    filters.search !== "";

  return (
    <div className="min-h-screen bg-gray-50">
      <CoursesPageHeader
        search={filters.search}
        onSearchChange={(v) => updateFilter("search", v)}
        total={data?.pagination?.total}
        isLoading={isLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <CoursesFilterSidebar
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <CoursesSortBar
              sort={filters.sort}
              onSortChange={(v) => updateFilter("sort", v)}
              total={data?.pagination?.total}
              isLoading={isLoading}
              hasActiveFilters={hasActiveFilters}
              onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
            />

            <CoursesGrid
              data={data}
              isLoading={isLoading}
              error={error}
              filters={filters}
              onPageChange={(p) => updateFilter("page", p)}
              onReset={resetFilters}
            />
          </div>
        </div>
      </div>

      {isMobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:hidden overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <CoursesFilterSidebar
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
