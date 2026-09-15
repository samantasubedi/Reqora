import { FilterValues } from "@/components/global/Filter";
import axios from "axios";
import { backendUrl } from "./resourceApi";

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
export const getUserDetailsApi = async ({ id }: { id: string }) => {
  const response = await axios.get(`${backendUrl}/user/${id}`);
  return response.data;
};
