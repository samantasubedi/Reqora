import axios, { AxiosResponse } from "axios";
import { resourceType } from "../components/AdminDashboard";
import {
  countByStatusType,
  countByTypeType,
} from "@/components/others/BarChart";
import { FilterValues } from "@/components/global/Filter";
import { ParamValue } from "next/dist/server/request/params";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const fetchResourcesApi = async ({
  searchText,
  filters,
}: {
  searchText?: string | undefined;
  filters?: FilterValues;
}) => {
  const paramsObj = searchText ? { search: searchText, ...filters } : filters;
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    allResources: resourceType[];
    countsByType: countByTypeType;
    countsByStatus: countByStatusType;
  }> = await axios.get(`${backendUrl}/resources`, {
    withCredentials: true,
    params: paramsObj,
  });
  return response.data;
};
export const fetchResourceApi = async (id: ParamValue) => {
  const response = await axios.get(`${backendUrl}/resource/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
