import { FilterValues } from "@/components/global/Filter";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  deleteUserApi,
  getAllUsersApi,
  getUserDetailsApi,
  inviteByCodeApi,
  inviteByEmailApi,
  updateUserByAdminApi,
} from "../apis/userApi";
import { ParamValue } from "next/dist/server/request/params";
import { T_MutationError } from "@/types/global";
import { emailInviteFormType } from "../components/EmailInviteForm";
import { codeInviteFormType } from "../components/InviteCodeGenerator";

export const useUsers = () => {
  return useQuery({
    queryFn: () => getAllUsersApi,
    queryKey: ["allUsers"],
  });
};
export const useUser = ({ id }: { id: ParamValue }) => {
  return useQuery({
    queryFn: () => getUserDetailsApi({ id: String(id) }),
    queryKey: ["users", id],
  });
};
export const useUserTable = ({
  searchText,
  filters,
  page,
}: {
  searchText?: string;
  page?: number;
  filters?: FilterValues;
}) => {
  const pageNumber = String(page);
  return useQuery({
    queryFn: () => getAllUsersApi({ searchText, filters, page: pageNumber }),
    queryKey: ["userData", searchText, filters, page],
  });
};
export const useEmailInvite = (
  options: UseMutationOptions<any, T_MutationError, emailInviteFormType>,
) => {
  return useMutation({
    mutationFn: inviteByEmailApi,
    ...options,
  });
};
export const useCodeInvite = (
  options: UseMutationOptions<any, T_MutationError, codeInviteFormType>,
) => {
  return useMutation({
    mutationFn: inviteByCodeApi,
    ...options,
  });
};
export const useUpdateUserByAdmin = (
  options: UseMutationOptions<
    any,
    T_MutationError,
    { id: string; role?: string; departmentId?: string }
  >,
) => {
  return useMutation({
    mutationFn: updateUserByAdminApi,
    ...options,
  });
};
export const useDeleteUser = (
  options: UseMutationOptions<any, T_MutationError, { id: string }>,
) => {
  return useMutation({
    mutationFn: deleteUserApi,
    ...options,
  });
};
