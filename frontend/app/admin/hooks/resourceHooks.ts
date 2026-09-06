import { useQuery } from "@tanstack/react-query";
import { fetchResourceApi, fetchResourcesApi } from "../apis/resourceApi";
import { ParamValue } from "next/dist/server/request/params";
import { T_MutationError } from "@/types/global";

export const useResources = () => {
  return useQuery({
    queryFn: fetchResourcesApi,
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
