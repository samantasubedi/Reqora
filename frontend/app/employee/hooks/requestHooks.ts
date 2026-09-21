import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { createRequestApi } from "../apis/requestApi";
import { T_MutationError } from "@/types/global";

export const useCreateRequest = (
  options: UseMutationOptions<
    any,
    T_MutationError,
    { resourceId: string; requestedQuantity: number }
  >,
) => {
  {
    return useMutation({
      mutationFn: createRequestApi,
      ...options,
    });
  }
};