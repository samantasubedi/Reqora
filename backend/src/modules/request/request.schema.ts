import { number } from "zod";
import z from "zod/v3";
export const createRequestSchema = z.object({
  requestedQuantity: z.number().min(0, "request quantity is required"),
  resourceId: z.string().min(1, "resource Id is required"),
});
