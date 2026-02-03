"use client";

import CreateCourseHeader from "@/components/instructor/courses/CreateCourse/CourseHeader";
import ProgressBar from "@/components/instructor/courses/CreateCourse/ProgressBar";
import Step1BasicInfo from "@/components/instructor/courses/CreateCourse/Step1BasicInfo";
import Step2Pricing from "@/components/instructor/courses/CreateCourse/Step2Pricing";
import Step3Details from "@/components/instructor/courses/CreateCourse/Step3Details";
import { useAppSelector } from "@/store/hooks";

export default function CreateCoursePage() {
  const currentStep = useAppSelector((state) => state.createCourse.currentStep);

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
