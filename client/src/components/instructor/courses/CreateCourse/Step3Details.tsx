"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Plus, X, Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import FormNavigation from "./FormNavigation";
import {
  useCreateCourse,
  useUpdateCourse,
} from "@/hooks/endpoints/instructor/useCourses";
import {
  resetForm,
  setSubmitting,
  updateFormData,
} from "@/store/CreateCourseSlice";
import { step3Schema } from "@/utils/validationSchema";
import { clearPersistedData } from "@/store/middleware/PersistCreateCourse";
import { toast } from "sonner";

export default function Step3Details() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const formData = useAppSelector((state) => state.createCourse.formData);
  const isEditMode = useAppSelector((state) => state.createCourse.isEditMode);
  const editCourseId = useAppSelector(
    (state) => state.createCourse.editCourseId,
  );

  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const [requirementInput, setRequirementInput] = useState("");
  const [learningInput, setLearningInput] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [hasNewThumbnail, setHasNewThumbnail] = useState(false);

  const isSubmitting = isEditMode ? isUpdating : isCreating;

  /////Setting existing thumbnail preview in edit mode
  useEffect(() => {
    if (isEditMode && formData.existingThumbnailUrl && !hasNewThumbnail) {
      setThumbnailPreview(formData.existingThumbnailUrl);
    }
  }, [isEditMode, formData.existingThumbnailUrl, hasNewThumbnail]);

  const formik = useFormik({
    initialValues: {
      requirements: formData.requirements || [],
      whatYouWillLearn: formData.whatYouWillLearn || [],
      thumbnail: formData.thumbnail || null,
    },
    validationSchema: toFormikValidationSchema(step3Schema),
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      dispatch(updateFormData(values));

      // Combine all form data
      const completeFormData = {
        ...formData,
        ...values,
      };

      const formDataPayload = new FormData();

      //appending normal fields
      Object.entries(completeFormData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        if (key === "thumbnail" || key === "existingThumbnailUrl") return;

        if (Array.isArray(value)) {
          formDataPayload.append(key, JSON.stringify(value));
        } else {
          formDataPayload.append(key, value as any);
        }
      });

      // Only append thumbnail if user uploaded a NEW one
      if (hasNewThumbnail && values.thumbnail instanceof File) {
        formDataPayload.append("thumbnail", values.thumbnail);
      }

      if (isEditMode && editCourseId) {
        updateCourse(
          { courseId: editCourseId, form: formDataPayload },
          {
            onSuccess: () => {
              clearPersistedData();
              dispatch(resetForm());
              router.push(`/instructor/dashboard/courses/${editCourseId}`);
            },
            onError: (error) => {
              toast.error("Failed to update course. Please try again.");
            },
          },
        );
      } else {
        createCourse(formDataPayload, {
          onSuccess: () => {
            dispatch(resetForm());
            clearPersistedData();
            router.push("/instructor/dashboard/courses");
          },
          onError: (error) => {
            toast.error("Failed to create course. Please try again.");
          },
        });
      }
    },
  });

  const addRequirement = () => {
    if (requirementInput.trim()) {
      formik.setFieldValue("requirements", [
        ...formik.values.requirements,
        requirementInput.trim(),
      ]);
      setRequirementInput("");
    }
  };

  const removeRequirement = (index: number) => {
    const updated = formik.values.requirements.filter((_, i) => i !== index);
    formik.setFieldValue("requirements", updated);
  };

  const addLearning = () => {
    if (learningInput.trim()) {
      formik.setFieldValue("whatYouWillLearn", [
        ...formik.values.whatYouWillLearn,
        learningInput.trim(),
      ]);
      setLearningInput("");
    }
  };

  const removeLearning = (index: number) => {
    const updated = formik.values.whatYouWillLearn.filter(
      (_, i) => i !== index,
    );
    formik.setFieldValue("whatYouWillLearn", updated);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasNewThumbnail(true);
      formik.setFieldValue("thumbnail", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview(null);
    setHasNewThumbnail(false);
    formik.setFieldValue("thumbnail", null);

    // In edit mode, restore the existing thumbnail preview
    if (isEditMode && formData.existingThumbnailUrl) {
      setThumbnailPreview(formData.existingThumbnailUrl);
    }
  };

  // SIMPLIFIED VALIDATION CHECK
  const hasRequiredFields =
    formik.values.requirements.length > 0 &&
    formik.values.whatYouWillLearn.length > 0;

  const isFormDisabled = isEditMode
    ? !hasRequiredFields || isSubmitting // In edit mode, just check required fields
    : !formik.isValid || isSubmitting; // In create mode, use full validation

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requirements <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="e.g., Basic knowledge of HTML"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={requirementInput}
            onChange={(e) => setRequirementInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addRequirement())
            }
          />
          <button
            type="button"
            onClick={addRequirement}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {formik.values.requirements.length > 0 && (
          <ul className="space-y-2">
            {formik.values.requirements.map((req, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{req}</span>
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {formik.touched.requirements && formik.errors.requirements && (
          <p className="mt-1 text-sm text-red-600">
            {formik.errors.requirements}
          </p>
        )}
      </div>

      {/* What You Will Learn */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What You Will Learn <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="e.g., Build responsive websites"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={learningInput}
            onChange={(e) => setLearningInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addLearning())
            }
          />
          <button
            type="button"
            onClick={addLearning}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {formik.values.whatYouWillLearn.length > 0 && (
          <ul className="space-y-2">
            {formik.values.whatYouWillLearn.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{item}</span>
                <button
                  type="button"
                  onClick={() => removeLearning(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {formik.touched.whatYouWillLearn && formik.errors.whatYouWillLearn && (
          <p className="mt-1 text-sm text-red-600">
            {formik.errors.whatYouWillLearn}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Thumbnail
          {isEditMode && !hasNewThumbnail && (
            <span className="ml-2 text-xs text-blue-600 font-normal">
              (Current thumbnail shown - upload to replace)
            </span>
          )}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {thumbnailPreview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
                {!hasNewThumbnail && isEditMode && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      Current
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-3">
                {hasNewThumbnail && (
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    {isEditMode ? "Cancel Change" : "Remove"}
                  </button>
                )}
                <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                  {hasNewThumbnail || !isEditMode
                    ? "Change Image"
                    : "Upload New Image"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700">
                  Click to upload
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      <FormNavigation
        isNextDisabled={isFormDisabled}
        isSubmitting={isSubmitting}
        isLastStep
      />
    </form>
  );
}
