import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addDepartmentApi,
  getAnalyticsApi,
  fetchDepartmentsApi,
} from "../apis/companyApi";

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
  return useMutation({
    mutationFn: addDepartmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};