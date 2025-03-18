import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export const GET_METRICS_QUERY_KEY = "GET_METRICS_QUERY_KEY";

function useGetMetrics() {
  return useQuery({
    queryKey: [GET_METRICS_QUERY_KEY],
    queryFn: () => api.metrics.get(),
  });
}

export { useGetMetrics };
