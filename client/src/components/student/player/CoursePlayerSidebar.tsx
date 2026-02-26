"use client";

import { useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  PlayCircle,
} from "lucide-react";
import { Lesson, Section } from "@/api/endpoints/student/enrollments";

interface Props {
  sections: Section[];
  activeLessonId: string | null;
  completedLessonIds: (string | { id: string })[];
  onSelectLesson: (lesson: Lesson) => void;
  progress: number;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CoursePlayerSidebar({
  sections,
  activeLessonId,
  completedLessonIds,
  onSelectLesson,
  progress,
}: Props) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(sections.map((s) => s.id)),
  );

  const completedSet = new Set<string>(
    completedLessonIds.map((l) => (typeof l === "string" ? l : l.id)),
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  // console.log(sectionLessons)
  return (
    <aside className="flex w-80 flex-shrink-0 flex-col overflow-hidden border-l border-white/5 bg-[#0a0a0d] xl:w-96">
      <div className="border-b border-white/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Course Content
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-white/40">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section, si) => {
          const isOpen = openSections.has(section.id);
          const sectionLessons = section.lessons ?? [];
          const completedCount = sectionLessons.filter((l) =>
            completedSet.has(l.id),
          ).length;

          return (
            <div
              key={section.id}
              className="border-b border-white/5 last:border-0"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-white/30">
                    Section {si + 1}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium leading-snug text-white/80">
                    {section.title}
                  </span>
                  <span className="mt-1 block text-xs text-white/30">
                    {completedCount}/{sectionLessons.length} completed
                  </span>
                </span>
                {isOpen ? (
                  <ChevronUp className="mt-1 h-4 w-4 flex-shrink-0 text-white/30" />
                ) : (
                  <ChevronDown className="mt-1 h-4 w-4 flex-shrink-0 text-white/30" />
                )}
              </button>

              {isOpen && (
                <div className="pb-2">
                  {sectionLessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = completedSet.has(lesson.id);
                    const isArticle = lesson.type === "ARTICLE";

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`flex w-full items-start gap-3 border-l-2 px-5 py-3 text-left transition-all ${
                          isActive
                            ? "border-violet-500 bg-violet-500/10"
                            : "border-transparent hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : isArticle ? (
                            <FileText
                              className={`h-4 w-4 ${
                                isActive ? "text-violet-400" : "text-white/25"
                              }`}
                            />
                          ) : (
                            <PlayCircle
                              className={`h-4 w-4 ${
                                isActive ? "text-violet-400" : "text-white/25"
                              }`}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm leading-snug ${
                              isActive
                                ? "font-medium text-white"
                                : isCompleted
                                  ? "text-white/50"
                                  : "text-white/60"
                            }`}
                          >
                            {lesson.title}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2">
                            {isArticle && (
                              <span className="text-xs text-white/25">
                                Article
                              </span>
                            )}
                            {lesson.videoDuration && (
                              <span className="text-xs text-white/25">
                                {formatDuration(lesson.videoDuration)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
