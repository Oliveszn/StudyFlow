"use client";

import CourseCurriculumSection from "@/components/instructor/dashboard/courses/details/CourseCurriculumSection";
import CourseDetailsHeader from "@/components/instructor/dashboard/courses/details/CourseDetailsHeader";
import CourseDetailsSidebar from "@/components/instructor/dashboard/courses/details/CourseDetailsSidebar";
import CourseInfoSection from "@/components/instructor/dashboard/courses/details/CourseInfoSection";
import CoursePricingSection from "@/components/instructor/dashboard/courses/details/CoursePricingSection";
import CourseRequirementsSection from "@/components/instructor/dashboard/courses/details/CourseRequirementsSection";
import CourseReviewsSection from "@/components/instructor/dashboard/courses/details/CourseReviewSection";
import { useGetCourseDetails } from "@/hooks/endpoints/instructor/useCourses";
import { useGetReviewStats } from "@/hooks/endpoints/instructor/useReviews";
import { useParams } from "next/navigation";

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: courseData } = useGetCourseDetails(courseId);
  const { data: reviewStats } = useGetReviewStats(courseId);

  const course = courseData?.data;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseDetailsHeader course={course} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <CourseInfoSection course={course} />
            <CoursePricingSection course={course} />
            <CourseRequirementsSection course={course} />
            <CourseCurriculumSection courseId={courseId} />
            <CourseReviewsSection
              courseId={courseId}
              reviewStats={reviewStats?.data}
            />
          </div>

          <aside className="w-full lg:w-80 flex-shrink-0">
            <CourseDetailsSidebar
              course={course}
              reviewStats={reviewStats?.data}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
