"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreateSection } from "@/hooks/endpoints/instructor/useSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import { sectionSchema } from "@/utils/validationSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface AddSectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

export default function AddSectionDialog({
  isOpen,
  onClose,
  courseId,
}: AddSectionDialogProps) {
  const { mutate: createSection, isPending } = useCreateSection();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: toFormikValidationSchema(sectionSchema),

    onSubmit: async (values, { resetForm }) => {
      createSection(
        {
          courseId,
          form: {
            title: values.title,
            description: values.description || undefined,
          },
        },
        {
          onSuccess: () => {
            (resetForm(), onClose());
          },
        },
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Section Title <span className="text-red-500">*</span>
            </label>
            <Input
              name="title"
              required
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="e.g., Introduction to React"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-red-500">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              name="description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Brief description of what this section covers..."
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500">
                {formik.errors.description}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Section"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
