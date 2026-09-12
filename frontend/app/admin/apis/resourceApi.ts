import axios, { AxiosResponse } from "axios";

import {
  countByStatusType,
  countByTypeType,
} from "@/components/others/BarChart";
import { FilterValues } from "@/components/global/Filter";
import { ParamValue } from "next/dist/server/request/params";
import { resourceType } from "../resources/page";
export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const fetchResourcesApi = async ({
  searchText,
  filters,
  page
}: {
  searchText?: string | undefined;
  filters?: FilterValues;
  page?:string
}) => {
  const paramsObj = searchText ? { search: searchText, ...filters } : {page:page,...filters};
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    allResources: resourceType[];
    countsByType: countByTypeType;
    countsByStatus: countByStatusType;
    totalPages: number;
    currentPage: number;
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
