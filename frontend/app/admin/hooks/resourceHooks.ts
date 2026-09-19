import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  addResourceApi,
  editResourceApi,
  fetchResourceApi,
  fetchResourcesApi,
} from "../apis/resourceApi";
import { ParamValue } from "next/dist/server/request/params";
import { T_MutationError } from "@/types/global";
import { FilterValues } from "@/components/global/Filter";
import { formDataType } from "../components/ResourceForm";

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
export type resourceDataType = formDataType & {
  statusAssignment:
    | {
        mode: "same";
        status: string;
      }
    | {
        mode: "different";
        statuses: {
          status: string;
          quantity: number;
        }[];
      };
  locationAssignment:
    | {
        mode: "single";
        location: {
          name: string;
        };
      }
    | {
        mode: "multiple";
        locations: {
          location: {
            name: string;
          };
          quantity: number;
        }[];
      };
};
export const useAddResource = (
  options: UseMutationOptions<any, T_MutationError, resourceDataType>,
) => {
  {
    return useMutation({
      mutationFn: addResourceApi,
      ...options,
    });
  }
};
export const useEditResource = (
  options: UseMutationOptions<
    any,
    T_MutationError,
    { data: resourceDataType; id: ParamValue }
  >,
) => {
  {
    return useMutation({
      mutationFn: editResourceApi,
      ...options,
    });
  }
};
