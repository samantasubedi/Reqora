import { useQuery } from "@tanstack/react-query";
import { getAnalyticsApi } from "../apis/companyApi";

export const useAnalytics = () => {
  return useQuery({
    queryFn: getAnalyticsApi,
    queryKey: ["analytics"],
  });
};
