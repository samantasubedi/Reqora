import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  cancelRequestApi,
  createRequestApi,
  getMyRequestsApi,
} from "../apis/requestApi";
import { getMyItemsApi } from "../apis/myItemsApi";
import { employeeQueryKeys, MyRequestsParams } from "../apis/types";
import { T_MutationError } from "@/types/global";

export const useCreateRequest = (
  options?: UseMutationOptions<
    any,
    T_MutationError,
    {
      resourceId: string;
      requestedQuantity: number;
      priority?: "low" | "medium" | "high";
      reason?: string;
    }
  >,
) => {
  {
    return useMutation({
      mutationFn: createRequestApi,
      ...options,
    });
  }
};

export const useMyRequests = (params?: MyRequestsParams) => {
  return useQuery({
    queryKey: employeeQueryKeys.myRequests(params),
    queryFn: () => getMyRequestsApi(params),
    placeholderData: keepPreviousData,
  });
};

export const useCancelRequest = (
  options?: UseMutationOptions<any, T_MutationError, string>,
) => {
  return useMutation({
    mutationFn: cancelRequestApi,
    ...options,
  });
};

export const useMyItems = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: [...employeeQueryKeys.myItems(), params],
    queryFn: () => getMyItemsApi(params),
  });
};
