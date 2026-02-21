import { TrendingUp } from "lucide-react";
import TrendingCourseGrid from "../course/TrendingCourseGrid";
import Link from "next/link";

export default function TrendingSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                This Week
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Trending Courses
            </h2>
            <p className="text-gray-500 mt-1">
              Most popular courses among learners right now
            </p>
          </div>

          <Link
            href="/courses"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            View all courses →
          </Link>
        </div>

        <TrendingCourseGrid limit={8} />

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            View all courses
          </Link>
        </div>
      </div>
    </section>
  );
}
