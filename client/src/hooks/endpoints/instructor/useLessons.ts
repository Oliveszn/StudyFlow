import { lessonApi } from "@/api/endpoints/instructor/lessons";
import { handleApiError } from "@/utils/apiError";
import {
  CreateLessonSchema,
  UpdateLessonSchema,
  ReorderLessonSchema,
  AddAttachmentSchema,
} from "@/utils/validationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to create a new lesson in a section
 */
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      form,
      videoFile,
    }: {
      sectionId: string;
      form: CreateLessonSchema;
      videoFile?: File;
    }) => lessonApi.createLesson(sectionId, form, videoFile),

    onSuccess: (data, { sectionId }) => {
      toast.success(data.message || "Lesson created successfully");

      queryClient.invalidateQueries({ queryKey: ["section", sectionId] });

      const sectionData = queryClient.getQueryData<{
        data: { courseId: string };
      }>(["section", sectionId]);
      if (sectionData?.data?.courseId) {
        queryClient.invalidateQueries({
          queryKey: ["course", sectionData.data.courseId],
        });
      }
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to fetch lesson details by ID
 */
export const useGetLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => lessonApi.getLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to update a lesson
 */
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      form,
      videoFile,
    }: {
      lessonId: string;
      form: UpdateLessonSchema;
      videoFile?: File;
    }) => lessonApi.updateLesson(lessonId, form, videoFile),

    onSuccess: (data, { lessonId }) => {
      toast.success(data.message || "Lesson updated successfully");

      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });

      const lessonData = queryClient.getQueryData<{
        data: { sectionId: string; section: { courseId: string } };
      }>(["lesson", lessonId]);

      if (lessonData?.data) {
        const { sectionId, section } = lessonData.data;
        queryClient.invalidateQueries({ queryKey: ["section", sectionId] });

        if (section?.courseId) {
          queryClient.invalidateQueries({
            queryKey: ["course", section.courseId],
          });
        }
      }
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to delete a lesson
 */
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      sectionId,
      courseId,
    }: {
      lessonId: string;
      sectionId: string;
      courseId: string;
    }) => lessonApi.deleteLesson(lessonId),

    onSuccess: (data, { lessonId, sectionId, courseId }) => {
      toast.success(data.message || "Lesson deleted successfully");

      queryClient.removeQueries({ queryKey: ["lesson", lessonId] });

      queryClient.invalidateQueries({ queryKey: ["section", sectionId] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to reorder lessons in a section
 */
export const useReorderLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      form,
    }: {
      sectionId: string;
      form: ReorderLessonSchema;
    }) => lessonApi.reorderLessons(sectionId, form),

    onSuccess: (data, { sectionId }) => {
      toast.success(data.message || "Lessons reordered successfully");

      queryClient.invalidateQueries({ queryKey: ["section", sectionId] });

      const sectionData = queryClient.getQueryData<{
        data: { courseId: string };
      }>(["section", sectionId]);

      if (sectionData?.data?.courseId) {
        queryClient.invalidateQueries({
          queryKey: ["course", sectionData.data.courseId],
        });
      }
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to generate a video upload URL (for direct upload to storage)
 */
export const useGenerateVideoUploadUrl = () => {
  return useMutation({
    mutationFn: ({
      lessonId,
      fileName,
      fileType,
    }: {
      lessonId: string;
      fileName: string;
      fileType: string;
    }) => lessonApi.generateVideoUploadUrl(lessonId, fileName, fileType),

    onSuccess: (data) => {
      toast.success(data.message || "Upload URL generated successfully");
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to add an attachment to a lesson
 */
export const useAddAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      form,
    }: {
      lessonId: string;
      form: AddAttachmentSchema;
    }) => lessonApi.addAttachment(lessonId, form),

    onSuccess: (data, { lessonId }) => {
      toast.success(data.message || "Attachment added successfully");

      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });

      const lessonData = queryClient.getQueryData<{
        data: { sectionId: string; section: { courseId: string } };
      }>(["lesson", lessonId]);

      if (lessonData?.data) {
        queryClient.invalidateQueries({
          queryKey: ["section", lessonData.data.sectionId],
        });

        if (lessonData.data.section?.courseId) {
          queryClient.invalidateQueries({
            queryKey: ["course", lessonData.data.section.courseId],
          });
        }
      }
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to delete an attachment from a lesson
 */
export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      attachmentId,
    }: {
      lessonId: string;
      attachmentId: string;
    }) => lessonApi.deleteAttachment(lessonId, attachmentId),

    onSuccess: (data, { lessonId }) => {
      toast.success(data.message || "Attachment deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });

      const lessonData = queryClient.getQueryData<{
        data: { sectionId: string; section: { courseId: string } };
      }>(["lesson", lessonId]);

      if (lessonData?.data) {
        queryClient.invalidateQueries({
          queryKey: ["section", lessonData.data.sectionId],
        });

        if (lessonData.data.section?.courseId) {
          queryClient.invalidateQueries({
            queryKey: ["course", lessonData.data.section.courseId],
          });
        }
      }
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};
