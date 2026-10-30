import { AxiosResponse } from "axios";
import { api } from "@/lib/apiClient";
import type { ManagerRequestsResponse } from "./types";

export const getManagerRequestsApi = async () => {
  const response: AxiosResponse<ManagerRequestsResponse> =
    await api.get(`/requests`);
  return response.data;
};

export const reviewManagerRequestApi = async ({
  requestId,
  status,
  note,
}: {
  requestId: string;
  status: "approved" | "rejected";
  note?: string;
}) => {
  const response = await api.post(`/requests/${requestId}/review`, {
    requestId,
    status,
    note,
  });
  return response.data;
};

export const forwardManagerRequestApi = async (requestId: string) => {
  const response = await api.post(`/requests/${requestId}/forward`);
  return response.data;
};
