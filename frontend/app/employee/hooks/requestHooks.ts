import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  cancelRequestApi,
  createRequestApi,
  editRequestApi,
  getMyRequestsApi,
  getRequestDetailApi,
} from "../apis/requestApi";
import { getMyItemsApi, releaseItemApi } from "../apis/myItemsApi";
import { employeeQueryKeys, MyItemsParams, MyRequestsParams } from "../apis/types";
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

export const useRequestDetail = (requestId: string) => {
  return useQuery({
    queryKey: employeeQueryKeys.myRequest(requestId),
    queryFn: () => getRequestDetailApi(requestId),
    enabled: !!requestId,
    retry: false,
  });
};

export const useEditRequest = (
  options?: UseMutationOptions<
    any,
    T_MutationError,
    { requestId: string; requestedQuantity?: number; priority?: "low" | "medium" | "high"; reason?: string | null }
  >,
) => {
  return useMutation({
    mutationFn: editRequestApi,
    ...options,
  });
};

export const useMyItems = (params?: MyItemsParams) => {
  return useQuery({
    queryKey: [...employeeQueryKeys.myItems(), params],
    queryFn: () => getMyItemsApi(params),
    placeholderData: keepPreviousData,
  });
};

export const useReleaseItem = (
  options?: UseMutationOptions<any, T_MutationError, string>,
) => {
  return useMutation({
    mutationFn: releaseItemApi,
    ...options,
  });
};
