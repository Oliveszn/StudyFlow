import apiClient from "@/api/client";
import {
  Enrollment,
  EnrollmentDetailsResponse,
  EnrollmentListResponse,
} from "@/api/endpoints/student/enrollments";

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
