"use client";

import type { CourseDetails } from "@/api/endpoints/instructor/courses";

interface CourseInfoSectionProps {
  course: CourseDetails;
}

export default function CourseInfoSection({ course }: CourseInfoSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Course Information
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Title
          </label>
          <p className="text-gray-900">{course.title}</p>
        </div>

        {course.subtitle && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Subtitle
            </label>
            <p className="text-gray-900">{course.subtitle}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Description
          </label>
          <p className="text-gray-900 leading-relaxed">{course.description}</p>
        </div>

        {course.category && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Category
            </label>
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
              {course.category.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
