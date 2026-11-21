import { AxiosResponse } from "axios";
import { api } from "@/lib/apiClient";
import type {
  ManagerResourceDetailResponse,
  ManagerResourcesParams,
  ManagerResourcesResponse,
} from "./types";

export const getManagerResourcesApi = async (
  params: ManagerResourcesParams,
) => {
  const response: AxiosResponse<ManagerResourcesResponse> = await api.get(
    "/resources",
    { params },
  );
  return response.data;
};

export const getManagerResourceApi = async (id: string) => {
  const response: AxiosResponse<ManagerResourceDetailResponse> = await api.get(
    `/resource/${id}`,
  );
  return response.data;
};
