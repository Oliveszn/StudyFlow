import {
  reviewApi,
  GetCourseReviewsParams,
} from "@/api/endpoints/instructor/reviews";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch course reviews with pagination and filtering
 */
export const useGetCourseReviews = (
  courseId: string,
  params?: GetCourseReviewsParams
) => {
  return useQuery({
    queryKey: ["course", courseId, "reviews", params],
    queryFn: () => reviewApi.getCourseReviews(courseId, params),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to fetch review statistics for a course
 */
export const useGetReviewStats = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId, "reviews", "stats"],
    queryFn: () => reviewApi.getReviewStats(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
