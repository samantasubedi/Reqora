import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addDepartmentApi,
  getAnalyticsApi,
  fetchDepartmentsApi,
} from "../apis/companyApi";
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