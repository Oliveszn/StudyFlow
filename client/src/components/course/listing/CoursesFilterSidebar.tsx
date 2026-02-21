"use client";

import type { CourseFilters } from "@/app/courses/page";
import { useCategories } from "@/hooks/endpoints/useCategories";

interface CoursesFilterSidebarProps {
  filters: CourseFilters;
  onFilterChange: <K extends keyof CourseFilters>(
    key: K,
    value: CourseFilters[K],
  ) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const PRICE_RANGES = [
  { label: "Free", min: "0", max: "0" },
  { label: "Under ₦200", min: "0", max: "200" },
  { label: "₦200 – ₦500", min: "200", max: "500" },
  { label: "₦500 – ₦1000", min: "500", max: "1000" },
  { label: "Over ₦1000", min: "1000", max: "" },
];

const RATINGS = [
  { label: "4.5 & up", value: "4.5" },
  { label: "4.0 & up", value: "4.0" },
  { label: "3.5 & up", value: "3.5" },
  { label: "3.0 & up", value: "3.0" },
];

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Portuguese", value: "pt" },
];

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="py-4 border-b border-gray-200 last:border-0">
    <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
    {children}
  </div>
);

export default function CoursesFilterSidebar({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
}: CoursesFilterSidebarProps) {
  const activePriceRange = PRICE_RANGES.find(
    (r) => r.min === filters.minPrice && r.max === filters.maxPrice,
  );

  const { data: categoriesData } = useCategories();
  const CATEGORIES = categoriesData ?? [];

  const handlePriceRange = (min: string, max: string) => {
    const isActive = filters.minPrice === min && filters.maxPrice === max;
    onFilterChange("minPrice", isActive ? "" : min);
    onFilterChange("maxPrice", isActive ? "" : max);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-700 transition"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Category">
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={filters.categoryId === cat.id}
                onChange={() =>
                  onFilterChange(
                    "categoryId",
                    filters.categoryId === cat.id ? "" : cat.id,
                  )
                }
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-2">
          {RATINGS.map((r) => (
            <label
              key={r.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.rating === r.value}
                onChange={() =>
                  onFilterChange(
                    "rating",
                    filters.rating === r.value ? "" : r.value,
                  )
                }
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                ⭐ {r.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const isActive =
              filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <label
                key={range.label}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="price"
                  checked={isActive}
                  onChange={() => handlePriceRange(range.min, range.max)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Language">
        <div className="space-y-2">
          {LANGUAGES.map((lang) => (
            <label
              key={lang.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="language"
                checked={filters.language === lang.value}
                onChange={() =>
                  onFilterChange(
                    "language",
                    filters.language === lang.value ? "" : lang.value,
                  )
                }
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                {lang.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
