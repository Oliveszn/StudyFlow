import apiClient from "@/api/client";

export interface WishlistItem {
  id: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    slug: string;
    subtitle?: string;
    thumbnail: string;
    price?: number;
    discountPrice?: number;
    currency?: string;
    averageRating?: number;
    reviewCount?: number;
    enrollmentCount?: number;
    duration?: number;
    isPublished: boolean;
    instructor: {
      id?: string;
      firstName: string;
      lastName: string;
    };
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface WishlistListResponse {
  success: boolean;
  data: WishlistItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface WishlistCheckResponse {
  success: boolean;
  data: {
    inWishlist: boolean;
    wishlistId: string | null;
  };
}

export const wishlistApi = {
  getWishlist: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<WishlistListResponse> => {
    const { data } = await apiClient.get<WishlistListResponse>(
      "/api/student/wishlist",
      { params },
    );
    return data;
  },

  addToWishlist: async (
    courseId: string,
  ): Promise<{ success: boolean; message: string; data: WishlistItem }> => {
    const { data } = await apiClient.post("/api/student/wishlist", {
      courseId,
    });
    return data;
  },

  removeFromWishlist: async (
    courseId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete(
      `/api/student/wishlist/${courseId}`,
    );
    return data;
  },

  checkInWishlist: async (courseId: string): Promise<WishlistCheckResponse> => {
    const { data } = await apiClient.get<WishlistCheckResponse>(
      `/api/student/wishlist/check/${courseId}`,
    );
    return data;
  },

  clearWishlist: async (): Promise<{
    success: boolean;
    message: string;
    data: { deletedCount: number };
  }> => {
    const { data } = await apiClient.delete("/api/student/wishlist");
    return data;
  },
};
