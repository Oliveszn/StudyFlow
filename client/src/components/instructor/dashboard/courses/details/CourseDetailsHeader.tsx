"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { CourseDetails } from "@/api/endpoints/instructor/courses";
import CourseActionsMenu from "./CourseActionMenu";

interface CourseDetailsHeaderProps {
  course: CourseDetails;
}

export default function CourseDetailsHeader({
  course,
}: CourseDetailsHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/instructor/dashboard/courses"
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>

            <div>
              <h1 className="text-xl font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
                {course.title}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                    course.isPublished === true
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      course.isPublished === true
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                  {course.isPublished === true ? "Published" : "Draft"}
                </span>

                {course.category && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {course.category.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <CourseActionsMenu
            courseId={course.id}
            isPublished={course.isPublished === true}
          />
        </div>
      </div>
    </header>
  );
}
