import { FilterValues } from "@/components/global/Filter";
import axios from "axios";
import { backendUrl } from "./resourceApi";
import { emailInviteFormType } from "../components/EmailInviteForm";
import { codeInviteFormType } from "../components/InviteCodeGenerator";

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
  const response = await axios.get(`${backendUrl}/users/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
export const inviteByEmailApi=async(data:emailInviteFormType)=>{
 const response = await axios.post(
      `${backendUrl}/invite/emailInvite`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
}
  export const inviteByCodeApi = async (data: codeInviteFormType) => {
    const response = await axios.post(`${backendUrl}/invite/codeInvite`, data, {
      withCredentials: true,
    });
    return response.data;
  };