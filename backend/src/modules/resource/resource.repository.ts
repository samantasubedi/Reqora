import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const findResourceById = async ({ id }: { id: string }) => {
  return await prisma.resource.findUnique({ where: { id } });
};
export const findAllResources = async ({
  skip,
  take,
  where,
}: {
  skip: number;
  take: number;
  where: Prisma.resourceWhereInput;
}) => {
  return await prisma.resource.findMany({
    skip,
    take,
    where,
  });
};
