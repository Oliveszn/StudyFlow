import {
  enrollmentApi,
  EnrollmentDetailsResponse,
  EnrollmentListResponse,
} from "@/api/endpoints/student/enrollments";
import { useAppSelector } from "@/store/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to fetch user enrollments
 */
export const useEnrollments = (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<EnrollmentListResponse>({
    queryKey: ["enrollments", params],
    queryFn: () => enrollmentApi.getEnrollments(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to let users enroll in a course
 */
export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => enrollmentApi.enrollInCourse(courseId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Enrollment failed");
    },
  });
};

/**
 * Hook to get enrollment details
 */
export const useEnrollmentDetails = (id: string) => {
  return useQuery<EnrollmentDetailsResponse>({
    queryKey: ["enrollment", id],
    queryFn: () => enrollmentApi.getEnrollmentDetails(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to check enrollment status
 */
export const useCheckEnrollment = (courseId: string) => {
  const { user } = useAppSelector((state) => state.auth);
  return useQuery({
    queryKey: ["enrollment-check", courseId],
    queryFn: () => enrollmentApi.checkEnrollment(courseId),
    enabled: !!user && !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};
