import { AxiosResponse } from "axios";
import { api } from "@/lib/apiClient";
import type {
  EditRequestInput,
  MyRequestsParams,
  MyRequestsResponse,
  RequestDetail,
} from "./types";

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const createRequestApi = async ({
  resourceId,
  requestedQuantity,
  priority,
  reason,
}: {
  resourceId: string;
  requestedQuantity: number;
  priority?: "low" | "medium" | "high";
  reason?: string;
}) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
  }> = await api.post(`/requests`, {
    resourceId,
    requestedQuantity,
    priority,
    reason,
  });
  return response.data;
};

export const getMyRequestsApi = async (params?: MyRequestsParams) => {
  const response: AxiosResponse<MyRequestsResponse> = await api.get(
    `/myRequests`,
    { params },
  );
  return response.data;
};

export const cancelRequestApi = async (requestId: string) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    code: string;
  }> = await api.post(`/requests/${requestId}/cancel`);
  return response.data;
};

export const getRequestDetailApi = async (requestId: string) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    code: string;
    data: RequestDetail;
  }> = await api.get(`/requests/${requestId}`);
  return response.data;
};

export const editRequestApi = async ({
  requestId,
  ...data
}: EditRequestInput & { requestId: string }) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    code: string;
  }> = await api.patch(`/requests/${requestId}`, data);
  return response.data;
};