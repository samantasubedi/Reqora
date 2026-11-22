import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePasswordApi,
  fetchAdminProfileApi,
  updateAdminProfileApi,
} from "../apis/profileApi";
import type { UpdateProfileResponse } from "../apis/profileApi";
import { T_MutationError } from "@/types/global";

export const useAdminProfile = () => {
  return useQuery({
    queryFn: fetchAdminProfileApi,
    queryKey: ["adminProfile"],
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateProfileResponse,
    T_MutationError,
    { username?: string; email?: string; description?: string }
  >({
    mutationFn: updateAdminProfileApi,
    onSuccess: (data) => {
      if (data.requiresRelogin) return;
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      queryClient.invalidateQueries({ queryKey: ["retrivedProfileInfo"] });
      queryClient.invalidateQueries({ queryKey: ["profile detail"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation<
    Awaited<ReturnType<typeof changePasswordApi>>,
    T_MutationError,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: changePasswordApi,
  });
};
