import z from "zod/v3";

export const createCompanySchema = z.object({
  companyName: z
    .string()
    .min(1, "company name is required")
    .min(3, "name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  size: z.number().min(1, "company size is required"),
  address: z.string(),
});
export type createCompanyType = z.infer<typeof createCompanySchema>;
export const emailInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "manager", "employee"]),
  expiryTime: z.number(),
  message: z.string(),
  departmentId: z.string().min(1, "department is required"),
});
export type emailInviteType = z.infer<typeof emailInviteSchema>;
export const generateCodeSchema = z.object({
  role: z.enum(["admin", "manager", "employee"]),
  expiryTime: z.number().min(1, "expiry time is required"),
  departmentId: z.string().min(1, "department is required"),
});
export type generateCodeType = z.infer<typeof generateCodeSchema>;
export const joinByEmailSchema=z.object({
  joinToken:z.string().min(1,"join code is required")
})
export const joinByCodeSchema=z.object({
  joinCode:z.string().min(1,"join code is required")
})

export const addDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "department name is required")
    .min(3, "department name must be at least 3 characters"),
});
export type addDepartmentType = z.infer<typeof addDepartmentSchema>;