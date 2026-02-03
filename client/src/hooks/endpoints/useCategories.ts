import { categoriesApi } from "@/api/endpoints/categories";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to get categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCategoryBySlug = (slug?: string) => {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesApi.getCategoryBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryCourses = (params: {
  slug?: string;
  page?: number;
  limit?: number;
  sort?: "popular" | "newest" | "price-low" | "price-high" | "rating";
}) => {
  const { slug, page, limit, sort } = params;

  return useQuery({
    queryKey: ["categoryCourses", slug, page, limit, sort],
    queryFn: () =>
      categoriesApi.getCoursesByCategory({
        slug: slug!,
        page,
        limit,
        sort,
      }),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });
};
