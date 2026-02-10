"use client";

import { useState } from "react";
import { ChevronDown, BookOpen, Video, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useGetSection } from "@/hooks/endpoints/instructor/useSection";
import { useGetCourseDetails } from "@/hooks/endpoints/instructor/useCourses";
import { Lesson } from "@/api/endpoints/instructor/lessons";

interface CourseCurriculumSectionProps {
  courseId: string;
}

const LessonRow = ({ lesson }: { lesson: Lesson }) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 hover:bg-gray-50 rounded-lg transition">
      <span className="text-sm text-gray-400 w-5 text-right">
        {lesson.order}
      </span>
      {lesson.type === "VIDEO" ? (
        <Video className="w-4 h-4 text-blue-500 flex-shrink-0" />
      ) : (
        <FileText className="w-4 h-4 text-green-500 flex-shrink-0" />
      )}
      <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
      <div className="flex items-center gap-2">
        {lesson.isFree && (
          <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 font-medium rounded-full">
            Free
          </span>
        )}
        {/* {lesson.videoDuration && (
          <span className="text-xs text-gray-400">
            {formatDuration(lesson.videoDuration)}
          </span>
        )} */}
      </div>
    </div>
  );
};

const SectionBlock = ({ sectionId }: { sectionId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: sectionData } = useGetSection(sectionId);
  const section = sectionData?.data;

  if (!section) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-left"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
          <span className="text-sm font-semibold text-gray-900">
            {section.title}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {section._count.lessons} lesson
          {section._count.lessons !== 1 ? "s" : ""}
        </span>
      </button>

      {isOpen && (
        <div className="px-2 py-1 divide-y divide-gray-50">
          {section.lessons.length > 0 ? (
            section.lessons.map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} />
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No lessons yet
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default function CourseCurriculumSection({
  courseId,
}: CourseCurriculumSectionProps) {
  const { data: courseData } = useGetCourseDetails(courseId);
  const course = courseData?.data;

  const sections = course?.sections || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Curriculum</h2>
        <Link
          href={`/instructor/dashboard/courses/${courseId}/curriculum`}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
        >
          Manage Curriculum →
        </Link>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No sections yet</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Add sections from the curriculum manager
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((section) => (
            <SectionBlock key={section.id} sectionId={section.id} />
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {sections.length} section{sections.length !== 1 ? "s" : ""} •{" "}
          {sections.reduce((acc, s) => acc + (s._count?.lessons ?? 0), 0)} total
          lessons
        </span>
      </div>
    </div>
  );
}
