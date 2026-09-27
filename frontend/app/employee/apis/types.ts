export type EmployeeRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "forwarded";

export type MyRequestItem = {
  requestId: string;
  status: EmployeeRequestStatus;
  requestedQuantity: number;
  resourceId: string;
  resourceName: string;
  resourceType?: string;
  reviewedBy?: string | null;
  reviewedById?: string | null;
  requestedBy: string;
  requestedById?: string;
  requestedByDepartment?: string | null;
  companyName: string;
  createdAt: string;
  updatedAt: string;
};

export type MyResourceItem = {
  id: string;
  name: string;
  type: string;
  department: string | null;
  location: string;
  assignedAt: string;
  status: string;
  note?: string | null;
};

export const employeeQueryKeys = {
  myRequests: (filters?: Record<string, unknown>) =>
    filters ? (["myRequests", filters] as const) : (["myRequests"] as const),
  myRequest: (id: string) => ["myRequest", id] as const,
  myItems: () => ["myItems"] as const,
  employeeStats: () => ["employeeStats"] as const,
};
