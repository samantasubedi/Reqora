import { AxiosResponse } from "axios";
import { api } from "@/lib/apiClient";
import type { MyItemsParams, MyResourceItem } from "./types";

export const getMyItemsApi = async (params?: MyItemsParams) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    code: string;
    data: MyResourceItem[];
  }> = await api.get(`/my-items`, { params });
  return response.data;
};

export const releaseItemApi = async (resourceItemId: string) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    code: string;
  }> = await api.post(`/resources/release`, { resourceItemId });
  return response.data;
};
