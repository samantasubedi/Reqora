import { useQuery } from "@tanstack/react-query";
import { fetchResources } from "../apis/resourceApi";

export const useResources=()=>{
  return   useQuery({
    queryFn: fetchResources,
    queryKey: ["resourceData"],
  });
}