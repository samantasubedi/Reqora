import { api } from "@/lib/apiClient";

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
  const response = await api.get(`/requests`);
  return response.data;
};

export const reviewRequestApi = async ({
  requestId,
  status,
}: {
  requestId: string;
  status: "approved" | "rejected";
}) => {
  const response = await api.post(`/requests/${requestId}/review`, {
    requestId,
    status,
  });
  return response.data;
};