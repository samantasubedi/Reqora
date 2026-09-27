import { api } from "@/lib/apiClient";

export type logCategory = "resource" | "request" | "onboarding";

export type logEntryType = {
  id: string;
  category: logCategory;
  action: string;
  description: string;
  actor: string | null;
  timestamp: string;
};

export const getLogsApi = async ({ page, pageSize }: { page?: number; pageSize?: number } = {}) => {
  const response = await api.get(`/logs`, {
    params: { page, pageSize },
  });
  return response.data;
};