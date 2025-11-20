import { z } from "zod";

export const userNameSchema = z
  .string()
  .trim()
  .min(3, "Full name must be at least 3 characters")
  .max(30, "Full name must be at most 30 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Full name can only contain letters, numbers, underscores and hyphens",
  })
  .transform((val) => val.toLowerCase());

export const registerSchema = z
  .object({
    userName: userNameSchema,
    email: z
      .string()
      .email("Invalid email")
      .transform((val) => val.toLowerCase().trim()),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase().trim()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const forgotSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase().trim()),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

//schema para actualizar squad
export const updateSquadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Squad name is required")
    .max(100, "Squad name must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .default(""),
});