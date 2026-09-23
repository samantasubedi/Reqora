import z from "zod/v3";
import { ResourceStatus } from "../../generated/prisma/enums";

const locationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "location name is required")
    .min(3, "location name must be at least 3 characters"),
});

export const locationAssignmentSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("single"),
    location: locationSchema,
  }),
  z.object({
    mode: z.literal("multiple"),
    locations: z
      .array(
        z.object({
          location: locationSchema,
          quantity: z.coerce
            .number()
            .int("quantity must be a whole number")
            .positive("quantity must be a positive integer"),
        }),
      )
      .min(1, "at least one location is required")
      .refine(
        (locations) =>
          new Set(locations.map((l) => l.location.name)).size ===
          locations.length,
        "duplicate locations are not allowed",
      ),
  }),
]);
export type locationAssignmentType = z.infer<typeof locationAssignmentSchema>;

export const statusAssignmentSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("same"),
    status: z.nativeEnum(ResourceStatus),
  }),
  z.object({
    mode: z.literal("different"),
    statuses: z
      .array(
        z.object({
          status: z.nativeEnum(ResourceStatus),
          quantity: z.coerce
            .number()
            .int("quantity must be a whole number")
            .positive("quantity must be a positive integer"),
        }),
      )
      .min(1, "at least one status is required")
      .refine(
        (statuses) =>
          new Set(statuses.map((s) => s.status)).size === statuses.length,
        "duplicate statuses are not allowed",
      ),
  }),
]);
export type statusAssignmentType = z.infer<typeof statusAssignmentSchema>;

export const ResourceSchema = z
  .object({
    resourceName: z
      .string()
      .trim()
      .min(1, "resource name is required")
      .min(3, "name must be at least 3 characters"),
    quantity: z.coerce
      .number()
      .int("quantity must be a whole number")
      .min(1, "quantity must be at least 1"),
    type: z.string().min(1, "type is required"),
    statusAssignment: statusAssignmentSchema,
    locationAssignment: locationAssignmentSchema,
    departmentId: z.string().min(1, "department is required"),
    description: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.locationAssignment.mode === "multiple") {
      const assigned = data.locationAssignment.locations.reduce(
        (sum, l) => sum + l.quantity,
        0,
      );
      if (assigned !== data.quantity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["locationAssignment", "locations"],
          message: `sum of location quantities (${assigned}) must equal total quantity (${data.quantity})`,
        });
      }
    }
    if (data.statusAssignment.mode === "different") {
      const assigned = data.statusAssignment.statuses.reduce(
        (sum, s) => sum + s.quantity,
        0,
      );
      if (assigned !== data.quantity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["statusAssignment", "statuses"],
          message: `sum of status quantities (${assigned}) must equal total quantity (${data.quantity})`,
        });
      }
    }
  });
export type addResourceType = z.infer<typeof ResourceSchema>;

// export const editResourceSchema = z.object({
//   id: z.string().min(1, "resource id is required"),
//   name: z.string().trim().min(1, "resource name is required"),
//   type: z.string().min(1, "type is required"),
//   departmentId: z.string().min(1, "department is required"),
//   location: z.string().min(1).optional(),
//   quantity: z.coerce.number().min(1).optional(),
// });
// export type editResourceType = z.infer<typeof editResourceSchema>;

export const releaseResourceSchema = z.object({
  resourceItemId: z.string().min(1, "resource item id is required"),
});
export type releaseResourceType = z.infer<typeof releaseResourceSchema>;
