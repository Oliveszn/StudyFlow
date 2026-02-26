"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import {
  useAttachLessonVideo,
  useCreateLesson,
  useGenerateVideoUploadUrl,
} from "@/hooks/endpoints/instructor/useLessons";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createLessonSchema } from "@/utils/validationSchema";
import { useFormik } from "formik";
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
import { Checkbox } from "@/components/ui/checkbox";
import { uploadVideoToCloudinary } from "@/utils/uploadVideoToCloudinary";
import { toast } from "sonner";

interface AddLessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
}

export default function AddLessonDialog({
  isOpen,
  onClose,
  sectionId,
}: AddLessonDialogProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { mutateAsync: createLesson, isPending } = useCreateLesson();
  const { mutateAsync: generateUploadUrl } = useGenerateVideoUploadUrl();
  const { mutateAsync: attachVideo } = useAttachLessonVideo();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      type: "VIDEO" as "VIDEO" | "ARTICLE",
      articleContent: "",
      isFree: false,
    },
    validationSchema: toFormikValidationSchema(createLessonSchema),
    onSubmit: async (values, { resetForm }) => {
      try {
        ////first of all create the lesson, no video
        const lessonRes = await createLesson({
          sectionId,
          form: {
            title: values.title,
            description: values.description || undefined,
            type: values.type,
            articleContent:
              values.type === "ARTICLE" ? values.articleContent : undefined,
            isFree: values.isFree,
          },
        });

        const lessonId = lessonRes.data.id;

        ////if lesson type = video then upload and attach
        if (values.type === "VIDEO" && videoFile) {
          setUploadProgress(0);
          const uploadConfig = await generateUploadUrl({
            lessonId,
            fileName: videoFile.name,
            fileType: videoFile.type,
          });
          // console.log("uploadConfig", uploadConfig);
          const cloudinaryRes = await uploadVideoToCloudinary({
            file: videoFile,
            signatureData: uploadConfig,
            onProgress: (percent) => setUploadProgress(percent),
          });
          // console.log("cloudinaryRes", cloudinaryRes);
          await attachVideo({
            lessonId,
            videoUrl: cloudinaryRes.secure_url,
            videoPublicId: cloudinaryRes.public_id,
            videoDuration: Math.round(cloudinaryRes.duration),
          });
        }

        resetForm();
        setVideoFile(null);
        onClose();
      } catch (err) {
        if (uploadProgress !== null) {
          //if cloudinary upload fails
          toast.error("Video upload failed. Please try again.");
          setUploadProgress(null);
        } else {
          // if its just lesson that fails
          toast.error("Failed to create lesson. Please try again.");
        }
        return;
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Add New Lesson</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form
            id="add-lesson-form"
            onSubmit={formik.handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <Input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-sm text-red-500">{formik.errors.title}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                rows={2}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Lesson Type</label>
              <div className="flex gap-3">
                {(["VIDEO", "ARTICLE"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => formik.setFieldValue("type", t)}
                    className={`flex-1 rounded-lg border-2 py-3 transition ${
                      formik.values.type === t
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {formik.values.type === "VIDEO" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Video File *</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {uploadProgress !== null ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">
                        Uploading video...
                      </p>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{uploadProgress}%</p>
                    </div>
                  ) : videoFile ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{videoFile.name}</p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setVideoFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-blue-600">
                        Click to upload video
                      </span>
                      <input
                        type="file"
                        hidden
                        accept="video/*"
                        onChange={(e) =>
                          setVideoFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {formik.values.type === "ARTICLE" && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Article Content *</label>
                <Textarea
                  name="articleContent"
                  rows={8}
                  className="font-mono"
                  value={formik.values.articleContent}
                  onChange={formik.handleChange}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formik.values.isFree}
                onCheckedChange={(val) =>
                  formik.setFieldValue("isFree", Boolean(val))
                }
              />
              <span className="text-sm">Make this lesson free</span>
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isPending || uploadProgress !== null}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-lesson-form"
            disabled={
              isPending ||
              (formik.values.type === "VIDEO" && !videoFile) ||
              (formik.values.type === "ARTICLE" &&
                !formik.values.articleContent.trim())
            }
          >
            {isPending ? "Adding..." : "Add Lesson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
