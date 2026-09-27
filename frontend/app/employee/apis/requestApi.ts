import { AxiosResponse } from "axios";
import { api } from "@/lib/apiClient";

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const createRequestApi = async ({
  resourceId,
  requestedQuantity,
}: {
  resourceId: string;
  requestedQuantity: number;
}) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
  }> = await api.post(`/requests`, { resourceId, requestedQuantity });
  return response.data;
};