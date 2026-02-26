"use client";

import { useState } from "react";
import { useEnrollments } from "@/hooks/endpoints/student/useEnrollments";
import { BookOpen } from "lucide-react";
import EnrolledCoursesEmpty from "@/components/student/learning/EnrolledCoursesEmpty";
import EnrolledCoursesGrid from "@/components/student/learning/EnrolledCoursesGrid";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function MyLearningPage() {
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">(
    "all",
  );
  const { data, isLoading, error } = useEnrollments({
    status:
      filter === "all" ? undefined : filter.toUpperCase().replace("-", "_"),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
          </div>

          <div className="flex gap-2">
            {["all", "in-progress", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all"
                  ? "All Courses"
                  : status === "in-progress"
                    ? "In Progress"
                    : "Completed"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-gray-600">Failed to load courses</p>
          </div>
        )}

        {!isLoading && !error && data?.data.length === 0 && (
          <EnrolledCoursesEmpty />
        )}

        {!isLoading && !error && data?.data && data.data.length > 0 && (
          <EnrolledCoursesGrid enrollments={data.data} />
        )}
      </div>
    </div>
  );
}
