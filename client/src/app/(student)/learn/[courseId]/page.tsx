"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

import { BookOpen } from "lucide-react";
import { useEnrollmentDetails } from "@/hooks/endpoints/student/useEnrollments";
import { useCourseProgress } from "@/hooks/endpoints/student/useProgress";
import LessonArticleContent from "@/components/student/player/LessonArticleContent";
import LessonVideoPlayer from "@/components/student/player/LessonVideoPlayer";
import CoursePlayerHeader from "@/components/student/player/CoursePlayerHeader";
import LessonCompleteButton from "@/components/student/player/LessonCompleteButton";
import NextLessonButton from "@/components/student/player/NextLessonButton";
import CoursePlayerSidebar from "@/components/student/player/CoursePlayerSidebar";
import { Lesson, Section } from "@/api/endpoints/student/enrollments";

export default function CoursePlayerPage() {
  const params = useParams();
  // const enrollmentId = params.courseId as string;
  const courseId = params.courseId as string;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const { data: enrollment, isLoading } = useEnrollmentDetails(courseId);
  const { data: courseProgress } = useCourseProgress(courseId);

  const sections: Section[] = enrollment?.data?.course?.sections ?? [];

  // Flat list of all lessons across sections for sequential navigation
  const allLessons = useMemo<Lesson[]>(
    () =>
      sections.flatMap((section) =>
        (section.lessons ?? []).map((lesson) => ({
          ...lesson,
          sectionTitle: section.title,
        })),
      ),
    [sections],
  );

  // Auto-select first incomplete lesson on mount
  useEffect(() => {
    if (!allLessons.length || activeLessonId) return;

    const completedIds = new Set<string>(
      (courseProgress?.lessonProgress ?? []).map(
        (l: string | { id: string }) => (typeof l === "string" ? l : l.id),
      ),
    );

    const firstIncomplete = allLessons.find((l) => !completedIds.has(l.id));
    const target = firstIncomplete ?? allLessons[0];
    setActiveLessonId(target.id);
    setActiveLesson(target);
  }, [allLessons, courseProgress, activeLessonId]);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    setActiveLesson(lesson);
  };

  const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const hasNext = currentIndex < allLessons.length - 1;

  const handleNextLesson = () => {
    if (hasNext) handleSelectLesson(allLessons[currentIndex + 1]);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e11]">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
          <p className="text-sm text-white/40">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e11] text-white/40">
        <div className="space-y-2 text-center">
          <BookOpen className="mx-auto h-10 w-10 opacity-30" />
          <p className="text-sm">
            Course not found or you&apos;re not enrolled.
          </p>
        </div>
      </div>
    );
  }

  const course = enrollment.data?.course;
  const isArticle = activeLesson?.type === "ARTICLE";
  console.log(allLessons);
  return (
    <div className="flex min-h-screen flex-col bg-[#0e0e11] text-white">
      <CoursePlayerHeader
        courseTitle={course?.title}
        progress={courseProgress?.progressPercentage ?? 0}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto">
          {activeLesson && activeLessonId ? (
            <>
              {isArticle ? (
                <LessonArticleContent lessonId={activeLessonId} />
              ) : (
                <LessonVideoPlayer
                  lessonId={activeLessonId}
                  onComplete={handleNextLesson}
                />
              )}

              <div className="flex items-center justify-between border-t border-white/5 bg-[#0e0e11] px-6 py-4">
                <div>
                  <h2 className="text-sm font-semibold">
                    {activeLesson.title}
                  </h2>
                  {activeLesson.sectionTitle && (
                    <p className="mt-0.5 text-xs text-white/35">
                      {activeLesson.sectionTitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <LessonCompleteButton lessonId={activeLessonId} />
                  {hasNext && <NextLessonButton onClick={handleNextLesson} />}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-white/30">
              Select a lesson to begin
            </div>
          )}
        </div>

        {sidebarOpen && (
          <CoursePlayerSidebar
            sections={sections}
            activeLessonId={activeLessonId}
            completedLessonIds={
              courseProgress?.lessonProgress
                .filter((l) => l.isCompleted)
                .map((l) => l.lessonId) ?? []
            }
            onSelectLesson={handleSelectLesson}
            progress={courseProgress?.progressPercentage ?? 0}
          />
        )}
      </div>
    </div>
  );
}
