import { useQuery } from "@tanstack/react-query";
import { getLogsApi } from "../apis/logApi";

export const useLogs = ({ page, pageSize }: { page: number; pageSize: number }) => {
  return useQuery({
    queryFn: () => getLogsApi({ page, pageSize }),
    queryKey: ["logs", page, pageSize],
  });
};