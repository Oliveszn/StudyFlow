import apiClient from "@/api/client";
import {
  CreateCourseSchema,
  UpdateCourseSchema,
} from "@/utils/validationSchema";

export type CourseStatus = "published" | "draft";

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  subtitle: string;
  thumbnail: string;
  thumbnailPublicId: string;
  price: number;
  discountPrice?: number;
  currency: string;
  language: string;

  categoryId: string;
  category: {
    name: string;
    slug: string;
  };

  whatYouWillLearn: string[];
  requirements: string[];

  isPublished: boolean;
  publishedAt: string | null;

  enrollmentCount: number;
  reviewCount: number;
  averageRating: number | null;

  duration: number | null;
  previewVideo: string | null;

  instructorId: string;
  createdAt: string;
  updatedAt: string;

  _count: {
    enrollments: number;
    sections: number;
  };
}

export interface CourseDetails extends Course {
  category: {
    name: string;
    slug: string;
  };
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sections?: Array<{
    id: string;
    title: string;
    order: number;
    _count: {
      lessons: number;
    };
  }>;
  _count: {
    enrollments: number;
    sections: number;
  };
}

export interface GetInstructorCoursesParams {
  status?: CourseStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetInstructorCoursesResponse {
  success: boolean;
  data: Course[];
  pagination: PaginationMeta;
}

export interface GetCourseDetailsResponse {
  success: boolean;
  data: CourseDetails;
}

export interface CreateCourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export interface UpdateCourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export interface DeleteCourseResponse {
  success: boolean;
  message: string;
}

export interface PublishCourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export interface UnpublishCourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export const courseApi = {
  getInstructorCourses: async (
    params: GetInstructorCoursesParams,
  ): Promise<GetInstructorCoursesResponse> => {
    const response = await apiClient.get("/api/instructor/courses", {
      params,
    });

    return response.data;
  },

  createCourse: async (formData: FormData): Promise<CreateCourseResponse> => {
    const { data } = await apiClient.post(
      "/api/instructor/courses/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      },
    );

    return data;
  },

  getCourseDetails: async (
    courseId: string,
  ): Promise<GetCourseDetailsResponse> => {
    const response = await apiClient.get(`/api/instructor/courses/${courseId}`);
    return response.data;
  },

  updateCourse: async (
    courseId: string,
    payload: UpdateCourseSchema,
  ): Promise<UpdateCourseResponse> => {
    // const { id, ...rest } = payload;

    const formData = new FormData();
    for (const key in payload) {
      const value = payload[key as keyof typeof payload];
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    }

    const { data } = await apiClient.put(
      `/api/instructor/courses/${courseId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      },
    );

    return data;
  },

  deleteCourse: async (id: string): Promise<DeleteCourseResponse> => {
    const response = await apiClient.delete(`/api/instructor/courses/${id}`);
    return response.data;
  },

  publishCourse: async (id: string): Promise<PublishCourseResponse> => {
    const response = await apiClient.patch(
      `/api/instructor/courses/${id}/publish`,
    );
    return response.data;
  },

  unPublishCourse: async (id: string): Promise<UnpublishCourseResponse> => {
    const response = await apiClient.patch(
      `/api/instructor/courses/${id}/unpublish`,
    );
    return response.data;
  },
};
