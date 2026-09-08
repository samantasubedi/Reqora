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
  return await prisma.resource.findMany({
    skip,
    take,
    where: {
      companyId,
      status,
      type,
      availability,
      availableQuantity,
      name: { contains: search },
    },
  });
};
