import { Role } from "@/types/global";
import axios, { AxiosResponse } from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const LoginApi = async (loginData: {
  username: string;
  password: string;
}) => {
  const response: AxiosResponse<{
    success: string;
    code: string;
    message: string;
    username: string;
    role: Role;
  }> = await axios.post(`${backendUrl}/login`, loginData, {
    withCredentials: true,
  });
  return response.data;
};
