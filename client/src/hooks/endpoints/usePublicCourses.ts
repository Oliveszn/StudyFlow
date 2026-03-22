import {
  courseApi,
  CourseCurriculumResponse,
  CourseDetailResponse,
  CourseResponse,
  CourseReviewsResponse,
} from "@/api/endpoints/courses";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all courses with optional filters/pagination
 */
export const useGetCourses = (params?: Record<string, any>) => {
  return useQuery<CourseResponse>({
    queryKey: ["courses", params],
    queryFn: () => courseApi.getCourses(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to fetch a specific course by slug
 */
export const useGetCourseBySlug = (slug: string) => {
  return useQuery<CourseDetailResponse>({
    queryKey: ["course", slug],
    queryFn: () => courseApi.getCourseBySlug(slug),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to fetch course curriculum
 */
export const useGetCourseCurriculum = (slug: string) => {
  return useQuery<CourseCurriculumResponse>({
    queryKey: ["course", slug, "curriculum"],
    queryFn: () => courseApi.getCourseCurriculum(slug),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to fetch all course reviews
 */
export const useGetCourseReviews = (
  slug: string,
  params?: { page?: number; limit?: number; rating?: number },
) => {
  return useQuery<CourseReviewsResponse>({
    queryKey: ["course", slug, "reviews", params],
    queryFn: () => courseApi.getCourseReviews(slug, params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to fetch featured course
 */
export const useGetFeaturedCourses = (limit?: number) => {
  return useQuery<CourseResponse>({
    queryKey: ["courses", "featured", limit],
    queryFn: () => courseApi.getFeaturedCourses(limit),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to fetch trending courses
 */
export const useGetTrendingCourses = (limit?: number) => {
  return useQuery<CourseResponse>({
    queryKey: ["courses", "trending", limit],
    queryFn: () => courseApi.getTrendingCourses(limit),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};
