import apiClient from "@/api/client";

export interface Enrollment {
  id: string;
  courseId: string;
  pricePaid: number;
  currency: string;
  status: string;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    instructor: {
      firstName: string;
      lastName: string;
    };
    _count?: {
      sections: number;
    };
    sections?: Section[];
  };
}

export interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: string;
  order: number;
  videoDuration: number;
  isFree: boolean;
}

export interface EnrollmentListResponse {
  success: boolean;
  data: Enrollment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface EnrollmentDetailsResponse {
  success: boolean;
  data: Enrollment & { completedLessonIds: string[] };
}

export const enrollmentApi = {
  getEnrollments: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<EnrollmentListResponse> => {
    const { data } = await apiClient.get<EnrollmentListResponse>(
      "/api/student/enrollments",
      { params },
    );
    return data;
  },

  enrollInCourse: async (
    courseId: string,
  ): Promise<{ success: boolean; message: string; data: Enrollment }> => {
    const { data } = await apiClient.post("/api/student/enrollments", {
      courseId,
    });
    return data;
  },

  getEnrollmentDetails: async (
    id: string,
  ): Promise<EnrollmentDetailsResponse> => {
    const { data } = await apiClient.get<EnrollmentDetailsResponse>(
      `/api/student/enrollments/${id}`,
    );
    return data;
  },
};
