import {
  CourseProgress,
  LessonProgress,
  LessonVideoUrl,
  progressApi,
  StudentDashboard,
} from "@/api/endpoints/student/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to get course progress for a user
 */
export const useCourseProgress = (courseId: string) =>
  useQuery<CourseProgress>({
    queryKey: ["course-progress", courseId],
    queryFn: () => progressApi.getCourseProgress(courseId),
    staleTime: 2 * 60 * 1000,
  });

/**
 * Hook to get lesson details
 */
export const useLesson = (lessonId: string) =>
  useQuery<{ lesson: LessonProgress["lesson"]; progress: LessonProgress }>({
    queryKey: ["lesson", lessonId],
    queryFn: () => progressApi.getLesson(lessonId),
    staleTime: 2 * 60 * 1000,
    enabled: !!lessonId,
  });

/**
 * Hook to get a video url
 */
export const useLessonVideoUrl = (lessonId: string) =>
  useQuery<LessonVideoUrl>({
    queryKey: ["lesson-video-url", lessonId],
    queryFn: () => progressApi.getLessonVideoUrl(lessonId),
    staleTime: 60 * 60 * 1000,
  });

/**
 * Hook to mark a lesson as complete
 */
export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => progressApi.markLessonComplete(lessonId),
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["course-progress"] });
    },
  });
};

/**
 * Hook to updtae video progress
 */
export const useUpdateVideoProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      watchedDuration,
    }: {
      lessonId: string;
      watchedDuration: number;
    }) => progressApi.updateVideoProgress(lessonId, watchedDuration),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["course-progress"] });
    },
  });
};

export const useStudentDashboard = () =>
  useQuery<StudentDashboard>({
    queryKey: ["student-dashboard"],
    queryFn: () => progressApi.getStudentDashboard(),
    staleTime: 5 * 60 * 1000,
  });
