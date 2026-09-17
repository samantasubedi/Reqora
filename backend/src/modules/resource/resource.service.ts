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
  companyId,
}: {
  resourceName: string;
  quantity: number;
  type: string;
  statusAssignment: statusAssignmentType;
  locationAssignment: locationAssignmentType;
  departmentId: string;
  companyId: string;
}) => {
  const department = await findDepartmentById({ id: departmentId });
  if (!department || department.companyId !== companyId) {
    throw new appError(
      400,
      "INVALID_DEPARTMENT",
      "department does not belong to this company",
    );
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
  id,
  name,
  type,
  departmentId,
  location,
  quantity,
  companyId,
}: {
  id: string;
  name: string;
  type: string;
  departmentId: string;
  location?: string;
  quantity?: number;
  companyId: string;
}) => {
  const resource = await findResourceById({ id });
  if (!resource || resource.companyId !== companyId) {
    throw new appError(400, "INVALID_ID", "resource not found");
  }

  const department = await findDepartmentById({ id: departmentId });
  if (!department || department.companyId !== companyId) {
    throw new appError(
      400,
      "INVALID_DEPARTMENT",
      "department does not belong to this company",
    );
  }

  let newItems: { status: ResourceStatus; location: string }[] | undefined;
  let deleteItemIds: string[] | undefined;

  if (quantity !== undefined) {
    const currentDetails = await findResourceDetailsById({ id });
    const currentItems = currentDetails?.resourceItems ?? [];
    const currentCount = currentItems.length;

    if (quantity > currentCount) {
      const extra = quantity - currentCount;
      const fallbackLocation =
        location ?? currentItems[0]?.location ?? "Unknown";
      newItems = Array.from({ length: extra }, () => ({
        status: ResourceStatus.available,
        location: fallbackLocation,
      }));
    } else if (quantity < currentCount) {
      const toRemove = currentCount - quantity;
      const removable = currentItems
        .filter(
          (item) =>
            item.status === ResourceStatus.available &&
            item.acquiredById === null,
        )
        .slice(0, toRemove);
      if (removable.length < toRemove) {
        throw new appError(
          400,
          "QUANTITY_REDUCE_FAILED",
          "cannot reduce quantity, not enough available items",
        );
      }
      deleteItemIds = removable.map((item) => item.id);
    }
  }

  return editResource({
    id,
    name,
    type,
    departmentId,
    location,
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
