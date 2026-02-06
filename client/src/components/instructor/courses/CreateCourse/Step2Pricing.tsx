"use client";

import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import FormNavigation from "./FormNavigation";
import { nextStep, updateFormData } from "@/store/CreateCourseSlice";
import { step2Schema } from "@/utils/validationSchema";
import { useCategories } from "@/hooks/endpoints/useCategories";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Step2Pricing() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.createCourse.formData);

  const formik = useFormik({
    initialValues: {
      category: formData.category || "",
      price: formData.price || 0,
      discountPrice: formData.discountPrice || 0,
      language: formData.language || "en",
    },
    validationSchema: toFormikValidationSchema(step2Schema),
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateFormData(values));
      dispatch(nextStep());
    },
  });

  const { data: categories } = useCategories();

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            formik.touched.category && formik.errors.category
              ? "border-red-500"
              : "border-gray-300"
          }`}
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {formik.touched.category && formik.errors.category && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="language"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Language <span className="text-red-500">*</span>
        </label>
        <input
          id="language"
          name="language"
          type="text"
          value="English"
          disabled
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
        />

        <input type="hidden" name="language" value="en" />
        <span className="text-gray-700 text-xs">We only support english</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Price (NGN) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              ₦
            </span>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                formik.touched.price && formik.errors.price
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <span className="text-gray-700 text-xs">
            Set price to 0 if course is free
          </span>
          {formik.touched.price && formik.errors.price && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="discountPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Discount Price (NGN)
          </label>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₦
                </span>
                <input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  disabled={formik.values.price === 0}
                  value={formik.values.discountPrice || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    formik.touched.discountPrice && formik.errors.discountPrice
                      ? "border-red-500"
                      : formik.values.price === 0
                        ? "bg-gray-100 cursor-not-allowed border-gray-300"
                        : "border-gray-300"
                  }`}
                />
              </div>
            </TooltipTrigger>
            {formik.values.price === 0 && (
              <TooltipContent side="top">
                Free courses cannot have a discount price
              </TooltipContent>
            )}
          </Tooltip>

          {formik.touched.discountPrice && formik.errors.discountPrice && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.discountPrice}
            </p>
          )}
        </div>
      </div>

      <FormNavigation isNextDisabled={!formik.isValid} />
    </form>
  );
}
