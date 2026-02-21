"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  useCategoryBySlug,
  useCategoryCourses,
} from "@/hooks/endpoints/useCategories";
import CategoryHeader from "@/components/categories/CategoryHeader";
import CategorySort from "@/components/categories/CategorySort";
import CategoryCourseGrid from "@/components/categories/CategoryCourseGrid";
import CategoryPagination from "@/components/categories/CategoryPagination";

export default function CategoryPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") || 1);
  const sort =
    (searchParams.get("sort") as
      | "popular"
      | "newest"
      | "price-low"
      | "price-high"
      | "rating") || "popular";

  const { data: categoryData, isPending: categoryLoading } = useCategoryBySlug(
    slug as string,
  );

  const { data: coursesData, isPending: coursesLoading } = useCategoryCourses({
    slug: slug as string,
    page,
    sort,
    limit: 12,
  });

  return (
    <div className="max-w-7xl px-6 py-10 space-y-8">
      <CategoryHeader loading={categoryLoading} category={categoryData?.data} />

      <CategorySort currentSort={sort} />

      <CategoryCourseGrid
        loading={coursesLoading}
        courses={coursesData?.data.courses || []}
      />

      <CategoryPagination
        currentPage={page}
        totalPages={coursesData?.pagination.pages || 1}
      />
    </div>
  );
}
