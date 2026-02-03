"use client";

import { useParams } from "next/navigation";
import { useGetCourseDetails } from "@/hooks/endpoints/instructor/useCourses";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function CourseDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { courseId } = useParams<{ courseId: string }>();
  const { isLoading, error } = useGetCourseDetails(courseId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">
          Something went wrong loading this course.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
