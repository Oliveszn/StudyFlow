import apiClient from "../client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  averageRating?: number | null;
  enrollmentCount: number;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

export interface CategoryCoursesResponse {
  success: boolean;
  data: {
    category: {
      id: string;
      name: string;
      slug: string;
    };
    courses: Course[];
  };
  pagination: Pagination;
}

export const categoriesApi = {
  getCategories: async () => {
    const { data } =
      await apiClient.get<CategoriesResponse>("/api/categories/");
    return data.data;
  },

  getCategoryBySlug: async (slug: string) => {
    const { data } = await apiClient.get<CategoryResponse>(
      `/api/categories/${slug}`,
    );
    return data;
  },

  getCoursesByCategory: async (params: {
    slug: string;
    page?: number;
    limit?: number;
    sort?: "popular" | "newest" | "price-low" | "price-high" | "rating";
  }) => {
    const { slug, page = 1, limit = 12, sort = "popular" } = params;

    const { data } = await apiClient.get<CategoryCoursesResponse>(
      `/api/categories/${slug}/courses`,
      {
        params: { page, limit, sort },
      },
    );

    return data;
  },
};
