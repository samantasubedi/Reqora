import { Prisma, ResourceStatus } from "../../generated/prisma/client";
import { findAllResources } from "./resource.repository";

export const findAllResourcesService = async ({
  skip,
  take,
  where,
}: {
  skip: number;
  take: number;
  where: Prisma.resourceWhereInput;
}) => {
  const resources = await findAllResources({ skip, take, where });
  return resources;
};
