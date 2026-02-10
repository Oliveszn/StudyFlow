"use client";

import { useUpdateSection } from "@/hooks/endpoints/instructor/useSection";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { sectionSchema } from "@/utils/validationSchema";

interface Section {
  id: string;
  title: string;
  description?: string;
}

interface EditSectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section;
}

export default function EditSectionDialog({
  isOpen,
  onClose,
  section,
}: EditSectionDialogProps) {
  const { mutate: updateSection, isPending } = useUpdateSection();

  const formik = useFormik({
    initialValues: {
      title: section.title,
      description: section.description ?? "",
    },
    validationSchema: toFormikValidationSchema(sectionSchema),
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      updateSection(
        {
          sectionId: section.id,
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
          <DialogTitle>Edit Section</DialogTitle>
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
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500">
                {formik.errors.description}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
