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

export const getLogsApi = async () => {
  const response = await axios.get(`${backendUrl}/logs`, {
    withCredentials: true,
  });
  return response.data;
};