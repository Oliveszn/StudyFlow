import { sectionApi } from "@/api/endpoints/instructor/section";
import { handleApiError } from "@/utils/apiError";
import {
  CreateSectionSchema,
  UpdateSectionSchema,
  ReorderSectionSchema,
} from "@/utils/validationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to create a new section for a course
 */
export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      form,
    }: {
      courseId: string;
      form: CreateSectionSchema;
    }) => sectionApi.createSection(courseId, form),

    onSuccess: (data, { courseId }) => {
      toast.success(data.message || "Section created successfully");
      queryClient.invalidateQueries({
        queryKey: ["course", courseId, "sections"],
      });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to fetch section details by ID
 */
export const useGetSection = (sectionId: string) => {
  return useQuery({
    queryKey: ["section", sectionId],
    queryFn: () => sectionApi.getSection(sectionId),
    enabled: !!sectionId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to update a section
 */
export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      form,
    }: {
      sectionId: string;
      form: UpdateSectionSchema;
    }) => sectionApi.updateSection(sectionId, form),

    onSuccess: (data, { sectionId }) => {
      toast.success(data.message || "Section updated successfully");
      queryClient.invalidateQueries({ queryKey: ["section", sectionId] });

      const sectionData = queryClient.getQueryData<{
        data: { courseId: string };
      }>(["section", sectionId]);
      if (sectionData?.data?.courseId) {
        queryClient.invalidateQueries({
          queryKey: ["course", sectionData.data.courseId, "sections"],
        });
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
 * Hook to delete a section
 */
export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      courseId,
    }: {
      sectionId: string;
      courseId: string;
    }) => sectionApi.deleteSection(sectionId),

    onSuccess: (data, { sectionId, courseId }) => {
      toast.success(data.message || "Section deleted successfully");
      queryClient.removeQueries({ queryKey: ["section", sectionId] });
      queryClient.invalidateQueries({
        queryKey: ["course", courseId, "sections"],
      });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to reorder sections in a course
 */
export const useReorderSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      form,
    }: {
      courseId: string;
      form: ReorderSectionSchema;
    }) => sectionApi.reorderSections(courseId, form),

    onSuccess: (data, { courseId }) => {
      toast.success(data.message || "Sections reordered successfully");
      queryClient.invalidateQueries({
        queryKey: ["course", courseId, "sections"],
      });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};
