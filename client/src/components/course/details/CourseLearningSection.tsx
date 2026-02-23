"use client";

import { CheckCircle2 } from "lucide-react";

interface CourseLearningProps {
  objectives: string[];
}

export default function CourseLearningSection({
  objectives,
}: CourseLearningProps) {
  if (!objectives.length) return null;

  return (
    <section className="border border-gray-200 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">
        What you'll learn
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {objectives.map((obj, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700 leading-relaxed capitalize">
              {obj}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
