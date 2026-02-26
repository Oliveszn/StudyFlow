"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

export default function EnrolledCoursesEmpty() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center space-y-5 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-500/10">
        <BookOpen className="h-9 w-9 text-violet-400" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">No courses yet</h3>
        <p className="mx-auto mt-1 max-w-xs text-sm text-white/40">
          Start learning by browsing our catalog and enrolling in a course.
        </p>
      </div>

      <button
        onClick={() => router.push("/courses")}
        className="rounded-xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
      >
        Browse Courses
      </button>
    </div>
  );
}
