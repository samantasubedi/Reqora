import { appError } from "../../utils/appError";
import { ResourceStatus } from "../../generated/prisma/enums";
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
export const getMyRequestService = async ({
  username,
  companyId,
  limit,
}: {
  username: string;
  companyId: string;
  limit?: number;
}) => {
  const userInfo = await findByUsername({ username });
  if (!userInfo) {
    throw new appError(404, "USER_NOT_FOUND", "User information couldn't be found");
  }

  const myRequests = await findRequestsByUserId({
    companyId,
    userId: userInfo.id,
    take: limit,
  });

  const requestData = myRequests.map((curr) => {
    //we are doing this because we get an array not an object
    return {
      requestId: curr.id,
      status: curr.status,
      requestedQuantity: curr.requestedQuantity,
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
  return requestData;
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
}: {
  email: string;
  companyId: string;
  requestedQuantity: number;
  resourceId: string;
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
  });
  return createdRequest;
};
