import { useQuery } from "@tanstack/react-query";
import {
  getManagerResourceApi,
  getManagerResourcesApi,
} from "../apis/resourceApi";
import {
  managerQueryKeys,
  type ManagerResourcesParams,
} from "../apis/types";

export const useManagerResources = (params: ManagerResourcesParams) => {
  return useQuery({
    queryKey: managerQueryKeys.resources(params),
    queryFn: () => getManagerResourcesApi(params),
  });
};

export const useManagerResource = (id?: string) => {
  return useQuery({
    queryKey: managerQueryKeys.resource(id ?? ""),
    queryFn: () => getManagerResourceApi(id as string),
    enabled: !!id,
  });
};
