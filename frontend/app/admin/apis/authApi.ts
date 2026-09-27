import { api } from "@/lib/apiClient";
import { Role } from "@/types/global";
import { AxiosResponse } from "axios";
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
  }> = await api.post(`/login`, loginData);
  return response.data;
};
export const RegisterApi = async (registerData: {
  username: string;
  password: string;
  email: string;
}) => {
  const response = await api.post(`/register`, registerData);
  return response.data;
};
