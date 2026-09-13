import { useQuery } from "@tanstack/react-query";
import { getAllUsersApi, getAnalyticsApi } from "../apis/companyApi";
import { FilterValues } from "@/components/global/Filter";

export const useAnalytics = () => {
  return useQuery({
    queryFn: getAnalyticsApi,
    queryKey: ["analytics"],
  });
};
export const useUsers = () => {
  return useQuery({
    queryFn: () => getAllUsersApi,
    queryKey: ["allUsers"],
  });
};
export const useUserTable = ({
  searchText,
  filters,
  page,
}: {
  searchText?: string;
  page?: number;
  filters?: FilterValues;
}) => {
  const pageNumber = String(page);
  return useQuery({
    queryFn: () => getAllUsersApi({ searchText, filters, page: pageNumber }),
    queryKey: ["userData",searchText,filters,page],
  });
};
