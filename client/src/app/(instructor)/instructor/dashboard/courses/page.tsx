"use client";
import Search from "@/components/common/svg-icons/Search";
import { Button } from "@/components/ui/button";
import { useGetInstructorCourse } from "@/hooks/endpoints/instructor/useCourses";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { useState } from "react";

export default function Courses() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { data, isLoading, isError, error } = useGetInstructorCourse({
    page: 1,
    limit: 10,
    status: undefined,
    search: debouncedSearch,
  });
  console.log(data);

  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        <h1 className="font-medium text-3xl leading-tight">Courses</h1>
        <div className="flex items-center gap-2 justify-between w-full">
          <div className="flex items-center gap-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Search your courses..."
              className="px-3 py-2 rounded-sm border border-main outline-none focus:ring-2 focus:ring-main/40 focus:border-main transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button className="flex items-center justify-center px-3 py-2 rounded-md bg-main text-white hover:bg-main/90 transition">
              <Search />
            </Button>
          </div>

          <Button className="bg-main text-white hover:bg-main-foreground">
            New Course
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading && <p>Loading...</p>}
          {isError && <p>Something went wrong</p>}

          {data?.data?.length === 0 && <p>No courses found</p>}

          {data?.data?.map((course) => {
            const isPublished = course.isPublished;

            return (
              <div
                key={course.id}
                className="border rounded-lg p-4 flex items-center justify-between gap-4"
              >
                {/* Thumbnail */}
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-24 h-16 object-cover rounded-md"
                />

                {/* Title + Status */}
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">{course.title}</h2>

                  <span
                    className={`text-sm font-medium uppercase ${
                      isPublished ? "text-green-600" : "text-black-600"
                    }`}
                  >
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Actions */}
                <Link
                  href={`/dashboard/instructor/courses/${course.slug}`}
                  className="text-blue-600 hover:underline ml-auto"
                >
                  Edit / Manage Course
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
