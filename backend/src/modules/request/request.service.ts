import { appError } from "../../utils/appError";
import { findByUsername } from "../auth/auth.repository";
import {
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
  return requestDetails
};
