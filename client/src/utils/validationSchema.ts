import z from "zod";
export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

///COURSES
export const createCourseSchema = z
  .object({
    title: z
      .string("Course title is required")
      .min(10, "Title must be at least 10 characters")
      .max(200, "Title cannot exceed 200 characters"),

    subtitle: z
      .string()
      .max(300, "Subtitle cannot exceed 300 characters")
      .optional(),

    description: z
      .string("Course description is required")
      .min(10, "Description must be at least 10 characters"),

    category: z.string("Category is required").min(1, "Category is required"),

    price: z.coerce
      .number("Price is required")
      .min(0, "Price cannot be negative")
      .multipleOf(0.01, "Price must be a valid monetary value"),

    discountPrice: z.coerce
      .number()
      .min(0, "Discount price cannot be negative")
      .multipleOf(0.01, "Discount must be a valid monetary value")
      .optional(),

    language: z.string().default("en"),
    /// had to modify requirements and whatlearn to accept strings and parse them to an array
    requirements: z
      .union([
        z.array(z.string()),
        z.string().transform((str) => {
          if (!str || str.trim() === "") return [];
          try {
            return JSON.parse(str);
          } catch {
            return str
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }),
      ])
      .optional(),
    whatYouWillLearn: z
      .union([
        z.array(z.string()),
        z.string().transform((str) => {
          if (!str || str.trim() === "") return [];
          try {
            return JSON.parse(str);
          } catch {
            return str
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }),
      ])
      .optional(),
    thumbnail: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.price === 0 && data.discountPrice) {
      ctx.addIssue({
        path: ["discountPrice"],
        message: "Free courses cannot have a discount price",
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.discountPrice !== undefined &&
      data.price !== undefined &&
      data.discountPrice >= data.price
    ) {
      ctx.addIssue({
        path: ["discountPrice"],
        message: "Discount price must be less than price",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;

// export const updateCourseSchema = z
//   .object({
//     title: z
//       .string()
//       .min(10, "Title must be at least 10 characters")
//       .max(200, "Title cannot exceed 200 characters")
//       .optional(),

//     subtitle: z
//       .string()
//       .max(300, "Subtitle cannot exceed 300 characters")
//       .optional(),

//     description: z
//       .string()
//       .min(10, "Description must be at least 10 characters for updates")
//       .optional(),

//     category: z.string().optional(),
//     price: z
//       .number()
//       .min(0, "Price cannot be negative")
//       .multipleOf(0.01, "Price must be a valid monetary value")
//       .optional(),

//     discountPrice: z
//       .number()
//       .min(0, "Discount price cannot be negative")
//       .multipleOf(0.01, "Discount must be a valid monetary value")
//       .optional(),

//     language: z.string().optional(),
//     duration: z.number().min(0).optional(),
//     requirements: z
//       .union([
//         z.array(z.string()),
//         z.string().transform((str) => {
//           if (!str || str.trim() === "") return [];
//           try {
//             return JSON.parse(str);
//           } catch {
//             return str
//               .split(",")
//               .map((s) => s.trim())
//               .filter(Boolean);
//           }
//         }),
//       ])
//       .optional(),
//     whatYouWillLearn: z
//       .union([
//         z.array(z.string()),
//         z.string().transform((str) => {
//           if (!str || str.trim() === "") return [];
//           try {
//             return JSON.parse(str);
//           } catch {
//             return str
//               .split(",")
//               .map((s) => s.trim())
//               .filter(Boolean);
//           }
//         }),
//       ])
//       .optional(),
//     thumbnail: z.string().url().optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.price === 0 && data.discountPrice) {
//       ctx.addIssue({
//         path: ["discountPrice"],
//         message: "Free courses cannot have a discount price",
//         code: z.ZodIssueCode.custom,
//       });
//     }

//     if (
//       data.discountPrice !== undefined &&
//       data.price !== undefined &&
//       data.discountPrice >= data.price
//     ) {
//       ctx.addIssue({
//         path: ["discountPrice"],
//         message: "Discount price must be less than price",
//         code: z.ZodIssueCode.custom,
//       });
//     }
//   });

// export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;

///SECTIONS
export const createSectionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional().nullable().or(z.literal("")),
});

export type CreateSectionSchema = z.infer<typeof createSectionSchema>;

export const updateSectionSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(1000).optional().nullable().or(z.literal("")),
});

export type UpdateSectionSchema = z.infer<typeof updateSectionSchema>;

export const reorderSectionSchema = z.object({
  sectionOrders: z
    .array(
      z.object({
        sectionId: z.string(),
        order: z.number().int().min(1),
      }),
    )
    .min(1),
});

export type ReorderSectionSchema = z.infer<typeof reorderSectionSchema>;

///LESSONS
export const createLessonSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional().nullable().or(z.literal("")),
  type: z.enum(["VIDEO", "ARTICLE"]),
  // videoUrl: z.string().url().optional(),
  // videoDuration: z.coerce.number().int().min(0).optional(),
  articleContent: z.string().optional(),
  isFree: z
    .union([
      z.boolean(),
      z.string().transform((val) => val === "true" || val === "1"),
    ])
    .optional()
    .default(false),
  isPublished: z.boolean().optional(),
});

export type CreateLessonSchema = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional().nullable().or(z.literal("")),
  type: z.enum(["VIDEO", "ARTICLE"]),
  // videoUrl: z.string().url().optional().nullable().or(z.literal("")),
  // videoDuration: z.coerce.number().int().min(0).optional().nullable(),
  articleContent: z.string().optional().nullable().or(z.literal("")),
  isFree: z
    .union([
      z.boolean(),
      z.string().transform((val) => val === "true" || val === "1"),
    ])
    .optional()
    .default(false),
  isPublished: z.boolean().optional(),
});

export type UpdateLessonSchema = z.infer<typeof updateLessonSchema>;

export const reorderLessonSchema = z.object({
  lessonOrders: z
    .array(
      z.object({
        lessonId: z.string(),
        order: z.number().int().min(1),
      }),
    )

    .min(1),
});

export type ReorderLessonSchema = z.infer<typeof reorderLessonSchema>;

export const addAttachmentSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  size: z.number().int().min(0).optional(),
});
export type AddAttachmentSchema = z.infer<typeof addAttachmentSchema>;

////FOR CREATING COURSES IN OUR MULTI STEP
export const step1Schema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(200),
  subtitle: z.string().max(300).optional(),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

export const step2Schema = z
  .object({
    category: z.string().min(1, "Please select a category"),
    price: z.coerce
      .number()
      .min(0, "Price must be 0 or greater")
      .multipleOf(0.01),
    discountPrice: z.coerce.number().min(0).multipleOf(0.01).optional(),
    language: z.string().default("en"),
  })
  .superRefine((data, ctx) => {
    if (data.price === 0 && data.discountPrice) {
      ctx.addIssue({
        path: ["discountPrice"],
        message: "Free courses cannot have a discount price",
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.discountPrice !== undefined &&
      data.price !== undefined &&
      data.discountPrice >= data.price
    ) {
      ctx.addIssue({
        path: ["discountPrice"],
        message: "Discount price must be less than price",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const step3Schema = z.object({
  requirements: z
    .union([
      z.array(z.string()),
      z.string().transform((str) => {
        if (!str || str.trim() === "") return [];
        try {
          return JSON.parse(str);
        } catch {
          return str
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }),
    ])
    .optional(),
  whatYouWillLearn: z
    .union([
      z.array(z.string()),
      z.string().transform((str) => {
        if (!str || str.trim() === "") return [];
        try {
          return JSON.parse(str);
        } catch {
          return str
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }),
    ])
    .optional(),
  thumbnail: z
    .union([z.string(), z.instanceof(File)])
    .nullable()
    .optional(),
});

export const stepCreateCourseSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type CreateCourseFormData = z.infer<typeof stepCreateCourseSchema>;

export const sectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Section title is required")
    .max(100, "Title is too long"),
  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export type SectionFormValues = z.infer<typeof sectionSchema>;
