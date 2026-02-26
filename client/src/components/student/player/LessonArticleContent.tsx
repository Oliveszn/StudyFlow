"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useLesson } from "@/hooks/endpoints/student/useProgress";

interface Props {
  lessonId: string;
}

export default function LessonArticleContent({ lessonId }: Props) {
  const { data, isLoading } = useLesson(lessonId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  const lesson = data?.lesson;
  const htmlContent: string | undefined =
    lesson?.articleContent ?? lesson?.description;
  console.log("lessonarticle", JSON.stringify(data, null, 2));
  console.log("lessonId:", lessonId);
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">{lesson?.title}</h1>

      {htmlContent ? (
        <div
          className="prose prose-invert prose-sm max-w-none
            prose-headings:text-white
            prose-p:text-white/70
            prose-li:text-white/70
            prose-a:text-violet-400
            prose-strong:text-white
            prose-code:rounded prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-violet-300
            prose-pre:border prose-pre:border-white/10 prose-pre:bg-white/5"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p className="text-sm text-white/40">
          No content available for this lesson.
        </p>
      )}
    </div>
  );
}
