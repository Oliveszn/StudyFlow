import apiClient from "../client";

export interface SearchCourse {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  averageRating?: number;
  enrollmentCount?: number;
  category?: { id: string; name: string; slug: string };
  instructor?: { id: string; firstName: string; lastName: string };
  thumbnail?: string;
}

export interface SearchInstructor {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  _count?: { coursesCreated?: number };
}

export interface SearchCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Global search response
export interface GlobalSearchResponse {
  success: boolean;
  query: string;
  data: {
    courses: SearchCourse[];
    instructors: SearchInstructor[];
    totalCourses: number;
    totalInstructors: number;
  };
  pagination: Pagination;
}

// Course-only search response
export interface SearchCoursesResponse {
  success: boolean;
  query: string;
  data: SearchCourse[];
  pagination: Pagination;
}

// Instructor-only search response
export interface SearchInstructorsResponse {
  success: boolean;
  query: string;
  data: SearchInstructor[];
  pagination: Pagination;
}

// Search suggestions response
export interface SearchSuggestionsResponse {
  success: boolean;
  data: {
    courses: SearchCourse[];
    instructors: SearchInstructor[];
    categories: SearchCategory[];
  };
}

export const searchApi = {
  globalSearch: async (
    params: Record<string, any>,
  ): Promise<GlobalSearchResponse> => {
    const { data } = await apiClient.get<GlobalSearchResponse>("/api/search", {
      params,
    });
    return data;
  },

  searchCourses: async (
    params: Record<string, any>,
  ): Promise<SearchCoursesResponse> => {
    const { data } = await apiClient.get<SearchCoursesResponse>(
      "/api/search/courses",
      { params },
    );
    return data;
  },

  searchInstructors: async (
    params: Record<string, any>,
  ): Promise<SearchInstructorsResponse> => {
    const { data } = await apiClient.get<SearchInstructorsResponse>(
      "/api/search/instructors",
      { params },
    );
    return data;
  },

  getSearchSuggestions: async (params: {
    q: string;
    limit?: number;
  }): Promise<SearchSuggestionsResponse> => {
    const { data } = await apiClient.get<SearchSuggestionsResponse>(
      "/api/search/suggestions",
      { params },
    );
    return data;
  },
};
