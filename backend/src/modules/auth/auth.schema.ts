import { z } from "zod/v3";
export const registerSchema = z.object({
  username: z.string().min(1, "username is required"),
  email: z.string().email("invalid email"),
  password: z
    .string()
    .min(1, "password is required")
    .min(8, "invalid password, password must be at least 8 characters"),
});
export type registerType = z.infer<typeof registerSchema>;
export const loginSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z
    .string()
    .min(1, "password is required")
    .min(8, "invalid password, password must be at least 8 characters"),
});
export type loginType = z.infer<typeof loginSchema>;
