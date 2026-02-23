"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import CourseCurriculumSection from "@/components/course/details/CourseCurriculumSection";
import CourseHero from "@/components/course/details/CourseHero";
import CourseLearningSection from "@/components/course/details/CourseLearningSection";
import CourseRequirementsSection from "@/components/course/details/CourseRequirementSection";
import CourseStickySidebar from "@/components/course/details/CourseStickySidebar";
import {
  useGetCourseBySlug,
  useGetCourseCurriculum,
} from "@/hooks/endpoints/usePublicCourses";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: courseData, isLoading, error } = useGetCourseBySlug(slug);
  const { data: curriculumData, isLoading: isCurriculumLoading } =
    useGetCourseCurriculum(slug);

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
        <p className="text-gray-600">Course not found.</p>
      </div>
    );
  }

  const course = courseData.data;
  const curriculum = curriculumData?.data;
  console.log("curriculumData", curriculumData);
  return (
    <div className="min-h-screen bg-white">
      <CourseHero course={course} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1 min-w-0 space-y-10">
            <CourseLearningSection objectives={course.whatYouWillLearn || []} />

            <CourseCurriculumSection
              curriculum={curriculum}
              isLoading={isCurriculumLoading}
            />

            <CourseRequirementsSection
              requirements={course.requirements || []}
            />
          </main>

          <aside className="w-full lg:w-[340px] flex-shrink-0">
            <CourseStickySidebar course={course} />
          </aside>
        </div>
      </div>
    </div>
  );
}
