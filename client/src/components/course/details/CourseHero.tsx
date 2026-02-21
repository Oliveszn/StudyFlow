"use client";

import { Star, Users, Globe, Clock, BarChart2 } from "lucide-react";
import type { Course } from "@/api/endpoints/courses";

interface CourseHeroProps {
  course: Course & { lessonCount: number };
}

export default function CourseHero({ course }: CourseHeroProps) {
  const updatedDate = new Date(course.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full bg-[#16161D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Constrain text to left — sidebar takes the right */}
        <div className="max-w-3xl space-y-4">
          {/* Breadcrumb */}
          {course.category && (
            <p className="text-sm text-blue-400">{course.category.name}</p>
          )}

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
            {course.title}
          </h1>

          {/* Subtitle / Description */}
          {course.subtitle && (
            <p className="text-lg text-gray-300">{course.subtitle}</p>
          )}

          {/* Rating Row */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {course.averageRating > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-yellow-400">
                  {course.averageRating.toFixed(1)}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4"
                      fill={
                        s <= Math.round(course.averageRating)
                          ? "#facc15"
                          : "none"
                      }
                      color={
                        s <= Math.round(course.averageRating)
                          ? "#facc15"
                          : "#6b7280"
                      }
                    />
                  ))}
                </div>
                <span className="text-blue-400 underline cursor-pointer">
                  ({course._count?.reviews?.toLocaleString()} ratings)
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-gray-300">
              <Users className="w-4 h-4" />
              <span>
                {course._count?.enrollments?.toLocaleString()} students
              </span>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span>
              Created by{" "}
              <span className="text-blue-400 underline cursor-pointer">
                {course.instructor.firstName} {course.instructor.lastName}
              </span>
            </span>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last updated {updatedDate}</span>
            </div>

            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span className="uppercase">{course.language}</span>
            </div>

            {/* <div className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              <span className="capitalize">{course.level || 'All levels'}</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
