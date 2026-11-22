import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addDepartmentApi,
  deleteDepartmentApi,
  fetchCompanyApi,
  fetchDepartmentsApi,
  getAnalyticsApi,
  leaveCompanyApi,
  updateCompanyApi,
  updateDepartmentApi,
} from "../apis/companyApi";
import type { UpdateCompanyPayload } from "../apis/companyApi";
import { T_MutationError } from "@/types/global";

export const useAnalytics = () => {
  return useQuery({
    queryFn: getAnalyticsApi,
    queryKey: ["analytics"],
  });
};

export const useDepartments = () => {
  return useQuery({
    queryFn: fetchDepartmentsApi,
    queryKey: ["departments"],
  });
};

export const useAddDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof addDepartmentApi>>,
    T_MutationError,
    string
  >({
    mutationFn: addDepartmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof updateDepartmentApi>>,
    T_MutationError,
    { id: string; name: string }
  >({
    mutationFn: updateDepartmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof deleteDepartmentApi>>,
    T_MutationError,
    string
  >({
    mutationFn: deleteDepartmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useCompany = () => {
  return useQuery({
    queryFn: fetchCompanyApi,
    queryKey: ["company"],
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof updateCompanyApi>>,
    T_MutationError,
    UpdateCompanyPayload
  >({
    mutationFn: updateCompanyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });
};

export const useLeaveCompany = () => {
  return useMutation<
    Awaited<ReturnType<typeof leaveCompanyApi>>,
    T_MutationError,
    void
  >({
    mutationFn: leaveCompanyApi,
  });
};
