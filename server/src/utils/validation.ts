import { z } from "zod";

export const registerUserSchema = z.object({
  firstName: z.string(),
  email: z.string().email().min(1).max(255),
  lastName: z.string(),
  password: z.string().min(8).max(255),
});

export const loginSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(8).max(255),
});
