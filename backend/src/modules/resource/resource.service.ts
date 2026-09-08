import { Prisma, ResourceStatus } from "../../generated/prisma/client";
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
  companyId:string,
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
  return resources;
};
