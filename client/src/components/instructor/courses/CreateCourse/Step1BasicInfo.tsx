"use client";

import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import FormNavigation from "./FormNavigation";
import { nextStep, updateFormData } from "@/store/CreateCourseSlice";
import { step1Schema } from "@/utils/validationSchema";

export default function Step1BasicInfo() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.createCourse.formData);

  const formik = useFormik({
    initialValues: {
      title: formData.title || "",
      subtitle: formData.subtitle || "",
      description: formData.description || "",
    },
    validationSchema: toFormikValidationSchema(step1Schema),
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateFormData(values));
      dispatch(nextStep());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g., Complete Web Development Bootcamp 2024"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            formik.touched.title && formik.errors.title
              ? "border-red-500"
              : "border-gray-300"
          }`}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formik.values.title.length}/200 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="subtitle"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Course Subtitle{" "}
          <span className="text-gray-500 text-xs">(Optional)</span>
        </label>
        <input
          id="subtitle"
          name="subtitle"
          type="text"
          placeholder="e.g., Learn HTML, CSS, JavaScript, React, Node.js and more"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            formik.touched.subtitle && formik.errors.subtitle
              ? "border-red-500"
              : "border-gray-300"
          }`}
          value={formik.values.subtitle}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.subtitle && formik.errors.subtitle && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.subtitle}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formik.values.subtitle?.length || 0}/300 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Course Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          placeholder="Describe what students will learn in your course..."
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
            formik.touched.description && formik.errors.description
              ? "border-red-500"
              : "border-gray-300"
          }`}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {formik.errors.description}
          </p>
        )}
      </div>

      <FormNavigation isNextDisabled={!formik.isValid || !formik.dirty} />
    </form>
  );
}
