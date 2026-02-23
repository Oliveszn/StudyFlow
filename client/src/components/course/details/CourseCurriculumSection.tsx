"use client";

import { useState } from "react";
import {
  ChevronDown,
  Video,
  FileText,
  Clock,
  Lock,
  PlayCircle,
} from "lucide-react";
import type {
  CourseCurriculumSection as SectionType,
  CourseCurriculumLesson,
} from "@/api/endpoints/courses";

interface CourseCurriculumSectionProps {
  curriculum?: {
    sections: SectionType[];
    totalDuration: number;
    totalSections: number;
    totalLessons: number;
  };
  isLoading: boolean;
}

const formatDuration = (seconds: number) => {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const formatTotalDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} hours ${m} minutes`;
  return `${m} minutes`;
};

const LessonRow = ({ lesson }: { lesson: CourseCurriculumLesson }) => (
  <div className="flex items-center gap-3 py-2.5 px-4 hover:bg-gray-50 transition">
    {lesson.isFree ? (
      <PlayCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
    ) : lesson.type === "VIDEO" ? (
      <Video className="w-4 h-4 text-gray-400 flex-shrink-0" />
    ) : (
      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
    )}

    <span
      className={`flex-1 text-sm ${lesson.isFree ? "text-blue-600 cursor-pointer hover:underline" : "text-gray-700"}`}
    >
      {lesson.title}
    </span>

    <div className="flex items-center gap-2">
      {lesson.isFree ? (
        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
          Preview
        </span>
      ) : (
        <Lock className="w-3.5 h-3.5 text-gray-400" />
      )}

      {lesson.videoDuration && (
        <span className="text-xs text-gray-400 min-w-[40px] text-right">
          {formatDuration(lesson.videoDuration)}
        </span>
      )}
    </div>
  </div>
);

const SectionAccordion = ({
  section,
  defaultOpen,
}: {
  section: SectionType;
  defaultOpen: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const sectionDuration = section.lessons.reduce(
    (acc, l) => acc + (l.videoDuration || 0),
    0,
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-gray-100 transition text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <span className="font-semibold text-gray-900 text-sm truncate">
            {section.title}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0 ml-3">
          <span>{section._count.lessons} lessons</span>
          {sectionDuration > 0 && (
            <span>{formatDuration(sectionDuration)}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="divide-y divide-gray-100">
          {section.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CourseCurriculumSection({
  curriculum,
  isLoading,
}: CourseCurriculumSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <section className="space-y-3">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-5 bg-gray-100 rounded w-64 animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </section>
    );
  }

  if (!curriculum || !curriculum.sections.length) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Course content
        </h2>
        <p className="text-gray-500 text-sm">No curriculum available yet.</p>
      </section>
    );
  }

  const INITIAL_SHOW = 5;
  const visibleSections = showAll
    ? curriculum.sections
    : curriculum.sections.slice(0, INITIAL_SHOW);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Course content</h2>

      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
        <span>{curriculum.totalSections} sections</span>
        <span>•</span>
        <span>{curriculum.totalLessons} lessons</span>
        {curriculum.totalDuration > 0 && (
          <>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {formatTotalDuration(curriculum.totalDuration)} total length
              </span>
            </div>
          </>
        )}
      </div>

      <div className="space-y-2">
        {visibleSections.map((section, i) => (
          <SectionAccordion
            key={section.id}
            section={section}
            defaultOpen={i === 0}
          />
        ))}
      </div>

      {curriculum.sections.length > INITIAL_SHOW && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {showAll
            ? "Show fewer sections"
            : `Show all ${curriculum.sections.length} sections`}
        </button>
      )}
    </section>
  );
}
