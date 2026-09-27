import { AxiosResponse } from "axios";
import { api } from "@/lib/apiClient";

import { FilterValues } from "@/components/global/Filter";
import { ParamValue } from "next/dist/server/request/params";
import { ResourceStatus, resourceType } from "../resources/(with-sidebar)/page";
import { ResourceItemDetail } from "@/components/others/ResourceTabs";
import {
  countsByStatusType,
  countsByTypeType,
} from "../components/AdminDashboard";
import { resourceDataType } from "../hooks/resourceHooks";
export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export type requestType = {
  id: string;
  requestedQuantity: number;
  requestedBy: { username: string; id: string };
  reviewedBy: { username: string; id: string };
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
};
export type resourceDetailType = {
  id: string;
  name: string;
  location: string;
  department: string | null;
  departmentId:string,
  description:string|null,
  type: string;
  availability: boolean;
  totalQuantity: number;
  inUseQuantity: number;
  underMaintenanceQuantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  requests: requestType[];
  resourceItems: ResourceItemDetail[];
};
export const fetchResourcesApi = async ({
  searchText,
  filters,
  page,
}: {
  searchText?: string | undefined;
  filters?: FilterValues;
  page?: string;
}) => {
  const paramsObj = searchText
    ? { search: searchText, ...filters }
    : { page: page, ...filters };
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    allResources: resourceType[];
    countsByType: countsByTypeType[];
    countsByStatus: countsByStatusType[];
    totalPages: number;
    currentPage: number;
  }> = await api.get(`/resources`, {
    params: paramsObj,
  });
  return response.data;
};
export const fetchResourceApi = async (id: ParamValue) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    resourceDetail: resourceDetailType;
  }> = await api.get(`/resource/${id}`);
  return response.data;
};
export  const addResourceApi = async (data:resourceDataType) => {
    const response = await api.post(`/resources`, data);
    return response.data;
  };
  export  const editResourceApi = async ({data,id}:{data:resourceDataType,id:ParamValue}) => {
    const response = await api.patch(`/resources/${id}`, data);
    return response.data;
  };
  export const deleteResourceApi = async (id: ParamValue) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  };