"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import type { CourseDetails } from "@/api/endpoints/instructor/courses";

interface CourseRequirementsSectionProps {
  course: CourseDetails;
}

export default function CourseRequirementsSection({
  course,
}: CourseRequirementsSectionProps) {
  const hasRequirements = course.requirements?.length;
  const hasLearningObjectives = course.whatYouWillLearn?.length;

  if (!hasRequirements && !hasLearningObjectives) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasRequirements ? (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Requirements
            </h3>
            <ul className="space-y-2">
              {course.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="capitalize text-sm text-gray-700">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasLearningObjectives ? (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              What You Will Learn
            </h3>
            <ul className="space-y-2">
              {course.whatYouWillLearn.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="capitalize text-sm text-gray-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
