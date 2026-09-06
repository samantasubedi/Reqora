import { useMutation } from "@tanstack/react-query";
import { LoginApi, RegisterApi } from "../apis/authApi";
import { T_MutationError } from "@/types/global";

export const useLogin = () => {
  return useMutation<
    Awaited<ReturnType<typeof LoginApi>>,
    T_MutationError,
    Parameters<typeof LoginApi>[0]
  >({
    mutationFn: LoginApi,
  });
};
export const useRegister = () => {
  return useMutation
  <
    Awaited<ReturnType<typeof RegisterApi>>,
    T_MutationError,
    Parameters<typeof RegisterApi>[0]
  >({
    mutationFn: RegisterApi,
  });
};
