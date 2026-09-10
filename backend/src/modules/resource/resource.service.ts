import { Prisma, ResourceStatus } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { findAllResources } from "./resource.repository";

export const findAllResourcesService = async ({
  companyId,
  skip,
  take,
  search,
  status,
  type,
  availability,
  availableQuantity,
}: {
  companyId: string;
  skip: number;
  take: number;
  search?: string;
  status?: ResourceStatus;
  type?: string;
  availability?: boolean;
  availableQuantity?: number;
}) => {
  const resources = await findAllResources({
    companyId,
    skip,
    take,
    search,
    status,
    type,
    availability,
    availableQuantity,
  });
  const countsByStatus = await prisma.resource.groupBy({
    by: ["status"],
    _count: true,
  });

  const countsByType = await prisma.resource.groupBy({
    by: ["type"],
    _count: true,
  });
  const totalCountWithoutFilters = await prisma.resource.count();

  const totalCount = await prisma.resource.count({
    where: {
      companyId,
      status,
      type,
      availability,
      availableQuantity,
      name: { contains: search },
    },
  });
  const totalPages = Math.ceil(totalCount / take);
  return { resources, countsByStatus, countsByType, totalPages,totalResources:totalCountWithoutFilters };
};
