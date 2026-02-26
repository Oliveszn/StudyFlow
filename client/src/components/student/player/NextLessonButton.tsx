"use client";

import { ChevronRight } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function NextLessonButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-600"
    >
      Next lesson
      <ChevronRight className="h-4 w-4" />
    </button>
  );
}
