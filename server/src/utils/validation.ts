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
