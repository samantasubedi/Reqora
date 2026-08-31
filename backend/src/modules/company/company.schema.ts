import z from "zod/v3";

export const createCompanySchema=z.object({
companyName:z.string().min(1,"company name is required"),
email:z.string().email("Invalid email address"),
size:z.number().min(1,"company size is required"),
address:z.string().optional()
})
