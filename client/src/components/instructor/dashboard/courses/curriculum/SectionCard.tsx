"use client";

import { useState } from "react";
import {
  ChevronDown,
  MoreVertical,
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react";
import { useDeleteSection } from "@/hooks/endpoints/instructor/useSection";
import EditSectionDialog from "./EditSectionDialog";
import LessonList from "./LessonList";

interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  _count?: {
    lessons: number;
  };
}

interface SectionCardProps {
  section: Section;
  courseId: string;
  index: number;
  totalSections: number;
  dragHandleProps?: any;
}

export default function SectionCard({
  section,
  courseId,
  index,
  totalSections,
  dragHandleProps,
}: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { mutate: deleteSection } = useDeleteSection();

  const lessonCount = section._count?.lessons ?? 0;

  const handleDelete = () => {
    if (lessonCount > 0) {
      alert("Cannot delete section with lessons. Delete all lessons first.");
      return;
    }

    if (confirm(`Are you sure you want to delete "${section.title}"?`)) {
      deleteSection({ sectionId: section.id, courseId });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-4 hover:bg-gray-50 transition">
        {/* button to drag */}
        <button
          {...dragHandleProps}
          onClick={(e) => {
            if (isMenuOpen) e.stopPropagation();
          }}
          className="cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">
              Section {index + 1}
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              {section.description && (
                <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                  {section.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {lessonCount} lesson
              {lessonCount !== 1 ? "s" : ""}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsEditDialogOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Section
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleDelete();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Section
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* full lesson lis when expanded */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <LessonList sectionId={section.id} courseId={courseId} />
        </div>
      )}

      <EditSectionDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        section={section}
      />
    </div>
  );
}
