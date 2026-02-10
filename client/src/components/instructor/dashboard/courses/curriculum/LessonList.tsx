"use client";

import { useState } from "react";
import { Plus, Video, FileText, GripVertical } from "lucide-react";
import { useGetSection } from "@/hooks/endpoints/instructor/useSection";
import AddLessonDialog from "./AddLessonDialog";

interface LessonListProps {
  sectionId: string;
  courseId: string;
}

export default function LessonList({ sectionId, courseId }: LessonListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: sectionData } = useGetSection(sectionId);

  const lessons = sectionData?.data?.lessons || [];

  return (
    <div className="p-4 bg-gray-50">
      <button
        onClick={() => setIsAddDialogOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-white transition text-sm text-gray-600 hover:text-blue-600 mb-3"
      >
        <Plus className="w-4 h-4" />
        <span>Add Lesson</span>
      </button>

      {lessons.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No lessons yet</p>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <button className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-gray-400" />
              </button>

              {lesson.type === "VIDEO" ? (
                <Video className="w-4 h-4 text-blue-500" />
              ) : (
                <FileText className="w-4 h-4 text-green-500" />
              )}

              <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
              <span className="flex-1 text-sm text-gray-900">
                {lesson.title}
              </span>

              {lesson.isFree && (
                <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">
                  Free
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <AddLessonDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        sectionId={sectionId}
      />
    </div>
  );
}
