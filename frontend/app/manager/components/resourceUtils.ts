import type { ManagerResource } from "../apis/types";

export type ResourceCounts = {
  total: number;
  available: number;
  inUse: number;
  underMaintenance: number;
};

export type AvailabilityLevel = "available" | "low" | "out";

export const getResourceCounts = (
  resource: ManagerResource,
): ResourceCounts => ({
  total: resource.totalQuantity,
  available: resource.availableQuantity,
  inUse: resource.inUseQuantity,
  underMaintenance: resource.underMaintenanceQuantity,
});

export const getAvailabilityLevel = (
  available: number,
  total: number,
): AvailabilityLevel => {
  if (available === 0) return "out";
  if (total > 0 && available / total <= 0.3) return "low";
  return "available";
};
