"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useDeleteCourse,
  usePublishCourse,
  useUnPublishCourse,
} from "@/hooks/endpoints/instructor/useCourses";

interface CourseActionsMenuProps {
  courseId: string;
  isPublished: boolean;
}

export default function CourseActionsMenu({
  courseId,
  isPublished,
}: CourseActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { mutate: publishCourse } = usePublishCourse();
  const { mutate: unpublishCourse } = useUnPublishCourse();
  const { mutate: deleteCourse } = useDeleteCourse();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handlePublishToggle = () => {
    setIsOpen(false);
    if (isPublished) {
      unpublishCourse(courseId);
    } else {
      publishCourse(courseId);
    }
  };

  const handleDelete = () => {
    setIsOpen(false);
    if (
      confirm(
        "Are you sure you want to delete this course? This action cannot be undone.",
      )
    ) {
      deleteCourse(courseId, {
        onSuccess: () => router.push("/instructor/dashboard/courses"),
      });
    }
  };

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/instructor/courses/${courseId}/edit`);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={handlePublishToggle}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
          >
            {isPublished ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-600" />
                <span>Unpublish</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-green-600" />
                <span>Publish</span>
              </>
            )}
          </button>

          <div className="border-t border-gray-100" />

          <button
            onClick={handleEdit}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
          >
            <Pencil className="w-4 h-4 text-green-600" />
            <span>Edit Course</span>
          </button>

          <div className="border-t border-gray-100" />

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Course</span>
          </button>
        </div>
      )}
    </div>
  );
}
