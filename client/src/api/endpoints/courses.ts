import apiClient from "../client";

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  averageRating: number;
  enrollmentCount: number;
  category: CourseCategory;
  instructor: Instructor;
  _count?: {
    enrollments?: number;
    reviews?: number;
    sections?: number;
  };
  thumbnail?: string;
  discountPrice?: number;
  subtitle?: string;
  isPublished: boolean;
  language: string;
  updatedAt: string;
  requirements?: string[];
  whatYouWillLearn?: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CourseResponse {
  success: boolean;
  data: Course[];
  pagination?: Pagination;
}

export interface CourseDetailResponse {
  success: boolean;
  data: Course & {
    lessonCount: number;
  };
}

export interface CourseCurriculumLesson {
  id: string;
  title: string;
  description: string;
  type: string;
  order: number;
  videoDuration: number;
  isFree: boolean;
  isPublished: boolean;
}

export interface CourseCurriculumSection {
  id: string;
  title: string;
  order: number;
  lessons: CourseCurriculumLesson[];
  _count: { lessons: number };
}

export interface CourseCurriculumResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    slug: string;
    sections: CourseCurriculumSection[];
    totalDuration: number;
    totalSections: number;
    totalLessons: number;
  };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CourseReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: Pagination;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export const courseApi = {
  getCourses: async (params?: Record<string, any>): Promise<CourseResponse> => {
    const { data } = await apiClient.get<CourseResponse>("/api/courses", {
      params,
    });
    return data;
  },

  getCourseBySlug: async (slug: string): Promise<CourseDetailResponse> => {
    const { data } = await apiClient.get<CourseDetailResponse>(
      `/api/courses/${slug}`,
    );
    return data;
  },

  getCourseCurriculum: async (
    slug: string,
  ): Promise<CourseCurriculumResponse> => {
    const { data } = await apiClient.get<CourseCurriculumResponse>(
      `/api/courses/${slug}/curriculum`,
    );
    return data;
  },

  getCourseReviews: async (
    slug: string,
    params?: { page?: number; limit?: number; rating?: number },
  ): Promise<CourseReviewsResponse> => {
    const { data } = await apiClient.get<CourseReviewsResponse>(
      `/api/courses/${slug}/reviews`,
      { params },
    );
    return data;
  },

  getFeaturedCourses: async (limit?: number): Promise<CourseResponse> => {
    const { data } = await apiClient.get<CourseResponse>(
      "/api/courses/featured",
      {
        params: { limit },
      },
    );
    return data;
  },

  getTrendingCourses: async (limit?: number): Promise<CourseResponse> => {
    const { data } = await apiClient.get<CourseResponse>(
      "/api/courses/trending",
      {
        params: { limit },
      },
    );
    return data;
  },
};
