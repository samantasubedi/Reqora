import axios from "axios";
import { backendUrl } from "./resourceApi";

export type requestType = {
  requestId: string;
  status: string;
  requestedQuantity: number;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  reviewedBy?: string;
  reviewedById?: string;
  requestedBy: string;
  requestedById: string;
  requestedByDepartment?: string | null;
  companyName: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllRequestsApi = async () => {
  const response = await axios.get(`${backendUrl}/requests`, {
    withCredentials: true,
  });
  return response.data;
};

export const reviewRequestApi = async ({
  requestId,
  status,
}: {
  requestId: string;
  status: "approved" | "rejected";
}) => {
  const response = await axios.post(
    `${backendUrl}/requests/${requestId}/review`,
    { requestId, status },
    { withCredentials: true },
  );
  return response.data;
};