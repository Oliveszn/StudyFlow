"use client";

interface CourseRequirementsSectionProps {
  requirements: string[];
}

export default function CourseRequirementsSection({
  requirements,
}: CourseRequirementsSectionProps) {
  if (!requirements.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
      <ul className="space-y-2.5">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
            <span className="text-sm text-gray-700 leading-relaxed capitalize">
              {req}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
