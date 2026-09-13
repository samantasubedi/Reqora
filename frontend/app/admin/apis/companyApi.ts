import axios from "axios";
import { backendUrl } from "./resourceApi";
import { FilterValues } from "@/components/global/Filter";

export const getAnalyticsApi = async () => {
  const response = await axios.get(`${backendUrl}/analytics`, {
    withCredentials: true,
  });
  return response.data;
};
export const getAllUsersApi = async ({
  searchText,
  page,
  filters,
}: {
  searchText?: string;
  page?: string;
  filters?: FilterValues;
}) => {
  const paramsObj = searchText
    ? { search: searchText, ...filters }
    : { page: page, ...filters };
  const response = await axios.get(`${backendUrl}/users`, {
    withCredentials: true,
    params: paramsObj,
  });
  return response.data;
};
