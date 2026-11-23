import { api } from "@/lib/apiClient";

export type Department = {
  id: string;
  name: string;
  _count: { users: number; resources: number };
};

export type CompanyIndustry =
  | "technology"
  | "finance"
  | "healthcare"
  | "education"
  | "retail"
  | "manufacturing"
  | "construction"
  | "hospitality"
  | "legal"
  | "other";

export type Company = {
  id: string;
  companyName: string;
  email: string;
  address: string;
  size: number;
  website: string | null;
  phoneNumber: string | null;
  industry: CompanyIndustry | null;
  createdAt: string;
  updatedAt: string;
};

export type CompanyResponse = {
  success: boolean;
  code: string;
  message: string;
  data: Company;
};

export type UpdateCompanyPayload = {
  companyName: string;
  email: string;
  address: string;
  size: number;
  industry: CompanyIndustry;
  website?: string;
  phoneNumber?: string;
};

export type MonthlyPoint = { label: string; value: number };

export type AdminAnalytics = {
  success: boolean;
  code: string;
  message: string;
  resourceStats: {
    countsByStatus: Array<{ status: string; _count: number }>;
    countsByType: Array<{ type: string; _count: number }>;
    resourcesByMonth: MonthlyPoint[];
  };
  userStats: {
    countsByRole: Array<{ role: string; _count: number }>;
    countsByDepartment: Array<{ name: string; _count: { users: number } }>;
    usersByMonth: MonthlyPoint[];
  };
};

export const getAnalyticsApi = async (): Promise<AdminAnalytics> => {
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

export const updateDepartmentApi = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const response = await api.patch(`/departments/${id}`, { name });
  return response.data;
};

export const deleteDepartmentApi = async (id: string) => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};

export const fetchCompanyApi = async (): Promise<CompanyResponse> => {
  const response = await api.get(`/company`);
  return response.data;
};

export const updateCompanyApi = async (data: UpdateCompanyPayload) => {
  const response = await api.patch(`/company`, data);
  return response.data as CompanyResponse;
};

export const leaveCompanyApi = async () => {
  const response = await api.post(`/leave`, null);
  return response.data;
};
