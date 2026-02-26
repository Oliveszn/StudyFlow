"use client";

import { useState } from "react";
import EnrolledCourseCard from "./EnrolledCourseCard";

type FilterValue = "all" | "in-progress" | "completed" | "not-started";

interface FilterOption {
  label: string;
  value: FilterValue;
}

const FILTERS: FilterOption[] = [
  { label: "All Courses", value: "all" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Not Started", value: "not-started" },
];

interface Props {
  enrollments: any[];
}

export default function EnrolledCoursesGrid({ enrollments }: Props) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = enrollments.filter((e) => {
    const progress: number = e.progress ?? 0;
    switch (filter) {
      case "completed":
        return progress === 100 || e.status === "completed";
      case "in-progress":
        return progress > 0 && progress < 100;
      case "not-started":
        return progress === 0;
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filter === f.value
                ? "bg-violet-500 text-white"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}

        <span className="ml-auto text-xs text-white/30">
          {filtered.length} course{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-white/30">
          No courses match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((enrollment) => (
            <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  );
}
