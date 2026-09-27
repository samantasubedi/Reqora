import { api } from "@/lib/apiClient";
export type Department = {
  id: string;
  name: string;
  _count: { users: number; resources: number };
};

export const getAnalyticsApi = async () => {
  const response = await api.get(`/analytics`);
  return response.data;
};


export const fetchDepartmentsApi = async (): Promise<{
  success: boolean;
  departments: Department[];
}> => {
  const response = await api.get(`/departments`);
  return response.data;
};

export const addDepartmentApi = async (name: string) => {
  const response = await api.post(`/departments`, { name });
  return response.data;
};
