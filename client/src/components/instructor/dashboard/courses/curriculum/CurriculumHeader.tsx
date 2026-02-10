"use client";

import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import type { CourseDetails } from "@/api/endpoints/instructor/courses";

interface CurriculumHeaderProps {
  course: CourseDetails;
}

export default function CurriculumHeader({ course }: CurriculumHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/instructor/dashboard/courses/${course.id}`}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Curriculum
                </h1>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{course.title}</p>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {course._count?.sections || 0} sections •{" "}
            {course.sections?.reduce(
              (acc, s) => acc + (s._count?.lessons ?? 0),
              0,
            ) ?? 0}
            lessons
          </div>
        </div>
      </div>
    </header>
  );
}
