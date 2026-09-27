import z from "zod/v3";
export const createRequestSchema = z.object({
  requestedQuantity: z.number().min(1, "request quantity is required"),
  resourceId: z.string().min(1, "resource Id is required"),
  priority: z.enum(["low", "medium", "high"]).optional(),
  reason: z.string().max(2000, "reason is too long").optional(),
});
export const editRequestSchema = z.object({
  requestedQuantity: z.number().min(1, "quantity must be at least 1").optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  reason: z.string().max(2000, "reason is too long").nullable().optional(),
});
