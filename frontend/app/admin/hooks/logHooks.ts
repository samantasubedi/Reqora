import { useQuery } from "@tanstack/react-query";
import { getLogsApi } from "../apis/logApi";

export const useLogs = () => {
  return useQuery({
    queryFn: () => getLogsApi(),
    queryKey: ["logs"],
  });
};