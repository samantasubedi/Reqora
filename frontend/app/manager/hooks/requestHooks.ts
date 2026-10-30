import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  forwardManagerRequestApi,
  getManagerRequestsApi,
  reviewManagerRequestApi,
} from "../apis/requestApi";
import { managerQueryKeys } from "../apis/types";
import { T_MutationError } from "@/types/global";

export const useManagerRequests = () => {
  return useQuery({
    queryKey: managerQueryKeys.requests(),
    queryFn: getManagerRequestsApi,
  });
};

export const useReviewManagerRequest = (
  options: UseMutationOptions<
    any,
    T_MutationError,
    { requestId: string; status: "approved" | "rejected"; note?: string }
  >,
) => {
  return useMutation({
    mutationFn: reviewManagerRequestApi,
    ...options,
  });
};

export const useForwardManagerRequest = (
  options: UseMutationOptions<any, T_MutationError, string>,
) => {
  return useMutation({
    mutationFn: forwardManagerRequestApi,
    ...options,
  });
};
