import { appError } from "../../utils/appError";
import { findByUsername } from "../auth/auth.repository";
import { findUserByEmail } from "../company/company.repository";
import { findResourceById } from "../resource/resource.repository";
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
      reviewedBy: curr.reviewedBy?.username,
      requestedBy: curr.requestedBy.username,
      companyName: curr.company.companyName,
      resourceName: curr.resource.name,
    };
  });
  return allRequests;
};
export const getMyRequestService = async ({
  username,
  companyId,
}: {
  username: string;
  companyId: string;
}) => {
  const userInfo = await findByUsername({ username });
  if (!userInfo) {
    throw new Error("User information couldnt be found");
  }

  const myRequests = await findRequestsByUserId({
    companyId,
    userId: userInfo.id,
  });

  const requestData = myRequests.map((curr) => {
    //we are doing this because we get an array not an object
    return {
      requestId: curr.id,
      status: curr.status,
      requestedQuantity: curr.requestedQuantity,
      resourceId: curr.resourceId,
      reviewedBy: curr.reviewedBy?.username,
      requestedBy: curr.requestedBy.username,
      companyName: curr.company.companyName,
      resourceName: curr.resource.name,
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
    throw new appError(400, "INVALID_EMAIL", "unable to retrive user details");
  }
  const resourceDetails = await findResourceById({ id: resourceId });
  if (!resourceDetails) {
    throw new appError(400, "INVALID_ID", "unable to retrive resource details");
  }
  const availableQuantity = resourceDetails.availableQuantity;
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
