import apiClient from "@/api/client";
import {
  CreateSectionSchema,
  UpdateSectionSchema,
  ReorderSectionSchema,
} from "@/utils/validationSchema";
import { Lesson } from "./lessons";

export interface Section {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    lessons: number;
  };
}

export interface SectionDetails extends Section {
  course: {
    id: string;
    title: string;
    slug: string;
    instructorId: string;
  };
  // lessons: Array<{
  //   id: string;
  //   title: string;
  //   order: number;
  // }>;
  lessons: Lesson[];
}

export interface CreateSectionResponse {
  success: boolean;
  message: string;
  data: Section;
}

export interface GetSectionResponse {
  success: boolean;
  data: SectionDetails;
}

export interface UpdateSectionResponse {
  success: boolean;
  message: string;
  data: Section;
}

export interface DeleteSectionResponse {
  success: boolean;
  message: string;
}

export interface ReorderSectionsResponse {
  success: boolean;
  message: string;
  data: Section[];
}

export const sectionApi = {
  createSection: async (
    courseId: string,
    payload: CreateSectionSchema,
  ): Promise<CreateSectionResponse> => {
    const { data } = await apiClient.post(
      `/api/instructor/courses/${courseId}/sections`,
      payload,
      {
        withCredentials: true,
      },
    );
    return data;
  },

  getSection: async (sectionId: string): Promise<GetSectionResponse> => {
    const { data } = await apiClient.get(
      `/api/instructor/sections/${sectionId}`,
      {
        withCredentials: true,
      },
    );
    return data;
  },

  updateSection: async (
    sectionId: string,
    payload: UpdateSectionSchema,
  ): Promise<UpdateSectionResponse> => {
    const { data } = await apiClient.put(
      `/api/instructor/sections/${sectionId}`,
      payload,
      {
        withCredentials: true,
      },
    );
    return data;
  },

  deleteSection: async (sectionId: string): Promise<DeleteSectionResponse> => {
    const { data } = await apiClient.delete(
      `/api/instructor/sections/${sectionId}`,
      {
        withCredentials: true,
      },
    );
    return data;
  },

  reorderSections: async (
    courseId: string,
    payload: ReorderSectionSchema,
  ): Promise<ReorderSectionsResponse> => {
    const { data } = await apiClient.patch(
      `/api/instructor/courses/${courseId}/sections/reorder`,
      payload,
      {
        withCredentials: true,
      },
    );
    return data;
  },
};
