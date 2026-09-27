import { appError } from "../../utils/appError";
import {
  Priority,
  RequestStatus,
  ResourceStatus,
} from "../../generated/prisma/enums";
import { findByUsername } from "../auth/auth.repository";
import { findUserByEmail } from "../company/company.repository";
import {
  findResourceById,
  findResourceDetailsById,
} from "../resource/resource.repository";
import {
  createRequest,
  findRequestById,
  findRequestsByCompanyId,
  findRequestsByUserId,
} from "./request.repository";

export const getAllRequestService = async ({
  companyId,
}: {
  companyId: string;
}) => {
  const result = await findRequestsByCompanyId({ companyId });

  const allRequests = result.map((curr) => {
    //we are doing this because we get an array not an object
    return {
      requestId: curr.id,
      status: curr.status,
      requestedQuantity: curr.requestedQuantity,
      priority: curr.priority,
      reason: curr.reason,
      note: curr.note,
      resourceId: curr.resourceId,
      resourceName: curr.resource.name,
      resourceType: curr.resource.type,
      reviewedBy: curr.reviewedBy?.username,
      reviewedById: curr.reviewedBy?.id,
      requestedBy: curr.requestedBy.username,
      requestedById: curr.requestedBy.id,
      requestedByDepartment: curr.requestedBy.department?.name ?? null,
      companyName: curr.company.companyName,
      createdAt: curr.createdAt,
      updatedAt: curr.updatedAt,
    };
  });
  return allRequests;
};

const PRIORITY_ORDER: Record<Priority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export type MyRequestsQuery = {
  search?: string;
  status?: RequestStatus;
  /** comma-separated resource types */
  type?: string;
  reviewer?: string;
  /** comma-separated priorities */
  priority?: string;
  sortBy?: "date" | "name" | "status" | "priority";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export const getMyRequestService = async ({
  username,
  companyId,
  search,
  status,
  type,
  reviewer,
  priority,
  sortBy = "date",
  order = "desc",
  page = 1,
  limit,
}: {
  username: string;
  companyId: string;
} & MyRequestsQuery) => {
  const userInfo = await findByUsername({ username });
  if (!userInfo) {
    throw new appError(404, "USER_NOT_FOUND", "User information couldn't be found");
  }

  // Single fetch for one user's rows (volumes are small per user), then
  // filter/sort/paginate in memory so priority ordering and counts stay
  // correct. Move to DB-level skip/take + orderBy if this ever grows large.
  const myRequests = await findRequestsByUserId({
    companyId,
    userId: userInfo.id,
  });

  const requestData = myRequests.map((curr) => {
    //we are doing this because we get an array not an object
    return {
      requestId: curr.id,
      status: curr.status,
      requestedQuantity: curr.requestedQuantity,
      priority: curr.priority,
      reason: curr.reason,
      note: curr.note,
      resourceId: curr.resourceId,
      reviewedBy: curr.reviewedBy?.username ?? null,
      reviewedById: curr.reviewedBy?.id ?? null,
      requestedBy: curr.requestedBy.username,
      requestedById: curr.requestedBy.id,
      requestedByDepartment: curr.requestedBy.department?.name ?? null,
      companyName: curr.company.companyName,
      resourceName: curr.resource.name,
      resourceType: curr.resource.type,
      createdAt: curr.createdAt,
      updatedAt: curr.updatedAt,
    };
  });

  const countsByStatus = {
    total: requestData.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    forwarded: 0,
  };
  for (const r of requestData) {
    if (r.status === RequestStatus.pending) countsByStatus.pending += 1;
    else if (r.status === RequestStatus.approved) countsByStatus.approved += 1;
    else if (r.status === RequestStatus.rejected) countsByStatus.rejected += 1;
    else if (r.status === RequestStatus.cancelled)
      countsByStatus.cancelled += 1;
    else if (r.status === RequestStatus.forwarded)
      countsByStatus.forwarded += 1;
  }

  const reviewers = [
    ...new Set(
      requestData.map((r) => r.reviewedBy).filter((n): n is string => !!n),
    ),
  ].sort();
  const types = [...new Set(requestData.map((r) => r.resourceType))].sort();

  const oldestPendingAt = requestData
    .filter((r) => r.status === RequestStatus.pending)
    .reduce<Date | null>(
      (oldest, r) =>
        !oldest || r.createdAt < oldest ? r.createdAt : oldest,
      null,
    );

  const q = search?.trim().toLowerCase();
  const typeList = type ? type.split(",").filter(Boolean) : [];
  const priorityList = priority ? priority.split(",").filter(Boolean) : [];
  const filtered = requestData.filter((r) => {
    if (status && r.status !== status) return false;
    if (typeList.length > 0 && !typeList.includes(r.resourceType)) return false;
    if (reviewer && r.reviewedBy !== reviewer) return false;
    if (priorityList.length > 0 && !priorityList.includes(r.priority))
      return false;
    if (
      q &&
      !r.resourceName.toLowerCase().includes(q) &&
      !r.requestId.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  const dir = order === "asc" ? 1 : -1;
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.resourceName.localeCompare(b.resourceName) * dir;
      case "status":
        return a.status.localeCompare(b.status) * dir;
      case "priority":
        return (
          ((PRIORITY_ORDER[a.priority] ?? 1) -
            (PRIORITY_ORDER[b.priority] ?? 1)) *
          dir
        );
      case "date":
      default:
        return (
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
          dir
        );
    }
  });

  // limit-only callers (e.g. dashboard recent list) get the first N rows.
  if (limit !== undefined && page === 1 && !search && !status && !type && !reviewer) {
    const sliced = filtered.slice(0, limit);
    return {
      requests: sliced,
      total: filtered.length,
      totalPages: 1,
      currentPage: 1,
      countsByStatus,
      reviewers,
      types,
      oldestPendingAt,
    };
  }

  const pageLimit = limit && limit > 0 && limit <= 100 ? limit : 8;
  const safePage = page && page > 0 ? page : 1;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageLimit));
  const currentPage = Math.min(safePage, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * pageLimit,
    currentPage * pageLimit,
  );

  return {
    requests: paged,
    total,
    totalPages,
    currentPage,
    countsByStatus,
    reviewers,
    types,
    oldestPendingAt,
  };
};
export const getRequestDetailsService = async ({ id }: { id: string }) => {
  const requestDetails = await findRequestById({ id });
  return requestDetails;
};
export const createRequestService = async ({
  email,
  companyId,
  requestedQuantity,
  resourceId,
  priority,
  reason,
}: {
  email: string;
  companyId: string;
  requestedQuantity: number;
  resourceId: string;
  priority?: "low" | "medium" | "high";
  reason?: string;
}) => {
  const userDetails = await findUserByEmail({ email });
  if (!userDetails) {
    throw new appError(404, "USER_NOT_FOUND", "unable to retrive user details");
  }
  const resourceDetails = await findResourceDetailsById({ id: resourceId });
  if (!resourceDetails) {
    throw new appError(404, "RESOURCE_NOT_FOUND", "unable to retrive resource details");
  }

  const availableQuantity = resourceDetails.resourceItems.filter(
    (item) => item.status === ResourceStatus.available,
  ).length;

  if (availableQuantity < requestedQuantity) {
    throw new appError(
      400,
      "INVALID_REQUEST",
      "requested quantity of resource is unavailable",
    );
  }
  const createdRequest = await createRequest({
    requestedById: userDetails.id,
    requestedQuantity,
    resourceId,
    companyId,
    priority,
    reason,
  });
  return createdRequest;
};
