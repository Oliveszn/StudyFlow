import apiClient from "@/api/client";

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  course?: {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string;
  };
}

export interface PaginatedReviews {
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const reviewsApi = {
  getMyReviews: async (page = 1, limit = 10): Promise<PaginatedReviews> => {
    const { data } = await apiClient.get(`/api/student/reviews`, {
      params: { page, limit },
    });
    return data;
  },

  getMyReviewForCourse: async (courseId: string): Promise<Review | null> => {
    try {
      const { data } = await apiClient.get(
        `/api/student/courses/${courseId}/my-review`,
      );
      return data.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  createReview: async (
    courseId: string,
    rating: number,
    comment: string,
  ): Promise<Review> => {
    const { data } = await apiClient.post(
      `/api/student/courses/${courseId}/reviews`,
      { rating, comment },
    );
    return data.data;
  },

  updateReview: async (
    reviewId: string,
    rating: number,
    comment: string,
  ): Promise<Review> => {
    const { data } = await apiClient.put(`/api/student/reviews/${reviewId}`, {
      rating,
      comment,
    });
    return data.data;
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/api/student/reviews/${reviewId}`);
  },
};
