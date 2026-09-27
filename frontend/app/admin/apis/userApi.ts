import { FilterValues } from "@/components/global/Filter";
import { api } from "@/lib/apiClient";
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
  const response = await api.get(`/users`, {
    params: paramsObj,
  });
  return response.data;
};
export const getUserDetailsApi = async ({ id }: { id: string }) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
export const updateUserByAdminApi = async ({
  id,
  role,
  departmentId,
}: {
  id: string;
  role?: string;
  departmentId?: string;
}) => {
  const response = await api.patch(`/users/${id}`, { role, departmentId });
  return response.data;
};
export const deleteUserApi = async ({ id }: { id: string }) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
export const inviteByEmailApi=async(data:emailInviteFormType)=>{
 const response = await api.post(`/invite/emailInvite`, data);
    return response.data;
}
  export const inviteByCodeApi = async (data: codeInviteFormType) => {
    const response = await api.post(`/invite/codeInvite`, data);
    return response.data;
  };