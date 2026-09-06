import axios, { AxiosResponse } from "axios";
import { resourceType } from "../components/AdminDashboard";
import {
  countByStatusType,
  countByTypeType,
} from "@/components/others/BarChart";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const fetchResourcesApi = async () => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
    allResources: resourceType[];
    countsByType: countByTypeType;
    countsByStatus: countByStatusType;
  }> = await axios.get(`${backendUrl}/resources`, { withCredentials: true });
  return response.data;
};
