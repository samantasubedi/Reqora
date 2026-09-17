import { ResourceStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const findResourceById = async ({ id }: { id: string }) => {
  return prisma.resource.findUnique({ where: { id } });
};

export const findAllResources = async ({
  companyId,
  skip,
  take,
  search,
  resourceTypeSearch,
  resourceDepartmentSearch,
  resourceIds,
}: {
  companyId: string;
  skip: number;
  take: number;
  search?: string;
  resourceTypeSearch?: string;
  resourceDepartmentSearch?: string;
  resourceIds?: string[];
}) => {
  return prisma.resource.findMany({
    skip,
    take,
    where: {
      companyId,
      id: resourceIds ? { in: resourceIds } : undefined,
      name: { contains: search },
      type: { contains: resourceTypeSearch },
      department: { name: { contains: resourceDepartmentSearch } },
    },
    include: {
      department: { select: { name: true } },
      resourceItems: {
        select: {
          id: true,
          status: true,
          location: true,
          acquiredById: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findResourceIdsWithMinAvailable = async ({
  companyId,
  min,
}: {
  companyId: string;
  min: number;
}) => {
  const grouped = await prisma.resourceItem.groupBy({
    by: ["resourceId"],
    _count: true,
    where: {
      status: ResourceStatus.available,
      resource: { companyId },
    },
    having: {
      resourceId: { _count: { gte: min } },
    },
  });
  return grouped.map((group) => group.resourceId);
};

export const countResources = async ({
  companyId,
  search,
  resourceTypeSearch,
  resourceDepartmentSearch,
  resourceIds,
}: {
  companyId: string;
  search?: string;
  resourceTypeSearch?: string;
  resourceDepartmentSearch?: string;
  resourceIds?: string[];
}) => {
  return prisma.resource.count({
    where: {
      companyId,
      id: resourceIds ? { in: resourceIds } : undefined,
      name: { contains: search },
      type: { contains: resourceTypeSearch },
      department: { name: { contains: resourceDepartmentSearch } },
    },
  });
};

export const countAllResources = async ({
  companyId,
}: {
  companyId: string;
}) => {
  return prisma.resource.count({ where: { companyId } });
};

export const countResourceItemsByStatus = async ({
  companyId,
}: {
  companyId: string;
}) => {
  return prisma.resourceItem.groupBy({
    by: ["status"],
    _count: true,
    where: { resource: { companyId } },
  });
};

export const countResourcesByType = async ({
  companyId,
}: {
  companyId: string;
}) => {
  return prisma.resource.groupBy({
    by: ["type"],
    _count: true,
    where: { companyId },
  });
};

export const createResourceWithItems = async ({
  name,
  type,
  companyId,
  departmentId,
  statuses,
  locations,
}: {
  name: string;
  type: string;
  companyId: string;
  departmentId: string;
  statuses: { status: ResourceStatus; quantity: number }[];
  locations: { name: string; quantity: number }[];
}) => {
  return prisma.$transaction(async (tx) => {
    const resource = await tx.resource.create({
      data: {
        name,
        type,
        companyId,
        departmentId,
      },
    });

    const statusSlots = statuses.flatMap(({ status, quantity: qty }) =>
      Array.from({ length: qty }, () => status),
    );

    const locationSlots = locations.flatMap(({ name: loc, quantity: qty }) =>
      Array.from({ length: qty }, () => loc),
    );

    const items = statusSlots.map((status, index) => ({
      status,
      location: locationSlots[index] ?? "Unknown",
      resourceId: resource.id,
    }));

    await tx.resourceItem.createMany({ data: items });

    return resource;
  });
};

export const findResourceDetailsById = async ({ id }: { id: string }) => {
  return prisma.resource.findUnique({
    where: { id },
    include: {
      department: { select: { name: true } },
      resourceItems: {
        orderBy: { createdAt: "desc" },
        include: {
          acquiredBy: { select: { username: true } },
        },
      },
      requests: {
        select: {
          id: true,
          requestedQuantity:true,
          requestedBy: true,
          reviewedBy: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
};

export const editResource = async ({
  id,
  name,
  type,
  departmentId,
  location,
  newItems,
  deleteItemIds,
}: {
  id: string;
  name: string;
  type: string;
  departmentId: string;
  location?: string;
  newItems?: { status: ResourceStatus; location: string }[];
  deleteItemIds?: string[];
}) => {
  return prisma.$transaction(async (tx) => {
    if (deleteItemIds && deleteItemIds.length > 0) {
      await tx.resourceItem.deleteMany({
        where: { id: { in: deleteItemIds } },
      });
    }

    if (newItems && newItems.length > 0) {
      await tx.resourceItem.createMany({
        data: newItems.map((item) => ({
          status: item.status,
          location: item.location,
          resourceId: id,
        })),
      });
    }

    if (location) {
      await tx.resourceItem.updateMany({
        where: { resourceId: id },
        data: { location },
      });
    }

    return tx.resource.update({
      where: { id },
      data: { name, type, departmentId },
    });
  });
};

export const deleteResourceWithDependencies = async ({
  id,
}: {
  id: string;
}) => {
  return prisma.$transaction(async (tx) => {
    await tx.request.deleteMany({ where: { resourceId: id } });
    await tx.resourceItem.deleteMany({ where: { resourceId: id } });
    await tx.resource.delete({ where: { id } });
  });
};

export const findResourceItemById = async ({ id }: { id: string }) => {
  return prisma.resourceItem.findUnique({
    where: { id },
    include: {
      resource: { select: { companyId: true } },
    },
  });
};

export const releaseResourceItem = async ({ id }: { id: string }) => {
  return prisma.resourceItem.update({
    where: { id },
    data: {
      acquiredById: null,
      status: ResourceStatus.available,
    },
  });
};
