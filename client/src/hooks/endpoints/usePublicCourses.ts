import {
  courseApi,
  CourseCurriculumResponse,
  CourseDetailResponse,
  CourseResponse,
  CourseReviewsResponse,
} from "@/api/endpoints/courses";
import { useQuery } from "@tanstack/react-query";

// Fetch all courses with optional filters/pagination
export const useGetCourses = (params?: Record<string, any>) => {
  return useQuery<CourseResponse>({
    queryKey: ["courses", params],
    queryFn: () => courseApi.getCourses(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Fetch single course by slug
export const useGetCourseBySlug = (slug: string) => {
  return useQuery<CourseDetailResponse>({
    queryKey: ["course", slug],
    queryFn: () => courseApi.getCourseBySlug(slug),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Fetch course curriculum
export const useGetCourseCurriculum = (slug: string) => {
  return useQuery<CourseCurriculumResponse>({
    queryKey: ["course", slug, "curriculum"],
    queryFn: () => courseApi.getCourseCurriculum(slug),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Fetch course reviews
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

// Fetch featured courses
export const useGetFeaturedCourses = (limit?: number) => {
  return useQuery<CourseResponse>({
    queryKey: ["courses", "featured", limit],
    queryFn: () => courseApi.getFeaturedCourses(limit),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Fetch trending courses
export const useGetTrendingCourses = (limit?: number) => {
  return useQuery<CourseResponse>({
    queryKey: ["courses", "trending", limit],
    queryFn: () => courseApi.getTrendingCourses(limit),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};
