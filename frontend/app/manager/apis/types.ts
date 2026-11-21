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

export type ManagerResourceStatus =
  | "available"
  | "inUse"
  | "underMaintenance";

export type ManagerResource = {
  id: string;
  name: string;
  type: string;
  department: string | null;
  location: string;
  description: string | null;
  availability: boolean;
  totalQuantity: number;
  availableQuantity: number;
  inUseQuantity: number;
  underMaintenanceQuantity: number;
  createdAt: string;
  updatedAt: string;
};

export type ManagerResourceItem = {
  id: string;
  status: ManagerResourceStatus;
  location: string;
  acquiredById: string | null;
  acquiredBy: { username: string } | null;
  resourceId: string;
  createdAt: string;
  updatedAt: string;
};

export type ManagerResourceDetail = ManagerResource & {
  companyId: string;
  departmentId: string;
  resourceItems: ManagerResourceItem[];
};

export type ManagerResourcesResponse = {
  success: boolean;
  message: string;
  allResources: ManagerResource[];
  countsByStatus: { status: string; _count: number }[];
  countsByType: { type: string; _count: number }[];
  totalPages: number;
  currentPage: number;
};

export type ManagerResourceDetailResponse = {
  success: boolean;
  message: string;
  resourceDetail: ManagerResourceDetail;
};

export type ManagerResourcesParams = {
  search?: string;
  resourceTypeSearch?: string;
  availability?: "inStock" | "outOfStock";
  page?: number;
  limit?: number;
};

export const managerQueryKeys = {
  requests: () => ["managerRequests"] as const,
  resources: (params?: ManagerResourcesParams) =>
    params
      ? (["managerResources", params] as const)
      : (["managerResources"] as const),
  resource: (id: string) => ["managerResource", id] as const,
};
