import { AxiosResponse } from "axios";
import { api } from "@/lib/apiClient";
import type { EmployeeDashboardResponse } from "./types";

export const getEmployeeDashboardApi = async () => {
  const response: AxiosResponse<EmployeeDashboardResponse> =
    await api.get(`/employeeAnalytics`);
  return response.data;
};
