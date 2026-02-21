import { enrollmentApi, EnrollmentDetailsResponse, EnrollmentListResponse } from "@/api/endpoints/student/enrollments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


// Fetch user enrollments
export const useEnrollments = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery<EnrollmentListResponse>({
    queryKey: ["enrollments", params],
    queryFn: () => enrollmentApi.getEnrollments(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Enroll in a course
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

// Get enrollment details
export const useEnrollmentDetails = (id: string) => {
  return useQuery<EnrollmentDetailsResponse>({
    queryKey: ["enrollment", id],
    queryFn: () => enrollmentApi.getEnrollmentDetails(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
