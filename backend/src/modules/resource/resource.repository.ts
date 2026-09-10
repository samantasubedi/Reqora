import { Prisma, ResourceStatus } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const findResourceById = async ({ id }: { id: string }) => {
  return await prisma.resource.findUnique({ where: { id } });
};
export const findAllResources = async ({
  companyId,
  skip,
  take,
  search,
  status,
  resourceDepartmentSearch,
  resourceTypeSearch,
  availableQuantity,
}: {
  companyId: string;
  skip: number;
  take: number;
  search?: string;
  status?: ResourceStatus;
  resourceTypeSearch?: string;
  resourceDepartmentSearch?: string;

  availableQuantity?: number;
}) => {
  return await prisma.resource.findMany({
    skip,
    take,
    where: {
      companyId,
      status,
      type: { contains: resourceTypeSearch },
      department: { contains: resourceDepartmentSearch },
      availableQuantity: { gte: availableQuantity },
      name: { contains: search },
    },
  });
};
