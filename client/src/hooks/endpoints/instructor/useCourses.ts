import {
  courseApi,
  GetInstructorCoursesParams,
} from "@/api/endpoints/instructor/courses";
import { handleApiError } from "@/utils/apiError";
import {
  CreateCourseSchema,
  UpdateCourseSchema,
} from "@/utils/validationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to get all courses for instructors
 */
export const useGetInstructorCourse = (params: GetInstructorCoursesParams) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => courseApi.getInstructorCourses(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to create a new course
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: CreateCourseSchema) => courseApi.createCourse(form),

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to get a particular course details
 */
export const useGetCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseApi.getCourseDetails(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to update a course
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      form,
    }: {
      courseId: string;
      form: UpdateCourseSchema;
    }) => courseApi.updateCourse(courseId, form),

    onSuccess: (data, courseId) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to delete course
 */
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseApi.deleteCourse(id),

    onSuccess: (data, id) => {
      toast.success(data.message || "Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.removeQueries({ queryKey: ["course", id] });
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

/**
 * Hook to publish course
 */
export const usePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseApi.publishCourse(id),

    onSuccess: (data) => {
      toast.success(data.message || "Course published successfully");

      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },

    onError: (error: unknown) => {
      toast.error(handleApiError(error));
    },
  });
};

/**
 * Hook to unpublish a course
 */
export const useUnPublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseApi.unPublishCourse(id),

    onSuccess: (data) => {
      toast.success(data.message || "Course unpublished successfully");

      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },

    onError: (error: unknown) => {
      toast.error(handleApiError(error));
    },
  });
};
