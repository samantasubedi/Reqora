import { useMutation } from "@tanstack/react-query";
import { LoginApi } from "../apis/authApi";
import { T_MutaionError } from "@/types/global";

export const useLogin = () => {
  return useMutation<
    Awaited<ReturnType<typeof LoginApi>>,
    T_MutaionError,
    Parameters<typeof LoginApi>[0]
  >({
    mutationFn: LoginApi,
  });
};
