"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Search from "@/components/common/svg-icons/Search";
import CoursesList from "@/components/instructor/dashboard/courses/CourseList";
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
          <Button className="bg-main text-white hover:bg-main-foreground ">
            <Link href="/instructor/courses/create">New Course</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading && <LoadingSpinner />}
          {isError && (
            <p className="text-center font-medium text-lg">
              Something went wrong
            </p>
          )}
          {data?.data && <CoursesList courses={data.data} />}
        </div>
      </div>
    </div>
  );
}
