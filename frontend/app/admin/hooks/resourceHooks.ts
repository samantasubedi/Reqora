import { useQuery } from "@tanstack/react-query";
import { fetchResourcesApi } from "../apis/resourceApi";

export const useResources=()=>{
  return   useQuery({
    queryFn: fetchResourcesApi,
    queryKey: ["resourceData"],
  });
}