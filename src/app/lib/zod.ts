import { object, string } from "zod";

export const registerSchema = object({
  username: string({ required_error: "Username is required" })
    .min(1, "Username is required")
    .max(32, "Username must be less than 32 characters")
    .toLowerCase()
    .trim(),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email")
    .toLowerCase()
    .trim(),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signInSchema = object({
  identifier: string()
    .min(1, "Username or email is required")
    .max(32, "Username or email must be less than 32 characters")
    .toLowerCase()
    .trim(),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const identifierSchema = object({
  identifier: string().min(1).max(32).toLowerCase().trim(),
});

export const otpSchema = object({
  identifier: string()
    .min(1, "Username or email is required")
    .max(32, "Username or email must be less than 32 characters")
    .toLowerCase()
    .trim(),
  code: string().regex(/^\d+$/, "Code must be a number").min(0).max(999999),
});
