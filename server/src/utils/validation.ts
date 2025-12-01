import { z } from "zod";

///AUTH AND USER SETUP
export const registerUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "First name can only contain letters and spaces")
    .trim(),
  email: z.string().email().min(1).max(255).toLowerCase().trim(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces")
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255),
});

export const loginSchema = z.object({
  email: z.string().email().min(1).max(255).toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255),
});

export const editUser = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "First name can only contain letters and spaces")
    .trim(),
  email: z.string().email().min(1).max(255).toLowerCase().trim(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces")
    .trim(),
});

///COURSE CREATION
export const createCourseSchema = z.object({
  title: z.string().min(10).max(200),
  subtitle: z.string().max(300).optional(),
  description: z.string().min(50),
  category: z.string(),
  price: z.number().min(0).multipleOf(0.01),
  discountPrice: z.number().min(0).multipleOf(0.01).optional(),
  language: z.string().default("en"),
  requirements: z.array(z.string()).optional(),
  whatYouWillLearn: z.array(z.string()).optional(),
  thumbnail: z.string().url().optional(),
  previewVideo: z.string().url().optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(10).max(200).optional(),
  subtitle: z.string().max(300).optional(),
  description: z.string().min(50).optional(),
  category: z.string().optional(),
  price: z.number().min(0).multipleOf(0.01).optional(),
  discountPrice: z.number().min(0).multipleOf(0.01).optional(),
  language: z.string().optional(),
  duration: z.number().min(0).optional(),
  requirements: z.array(z.string()).optional(),
  whatYouWillLearn: z.array(z.string()).optional(),
  thumbnail: z.string().url().optional(),
  previewVideo: z.string().url().optional(),
});

export const getCourseAnalyticsSchema = z.object({
  id: z.string(),
});

////SECTIONS CREATION
export const createSectionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional().nullable().or(z.literal("")),
});

export const updateSectionSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(1000).optional().nullable().or(z.literal("")),
});

export const reorderSectionSchema = z.object({
  sectionOrders: z
    .array(
      z.object({
        sectionId: z.string(),
        order: z.number().int().min(1),
      })
    )
    .min(1),
});

/////LESSONS CREATION
export const createLessonSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional().nullable().or(z.literal("")),
  type: z.enum(["VIDEO", "ARTICLE"]),
  videoUrl: z.string().url().optional(),
  videoProvider: z.string().optional(),
  videoDuration: z.number().int().min(0).optional(),
  articleContent: z.string().optional(),
  isFree: z.boolean().optional(),
});

export const updateLessonSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional().nullable().or(z.literal("")),
  type: z.enum(["VIDEO", "ARTICLE"]),
  videoUrl: z.string().url().optional().nullable().or(z.literal("")),
  videoProvider: z.string().optional().nullable().or(z.literal("")),
  videoDuration: z.number().int().min(0).optional().nullable(),
  articleContent: z.string().optional().nullable().or(z.literal("")),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const reorderLessonSchema = z.object({
  lessonOrders: z
    .array(
      z.object({
        lessonId: z.string(),
        order: z.number().int().min(1),
      })
    )

    .min(1),
});

export const addAttachmentSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  size: z.number().int().min(0).optional(),
});

////REVIEWS
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(2000).optional().nullable().or(z.literal("")),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(2000).optional().nullable().or(z.literal("")),
});
