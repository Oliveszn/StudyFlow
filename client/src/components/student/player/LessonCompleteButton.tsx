"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  useLesson,
  useMarkLessonComplete,
} from "@/hooks/endpoints/student/useProgress";
import { CheckCircle, Circle } from "lucide-react";

interface Props {
  lessonId: string;
}

export default function LessonCompleteButton({ lessonId }: Props) {
  const { data } = useLesson(lessonId);
  const { mutate: markComplete, isPending } = useMarkLessonComplete();

  const isCompleted = !!data?.progress?.completedAt;

  return (
    <button
      onClick={() => !isCompleted && markComplete(lessonId)}
      disabled={isPending || isCompleted}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
        isCompleted
          ? "cursor-default border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
      }`}
    >
      {isPending ? (
        <LoadingSpinner />
      ) : isCompleted ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {isCompleted ? "Completed" : "Mark complete"}
    </button>
  );
}
