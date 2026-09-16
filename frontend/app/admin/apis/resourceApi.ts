import axios, { AxiosResponse } from "axios";

import { FilterValues } from "@/components/global/Filter";
import { ParamValue } from "next/dist/server/request/params";
import { resourceType } from "../resources/(with-sidebar)/page";
import { ResourceItemDetail } from "@/components/others/ResourceTabs";
import {
  countsByStatusType,
  countsByTypeType,
} from "../components/AdminDashboard";
export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export type resourceDetailType = {
  id: string;
  name: string;
  type: string;
  companyId: string;
  departmentId: string;
  department: string | null;
  location: string;
  availability: boolean;
  totalQuantity: number;
  availableQuantity: number;
  inUseQuantity: number;
  underMaintenanceQuantity: number;
  createdAt: string;
  updatedAt: string;
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
  }> = await axios.get(`${backendUrl}/resources`, {
    withCredentials: true,
    params: paramsObj,
  });
  return response.data;
};
export const fetchResourceApi = async (id: ParamValue) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    resourceDetail: resourceDetailType;
  }> = await axios.get(`${backendUrl}/resource/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
