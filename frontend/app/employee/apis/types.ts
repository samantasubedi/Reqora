export type EmployeeRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "forwarded";

export type EmployeePriority = "low" | "medium" | "high";

export type MyRequestItem = {
  requestId: string;
  status: EmployeeRequestStatus;
  requestedQuantity: number;
  priority: EmployeePriority;
  reason: string | null;
  note: string | null;
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

export type MyRequestsResponse = {
  success: boolean;
  message: string;
  code: string;
  data: MyRequestItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  countsByStatus: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    forwarded: number;
  };
  reviewers: string[];
  types: string[];
  oldestPendingAt: string | null;
};

export type MyRequestsParams = {
  search?: string;
  status?: EmployeeRequestStatus;
  type?: string;
  reviewer?: string;
  priority?: EmployeePriority;
  sortBy?: "date" | "name" | "status" | "priority";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type MyResourceItem = {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  department: string | null;
  location: string;
  assignedAt: string;
  status: string;
};

export type MyItemsParams = {
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
};

export type AllocatedItem = {
  id: string;
  status: string;
  location: string;
};

export type RequestDetail = {
  requestId: string;
  status: EmployeeRequestStatus;
  requestedQuantity: number;
  priority: EmployeePriority;
  reason: string | null;
  note: string | null;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  requestedBy: string;
  requestedById: string;
  requestedByDepartment: string | null;
  reviewedBy: string | null;
  reviewedById: string | null;
  companyName: string;
  allocatedItems: AllocatedItem[];
  createdAt: string;
  updatedAt: string;
};

export type EditRequestInput = {
  requestedQuantity?: number;
  priority?: EmployeePriority;
  reason?: string | null;
};

export const employeeQueryKeys = {
  myRequests: (filters?: Record<string, unknown>) =>
    filters ? (["myRequests", filters] as const) : (["myRequests"] as const),
  myRequest: (id: string) => ["myRequest", id] as const,
  myItems: () => ["myItems"] as const,
  employeeStats: () => ["employeeStats"] as const,
};
