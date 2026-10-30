export type ManagerRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "forwarded";

export type ManagerPriority = "low" | "medium" | "high";

export type ManagerRequest = {
  requestId: string;
  status: ManagerRequestStatus;
  requestedQuantity: number;
  priority: ManagerPriority;
  reason: string | null;
  note: string | null;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  reviewedBy: string | null;
  reviewedById: string | null;
  requestedBy: string;
  requestedById: string;
  requestedByEmail: string;
  requestedByDepartment: string | null;
  requestedByDepartmentId: string | null;
  companyName: string;
  createdAt: string;
  updatedAt: string;
};

export type ManagerRequestsResponse = {
  success: boolean;
  message: string;
  code: string;
  data: ManagerRequest[];
};

export const managerQueryKeys = {
  requests: () => ["managerRequests"] as const,
};
