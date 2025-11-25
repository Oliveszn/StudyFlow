import { z } from "zod";

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
