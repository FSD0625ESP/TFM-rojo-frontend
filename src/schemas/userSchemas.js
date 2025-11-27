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

//schema para actualizar perfil
export const updateProfileSchema = z.object({
  //datos de contacto
  firstName: z
    .string()
    .trim()
    .max(50, "First name must be at most 50 characters")
    .optional()
    .default(""),
  lastName: z
    .string()
    .trim()
    .max(50, "Last name must be at most 50 characters")
    .optional()
    .default(""),
  phone: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (val) => {
        if (!val || val === "") return true; // Permitir vacío
        return val.length <= 20 && /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(val);
      },
      {
        message: "Invalid phone number format (max 20 characters)",
      }
    ),
  discord: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (val) => {
        if (!val || val === "") return true; // Permitir vacío
        return val.length <= 50 && (/^.{3,32}#[0-9]{4}$|^.{3,32}$/).test(val);
      },
      {
        message: "Invalid Discord format. Use: username#1234 or username",
      }
    ),
  hobbies: z
    .string()
    .trim()
    .max(200, "Hobbies must be at most 200 characters")
    .optional()
    .default(""),

  //biografia
  bio: z
    .string()
    .trim()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .default(""),

  //direccion
  city: z
    .string()
    .trim()
    .max(100, "City must be at most 100 characters")
    .optional()
    .default(""),
  country: z
    .string()
    .trim()
    .max(100, "Country must be at most 100 characters")
    .optional()
    .default(""),

  //datos de LOL
  gameName: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (val) => {
        if (!val || val === "") return true; // Permitir vacío
        return val.length >= 3 && val.length <= 16 && /^[a-zA-Z0-9\s]+$/.test(val);
      },
      {
        message: "Game name must be 3-16 characters (letters, numbers and spaces only)",
      }
    ),
  tagLine: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (val) => {
        if (!val || val === "") return true; // Permitir vacío
        return val.length >= 3 && val.length <= 5 && /^[a-zA-Z0-9]+$/.test(val);
      },
      {
        message: "Tag line must be 3-5 characters (letters and numbers only)",
      }
    ),
  region: z
    .enum(
      ["EUW", "EUNE", "NA", "LAN", "LAS", "KR", "JP", "OCE", "BR", "TR", "RU"],
      {
        message: "Invalid region",
      }
    )
    .optional()
    .default("EUW"),
  roleLol: z
    .enum(["Top", "Jungle", "Mid", "ADC", "Support"], {
      message: "Invalid role",
    })
    .optional(),
  tier: z
    .enum(["I", "II", "III", "IV"], {
      message: "Invalid tier",
    })
    .optional()
    .nullable(),
  ranks: z
    .enum(
      [
        "Challenger",
        "Grandmaster",
        "Master",
        "Diamond",
        "Emerald",
        "Platinum",
        "Gold",
        "Silver",
        "Bronze",
        "Iron",
      ],
      {
        message: "Invalid rank",
      }
    )
    .optional()
    .nullable(),
});