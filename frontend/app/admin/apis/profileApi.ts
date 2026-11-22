import { api } from "@/lib/apiClient";

export type AdminProfile = {
  success: boolean;
  code: string;
  message: string;
  id: string;
  username: string;
  role: string | null;
  email: string;
  companyId: string | null;
  companyName: string | null;
  address: string | null;
  companyEmail: string | null;
  description: string | null;
  departmentId: string | null;
  departmentName: string | null;
  joinedAt: string | null;
};

export type UpdateProfileResponse = {
  success: boolean;
  code: string;
  message: string;
  requiresRelogin: boolean;
  data: {
    id: string;
    username: string;
    email: string;
    description: string | null;
  };
};

export const fetchAdminProfileApi = async (): Promise<AdminProfile> => {
  const response = await api.get(`/profile`);
  return response.data;
};

export const updateAdminProfileApi = async (data: {
  username?: string;
  email?: string;
  description?: string;
}): Promise<UpdateProfileResponse> => {
  const response = await api.patch(`/profile`, data);
  return response.data;
};

export const changePasswordApi = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.patch(`/profile/password`, data);
  return response.data as {
    success: boolean;
    code: string;
    message: string;
  };
};
