import axios from "axios";
import { backendUrl } from "./resourceApi";

export const getAnalyticsApi = async () => {
  const response = await axios.get(`${backendUrl}/analytics`, {
    withCredentials: true,
  });
  return response.data;
};

export type Department = {
  id: string;
  name: string;
  _count: { users: number; resources: number };
};

export const fetchDepartmentsApi = async (): Promise<{
  success: boolean;
  departments: Department[];
}> => {
  const response = await axios.get(`${backendUrl}/departments`, {
    withCredentials: true,
  });
  return response.data;
};

export const addDepartmentApi = async (name: string) => {
  const response = await axios.post(
    `${backendUrl}/departments`,
    { name },
    { withCredentials: true },
  );
  return response.data;
};
