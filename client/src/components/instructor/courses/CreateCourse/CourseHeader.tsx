import { resetForm } from "@/store/CreateCourseSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearPersistedData } from "@/store/middleware/PersistCreateCourse";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateCourseHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector((state) => state.createCourse.currentStep);
  const isEditMode = useAppSelector((state) => state.createCourse.isEditMode);

  const handleExit = () => {
    dispatch(resetForm());
    clearPersistedData();
    router.push("/instructor/dashboard/courses");
  };
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Step {currentStep} of 3</p>
        </div>

        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-4 py-2 text-main hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>
    </header>
  );
}
