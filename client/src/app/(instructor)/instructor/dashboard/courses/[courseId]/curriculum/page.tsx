"use client";

import { useParams } from "next/navigation";
import { useGetCourseDetails } from "@/hooks/endpoints/instructor/useCourses";
import CurriculumHeader from "@/components/instructor/dashboard/courses/curriculum/CurriculumHeader";
import SectionList from "@/components/instructor/dashboard/courses/curriculum/SectionList";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function CurriculumPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: courseData, isLoading, error } = useGetCourseDetails(courseId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load course</p>
      </div>
    );
  }

  const course = courseData.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <CurriculumHeader course={course} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <SectionList courseId={courseId} sections={course.sections || []} />
      </div>
    </div>
  );
}
