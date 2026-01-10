import apiClient from "@/api/client";
import {
  CreateLessonSchema,
  UpdateLessonSchema,
  ReorderLessonSchema,
  AddAttachmentSchema,
} from "@/utils/validationSchema";

export type LessonType = "VIDEO" | "ARTICLE";

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  addedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  sectionId: string;
  order: number;
  videoUrl?: string;
  videoPublicId?: string;
  videoDuration?: number;
  articleContent?: string;
  isFree: boolean;
  isPublished: boolean;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonDetails extends Lesson {
  section: {
    id: string;
    title: string;
    courseId: string;
    course: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

export interface CreateLessonResponse {
  success: boolean;
  message: string;
  data: Lesson;
}

export interface GetLessonResponse {
  success: boolean;
  data: LessonDetails;
}

export interface UpdateLessonResponse {
  success: boolean;
  message: string;
  data: Lesson;
}

export interface DeleteLessonResponse {
  success: boolean;
  message: string;
}

export interface ReorderLessonsResponse {
  success: boolean;
  message: string;
  data: Lesson[];
}

export interface VideoUploadUrlResponse {
  success: boolean;
  message: string;
  data: {
    uploadUrl: string;
    videoUrl: string;
    expiresIn: number;
  };
}

export interface AddAttachmentResponse {
  success: boolean;
  message: string;
  data: {
    lesson: Lesson;
    attachment: Attachment;
  };
}

export interface DeleteAttachmentResponse {
  success: boolean;
  message: string;
}

export const lessonApi = {
  createLesson: async (
    sectionId: string,
    payload: CreateLessonSchema,
    videoFile?: File
  ): Promise<CreateLessonResponse> => {
    const formData = new FormData();

    for (const key in payload) {
      const value = payload[key as keyof CreateLessonSchema];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    }

    if (videoFile) {
      formData.append("video", videoFile);
    }

    const { data } = await apiClient.post(
      `/api/instructor/sections/${sectionId}/lessons`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return data;
  },

  getLesson: async (lessonId: string): Promise<GetLessonResponse> => {
    const { data } = await apiClient.get(
      `/api/instructor/lessons/${lessonId}`,
      {
        withCredentials: true,
      }
    );
    return data;
  },

  updateLesson: async (
    lessonId: string,
    payload: UpdateLessonSchema,
    videoFile?: File
  ): Promise<UpdateLessonResponse> => {
    const formData = new FormData();

    for (const key in payload) {
      const value = payload[key as keyof UpdateLessonSchema];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    }

    if (videoFile) {
      formData.append("video", videoFile);
    }

    const { data } = await apiClient.put(
      `/api/instructor/lessons/${lessonId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return data;
  },

  deleteLesson: async (lessonId: string): Promise<DeleteLessonResponse> => {
    const { data } = await apiClient.delete(
      `/api/instructor/lessons/${lessonId}`,
      {
        withCredentials: true,
      }
    );
    return data;
  },

  reorderLessons: async (
    sectionId: string,
    payload: ReorderLessonSchema
  ): Promise<ReorderLessonsResponse> => {
    const { data } = await apiClient.patch(
      `/api/instructor/sections/${sectionId}/lessons/reorder`,
      payload,
      {
        withCredentials: true,
      }
    );
    return data;
  },

  generateVideoUploadUrl: async (
    lessonId: string,
    fileName: string,
    fileType: string
  ): Promise<VideoUploadUrlResponse> => {
    const { data } = await apiClient.post(
      `/api/instructor/lessons/${lessonId}/upload-video`,
      { fileName, fileType },
      {
        withCredentials: true,
      }
    );
    return data;
  },

  addAttachment: async (
    lessonId: string,
    payload: AddAttachmentSchema
  ): Promise<AddAttachmentResponse> => {
    const { data } = await apiClient.post(
      `/api/instructor/lessons/${lessonId}/attachments`,
      payload,
      {
        withCredentials: true,
      }
    );
    return data;
  },

  deleteAttachment: async (
    lessonId: string,
    attachmentId: string
  ): Promise<DeleteAttachmentResponse> => {
    const { data } = await apiClient.delete(
      `/api/instructor/lessons/${lessonId}/attachments/${attachmentId}`,
      {
        withCredentials: true,
      }
    );
    return data;
  },
};
