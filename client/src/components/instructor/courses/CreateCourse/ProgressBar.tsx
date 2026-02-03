"use client";

import { useAppSelector } from "@/store/hooks";

export default function ProgressBar() {
  const currentStep = useAppSelector((state) => state.createCourse.currentStep);
  const progress = (currentStep / 3) * 100;

  const steps = [
    { number: 1, label: "Basic Info" },
    { number: 2, label: "Pricing" },
    { number: 3, label: "Details" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-main transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex flex-col items-center ${
              step.number === currentStep
                ? "text-main"
                : step.number < currentStep
                  ? "text-green-600"
                  : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 ${
                step.number === currentStep
                  ? "bg-main text-white"
                  : step.number < currentStep
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-400"
              }`}
            >
              {step.number < currentStep ? "✓" : step.number}
            </div>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
