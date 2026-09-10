import { useQuery } from "@tanstack/react-query";
import { fetchResourceApi, fetchResourcesApi } from "../apis/resourceApi";
import { ParamValue } from "next/dist/server/request/params";
import { T_MutationError } from "@/types/global";
import { FilterValues } from "@/components/global/Filter";

export const useResources = () => {
  return useQuery({
    queryFn: () => fetchResourcesApi({}),
    queryKey: ["resourceData"],
  });
};
export const useResource = (id: ParamValue) => {
  return useQuery<
    Awaited<ReturnType<typeof fetchResourceApi>>,
    T_MutationError
  >({
    queryFn: () => fetchResourceApi(id),
    queryKey: ["resourceDetails", id],
  });
};
export const useTableResources = ({
  searchText,
  filters,
  page,
}: {
  searchText: string;
  filters: FilterValues;
  page: number;
}) => {
  const pageNumber = String(page);
  return useQuery({
    queryFn: () => fetchResourcesApi({ searchText, filters, page: pageNumber }),
    queryKey: ["tableResourceData", searchText, filters, page],
  });
};
