import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { createRequestApi, getMyRequestsApi } from "../apis/requestApi";
import { getMyItemsApi } from "../apis/myItemsApi";
import { employeeQueryKeys } from "../apis/types";
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

export const useMyRequests = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: employeeQueryKeys.myRequests(params),
    queryFn: () => getMyRequestsApi(params),
  });
};

export const useMyItems = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: [...employeeQueryKeys.myItems(), params],
    queryFn: () => getMyItemsApi(params),
  });
};