import { appError } from "../../utils/appError";
import { ResourceStatus } from "../../generated/prisma/enums";
import {
  locationAssignmentType,
  statusAssignmentType,
} from "./resource.schema";
import {
  findDepartmentById,
  findUserByEmail,
} from "../company/company.repository";
import {
  countAllResources,
  countResourceItemsByStatus,
  countResources,
  countResourcesByType,
  createResourceWithItems,
  deleteResourceWithDependencies,
  editResource,
  findAllResources,
  findResourceDetailsById,
  findResourceIdsWithMinAvailable,
  findResourceById,
  findResourceItemById,
  releaseResourceItem,
} from "./resource.repository";

export const findAllResourcesService = async ({
  companyId,
  skip,
  take,
  search,
  resourceTypeSearch,
  resourceDepartmentSearch,
  availableQuantity,
}: {
  companyId: string;
  skip: number;
  take: number;
  search?: string;
  resourceTypeSearch?: string;
  resourceDepartmentSearch?: string;
  availableQuantity?: number;
}) => {
  let resourceIds: string[] | undefined;
  if (availableQuantity !== undefined) {
    resourceIds = await findResourceIdsWithMinAvailable({
      companyId,
      min: availableQuantity,
    });
  }

  const [resources, countsByStatus, countsByType, totalResources, totalCount] =
    await Promise.all([
      findAllResources({
        companyId,
        skip,
        take,
        search,
        resourceTypeSearch,
        resourceDepartmentSearch,
        resourceIds,
      }),
      countResourceItemsByStatus({ companyId }),
      countResourcesByType({ companyId }),
      countAllResources({ companyId }),
      countResources({
        companyId,
        search,
        resourceTypeSearch,
        resourceDepartmentSearch,
        resourceIds,
      }),
    ]);

  const totalPages = Math.ceil(totalCount / take);
  return {
    resources,
    countsByStatus,
    countsByType,
    totalPages,
    totalResources,
  };
};

export const addResourceService = async ({
  resourceName,
  quantity,
  type,
  statusAssignment,
  locationAssignment,
  departmentId,
  description,
  companyId,
}: {
  resourceName: string;
  quantity: number;
  type: string;
  statusAssignment: statusAssignmentType;
  locationAssignment: locationAssignmentType;
  departmentId: string;
  description?: string | null;
  companyId: string;
}) => {
  const department = await findDepartmentById({ id: departmentId });
  if (!department || department.companyId !== companyId) {
    throw new appError(400, "INVALID_DEPARTMENT", "department does not exist");
  }

  const locations =
    locationAssignment.mode === "single"
      ? [{ name: locationAssignment.location.name, quantity }]
      : locationAssignment.locations.map((l) => ({
          name: l.location.name,
          quantity: l.quantity,
        }));

  const statuses =
    statusAssignment.mode === "same"
      ? [{ status: statusAssignment.status, quantity }]
      : statusAssignment.statuses.map((s) => ({
          status: s.status,
          quantity: s.quantity,
        }));

  return createResourceWithItems({
    name: resourceName,
    type,
    companyId,
    departmentId,
    description,
    statuses,
    locations,
  });
};

export const getSpecificResourceService = async ({
  id,
  companyId,
  status,
}: {
  id: string;
  companyId: string;
  status?: ResourceStatus;
}) => {
  const resource = await findResourceDetailsById({ id });
  if (!resource || resource.companyId !== companyId) {
    throw new appError(404, "INVALID_ID", "invalid resource id");
  }

  const allItems = resource.resourceItems;
  const totalQuantity = allItems.length;
  const availableQuantity = allItems.filter(
    (item) => item.status === ResourceStatus.available,
  ).length;
  const inUseQuantity = allItems.filter(
    (item) => item.status === ResourceStatus.inUse,
  ).length;
  const underMaintenanceQuantity = allItems.filter(
    (item) => item.status === ResourceStatus.underMaintenance,
  ).length;
  const locations = [...new Set(allItems.map((item) => item.location))];

  const resourceItems = status
    ? allItems.filter((item) => item.status === status)
    : allItems;

  return {
    id: resource.id,
    name: resource.name,
    type: resource.type,
    companyId: resource.companyId,
    departmentId: resource.departmentId,
    department: resource.department?.name ?? null,
    location: locations.join(", "),
    description: resource.description,
    availability: availableQuantity > 0,
    totalQuantity,
    availableQuantity,
    inUseQuantity,
    underMaintenanceQuantity,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
    requests: resource.requests,
    resourceItems,
  };
};

export const editResourceService = async ({
  resourceId,
  resourceName,
  type,
  departmentId,
  statusAssignment,
  locationAssignment,
  quantity,
  description,
  companyId,
}: {
  resourceId: string;
  resourceName: string;
  quantity: number;
  type: string;
  departmentId: string;
  description?: string | null;
  statusAssignment: statusAssignmentType;
  locationAssignment: locationAssignmentType;
  companyId: string;
}) => {
  const resource = await findResourceById({ id: resourceId });
  if (!resource || resource.companyId !== companyId) {
    throw new appError(400, "INVALID_ID", "resource not found");
  }

  const department = await findDepartmentById({ id: departmentId });
  if (!department || department.companyId !== companyId) {
    throw new appError(400, "INVALID_DEPARTMENT", "department does not exist");
  }

  const locations =
    locationAssignment.mode === "single"
      ? [{ name: locationAssignment.location.name, quantity }]
      : locationAssignment.locations.map((l) => ({
          name: l.location.name,
          quantity: l.quantity,
        }));

  const statuses =
    statusAssignment.mode === "same"
      ? [{ status: statusAssignment.status, quantity }]
      : statusAssignment.statuses.map((s) => ({
          status: s.status,
          quantity: s.quantity,
        }));

  const existing = await findResourceDetailsById({ id: resourceId });
  const existingItems = existing?.resourceItems ?? [];
  const existingCount = existingItems.length;
  const diff = quantity - existingCount;
  const keepCount = Math.min(quantity, existingCount);

  const locationSlots = locations.flatMap(({ name, quantity: qty }) =>
    Array.from({ length: qty }, () => name),
  );

  const requestedInUse =
    statuses.find((s) => s.status === ResourceStatus.inUse)?.quantity ?? 0;

  const keptItems = existingItems.slice(0, keepCount);
  const locked = keptItems.filter(
    (item) => item.acquiredById || item.status === ResourceStatus.inUse,
  ).length;
  if (requestedInUse < locked) {
    throw new appError(
      400,
      "IN_USE_ITEMS",
      `cannot set ${requestedInUse} in-use: ${locked} item(s) are acquired/in use`,
    );
  }

  const freePool = statuses.flatMap(({ status, quantity: qty }) =>
    Array.from(
      { length: status === ResourceStatus.inUse ? qty - locked : qty },
      () => status,
    ),
  );

  const updatedItems = keptItems.map((item, i) => {
    const lockedItem =
      item.acquiredById || item.status === ResourceStatus.inUse;
    return {
      id: item.id,
      status: lockedItem
        ? ResourceStatus.inUse
        : (freePool.shift() ?? ResourceStatus.available),
      location: locationSlots[i] ?? item.location,
    };
  });

  let newItems: { status: ResourceStatus; location: string }[] | undefined;
  let deleteItemIds: string[] | undefined;

  if (diff > 0) {
    newItems = Array.from({ length: diff }, (_, i) => ({
      status: freePool.shift() ?? ResourceStatus.available,
      location: locationSlots[keepCount + i] ?? "unknown",
    }));
  }

  if (diff < 0) {
    const candidates = existingItems.slice(keepCount);
    const sorted = [...candidates].sort((a, b) => {
      const score = (item: (typeof candidates)[number]) =>
        item.acquiredById
          ? 3
          : item.status === ResourceStatus.inUse
            ? 2
            : item.status === ResourceStatus.underMaintenance
              ? 1
              : 0; // available first
      return score(a) - score(b);
    });

    const protectedCount = sorted.filter(
      (item) => item.acquiredById || item.status === ResourceStatus.inUse,
    ).length;
    if (Math.abs(diff) > sorted.length - protectedCount) {
      throw new appError(
        400,
        "IN_USE_ITEMS",
        "cannot reduce quantity: would need to delete acquired or in-use items",
      );
    }

    deleteItemIds = sorted.slice(0, Math.abs(diff)).map((i) => i.id);
  }

  return editResource({
    resourceId,
    resourceName,
    type,
    departmentId,
    description,
    updatedItems,
    newItems,
    deleteItemIds,
  });
};

export const deleteResourceService = async ({
  id,
  companyId,
}: {
  id: string;
  companyId: string;
}) => {
  const resource = await findResourceById({ id });
  if (!resource || resource.companyId !== companyId) {
    throw new appError(400, "INVALID_ID", "resource not found");
  }
  return deleteResourceWithDependencies({ id });
};

export const releaseResourceService = async ({
  resourceItemId,
  email,
  companyId,
}: {
  resourceItemId: string;
  email: string;
  companyId: string;
}) => {
  const user = await findUserByEmail({ email });
  if (!user) {
    throw new appError(404, "USER_NOT_FOUND", "user not found");
  }

  const item = await findResourceItemById({ id: resourceItemId });
  if (!item || item.resource.companyId !== companyId) {
    throw new appError(400, "INVALID_ID", "resource item not found");
  }

  if (item.acquiredById && item.acquiredById !== user.id) {
    throw new appError(
      400,
      "NOT_ACQUIRED",
      "you can only release a resource item acquired by you",
    );
  }

  return releaseResourceItem({ id: resourceItemId });
};
