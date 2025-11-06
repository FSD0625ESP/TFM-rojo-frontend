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
