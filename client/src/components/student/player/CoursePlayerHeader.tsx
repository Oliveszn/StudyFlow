"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, PanelRightClose, PanelRightOpen } from "lucide-react";

interface Props {
  courseTitle?: string;
  progress: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function CoursePlayerHeader({
  courseTitle,
  progress,
  sidebarOpen,
  onToggleSidebar,
}: Props) {
  const router = useRouter();

  return (
    <header className="z-20 flex h-14 flex-shrink-0 items-center gap-4 border-b border-white/5 bg-[#0e0e11] px-4">
      <button
        onClick={() => router.push("/my-learning")}
        className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">My Learning</span>
      </button>

      <div className="h-4 w-px bg-white/10" />

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-medium text-white/80">
          {courseTitle}
        </h1>
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="w-9 font-mono text-xs text-white/40">
          {Math.round(progress)}%
        </span>
      </div>

      <button
        onClick={onToggleSidebar}
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
      >
        {sidebarOpen ? (
          <PanelRightClose className="h-4 w-4" />
        ) : (
          <PanelRightOpen className="h-4 w-4" />
        )}
      </button>
    </header>
  );
}
