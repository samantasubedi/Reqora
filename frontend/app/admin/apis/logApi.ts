import axios from "axios";
import { backendUrl } from "./resourceApi";

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
  const response = await axios.get(`${backendUrl}/logs`, {
    withCredentials: true,
    params: { page, pageSize },
  });
  return response.data;
};