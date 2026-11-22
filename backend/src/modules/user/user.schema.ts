import { z } from "zod/v3";

export const updateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "username is required")
    .min(3, "username must be at least 3 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  description: z
    .string()
    .max(2000, "description must be at most 2000 characters")
    .optional(),
});
export type updateProfileType = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "current password is required"),
  newPassword: z
    .string()
    .min(1, "new password is required")
    .min(8, "new password must be at least 8 characters"),
});
export type changePasswordType = z.infer<typeof changePasswordSchema>;
