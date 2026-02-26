"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Play, Clock, CheckCircle } from "lucide-react";

interface CourseInEnrollment {
  id: string;
  title: string;
  thumbnail?: string;
  instructor?: { name: string };
  totalLessons?: number;
}

interface Enrollment {
  id: string;
  course: CourseInEnrollment;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  status?: string;
}

interface Props {
  enrollment: Enrollment;
}

export default function EnrolledCourseCard({ enrollment }: Props) {
  const router = useRouter();

  const { course, progress = 0, completedLessons = 0, status } = enrollment;
  const totalLessons = enrollment.totalLessons ?? course.totalLessons ?? 0;
  const isCompleted = progress === 100 || status === "completed";

  return (
    <div
      onClick={() => router.push(`/learn/${enrollment.id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]"
    >
      <div className="relative h-44 overflow-hidden bg-white/5">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-900/40 to-indigo-900/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
              <Play className="ml-0.5 h-6 w-6 text-white/40" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-white">
            <Play className="h-4 w-4 fill-white" />
            {progress > 0 ? "Continue" : "Start"} Learning
          </span>
        </div>

        {isCompleted && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <CheckCircle className="h-3.5 w-3.5" />
            Completed
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white/90 transition-colors group-hover:text-white">
          {course.title}
        </h3>

        {course.instructor && (
          <p className="mt-1.5 text-xs text-white/35">
            {course.instructor.name}
          </p>
        )}

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {completedLessons}/{totalLessons} lessons
            </span>
            <span className={isCompleted ? "font-medium text-emerald-400" : ""}>
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCompleted
                  ? "bg-emerald-400"
                  : "bg-gradient-to-r from-violet-500 to-indigo-500"
              }`}
              style={{ width: `${Math.max(progress, 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
