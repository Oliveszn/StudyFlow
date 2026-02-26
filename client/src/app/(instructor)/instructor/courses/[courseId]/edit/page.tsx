"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { useGetCourseDetails } from "@/hooks/endpoints/instructor/useCourses";
import { useAppSelector } from "@/store/hooks";
import { initializeEditMode } from "@/store/CreateCourseSlice";
import Step1BasicInfo from "@/components/instructor/courses/CreateCourse/Step1BasicInfo";
import Step2Pricing from "@/components/instructor/courses/CreateCourse/Step2Pricing";
import Step3Details from "@/components/instructor/courses/CreateCourse/Step3Details";
import CreateCourseHeader from "@/components/instructor/courses/CreateCourse/CourseHeader";
import ProgressBar from "@/components/instructor/courses/CreateCourse/ProgressBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector((state) => state.createCourse.currentStep);

  const { data: courseData, isLoading, error } = useGetCourseDetails(courseId);

  useEffect(() => {
    if (courseData?.data) {
      const course = courseData.data;

      dispatch(
        initializeEditMode({
          courseId: course.id,
          formData: {
            title: course.title,
            subtitle: course.subtitle || "",
            description: course.description || "",
            category: course.categoryId,
            price: course.price,
            discountPrice: course.discountPrice,
            language: course.language,
            requirements: course.requirements || [],
            whatYouWillLearn: course.whatYouWillLearn || [],
            existingThumbnailUrl: course.thumbnail || undefined,
          },
        }),
      );
    }
  }, [courseData, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Could not load course data.</p>
        <button
          onClick={() => router.push("/instructor/dashboard/courses")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Pricing />;
      case 3:
        return <Step3Details />;
      default:
        return <Step1BasicInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateCourseHeader />

      <div className="max-w-4xl mx-auto pb-12">
        <ProgressBar />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
