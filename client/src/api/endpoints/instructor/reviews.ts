import apiClient from "@/api/client";

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  courseId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

export interface GetCourseReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetCourseReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: PaginationMeta;
}

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ReviewStatsData {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution;
  percentages: Record<string, number>;
}

export interface GetReviewStatsResponse {
  success: boolean;
  data: ReviewStatsData;
}

export const reviewApi = {
  getCourseReviews: async (
    courseId: string,
    params?: GetCourseReviewsParams
  ): Promise<GetCourseReviewsResponse> => {
    const { data } = await apiClient.get(
      `/api/instructor/courses/${courseId}/reviews`,
      {
        params,
        withCredentials: true,
      }
    );
    return data;
  },

  getReviewStats: async (courseId: string): Promise<GetReviewStatsResponse> => {
    const { data } = await apiClient.get(
      `/api/instructor/courses/${courseId}/reviews/stats`,
      {
        withCredentials: true,
      }
    );
    return data;
  },
};
