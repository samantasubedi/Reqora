import { AxiosResponse } from "axios";
import { api } from "@/lib/apiClient";
import type { MyResourceItem } from "./types";

export const getMyItemsApi = async (params?: { limit?: number }) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    code: string;
    data: MyResourceItem[];
  }> = await api.get(`/my-items`, { params });
  return response.data;
};
