import { useQuery } from "@tanstack/react-query";
import { getEmployeeDashboardApi } from "../apis/dashboardApi";
import { employeeQueryKeys } from "../apis/types";

export const useEmployeeDashboard = () => {
  return useQuery({
    queryKey: employeeQueryKeys.dashboard(),
    queryFn: getEmployeeDashboardApi,
  });
};
