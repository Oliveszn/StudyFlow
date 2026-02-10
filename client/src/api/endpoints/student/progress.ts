import apiClient from "@/api/client";

export interface Lesson {
  id: string;
  title: string;
  type: "VIDEO" | "ARTICLE" | "QUIZ";
  sectionId: string;
  isFree: boolean;
  videoUrl?: string;
}

export interface LessonProgress {
  id: string;
  lessonId: string;
  userId: string;
  isCompleted: boolean;
  completedAt?: string;
  watchedDuration?: number;
  lastAccessedAt?: string;
  lesson: Lesson;
}

export interface CourseProgress {
  enrollmentId: string;
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastAccessedAt: string | null;
  lessonProgress: LessonProgress[];
}

export interface StudentDashboard {
  stats: {
    totalEnrolled: number;
    totalCompleted: number;
    totalInProgress: number;
  };
  continueWatching: {
    id: string;
    course: {
      id: string;
      title: string;
      slug: string;
      thumbnail: string;
      instructor: {
        firstName: string;
        lastName: string;
      };
    };
    lastAccessedAt: string | null;
    progress: number;
  }[];
  recentlyCompleted: LessonProgress[];
}

export interface LessonVideoUrl {
  videoUrl: string;
  expiresIn: number;
}

export const progressApi = {
  getCourseProgress: async (courseId: string): Promise<CourseProgress> => {
    const { data } = await apiClient.get(
      `/api/student/courses/${courseId}/progress`,
    );
    return data.data;
  },

  getLesson: async (
    lessonId: string,
  ): Promise<{
    lesson: LessonProgress["lesson"];
    progress: LessonProgress;
  }> => {
    const { data } = await apiClient.get(`/api/student/lessons/${lessonId}`);
    return data.data;
  },

  getLessonVideoUrl: async (lessonId: string): Promise<LessonVideoUrl> => {
    const { data } = await apiClient.get(
      `/api/student/lessons/${lessonId}/video-url`,
    );
    return data.data;
  },

  markLessonComplete: async (
    lessonId: string,
  ): Promise<{ progress: LessonProgress; courseProgress: number }> => {
    const { data } = await apiClient.post(
      `/api/student/lessons/${lessonId}/complete`,
    );
    return data.data;
  },

  updateVideoProgress: async (
    lessonId: string,
    watchedDuration: number,
  ): Promise<LessonProgress> => {
    const { data } = await apiClient.put(
      `/api/student/lessons/${lessonId}/progress`,
      { watchedDuration },
    );
    return data.data;
  },

  getStudentDashboard: async (): Promise<StudentDashboard> => {
    const { data } = await apiClient.get(`/api/student/dashboard`);
    return data.data;
  },
};
