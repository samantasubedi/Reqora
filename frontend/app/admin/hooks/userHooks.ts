import { FilterValues } from "@/components/global/Filter";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersApi, getUserDetailsApi } from "../apis/userApi";
import { ParamValue } from "next/dist/server/request/params";

export const useUsers = () => {
  return useQuery({
    queryFn: () => getAllUsersApi,
    queryKey: ["allUsers"],
  });
};
export const useUser = ({ id }: { id: ParamValue }) => {
  return useQuery({
    queryFn: () => getUserDetailsApi({ id:String(id) }),
    queryKey: ["users"],
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
    queryKey: ["userData", searchText, filters, page],
  });
};
