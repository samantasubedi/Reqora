import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  getAllRequestsApi,
  reviewRequestApi,
} from "../apis/requestApi";
import { T_MutationError } from "@/types/global";

export const useRequests = () => {
  return useQuery({
    queryFn: () => getAllRequestsApi(),
    queryKey: ["requests"],
  });
};

export const useReviewRequest = (
  options: UseMutationOptions<
    any,
    T_MutationError,
    { requestId: string; status: "approved" | "rejected" }
  >,
) => {
  return useMutation({
    mutationFn: reviewRequestApi,
    ...options,
  });
};