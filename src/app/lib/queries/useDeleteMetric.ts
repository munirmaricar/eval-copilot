import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { GET_METRICS_QUERY_KEY } from "@/app/lib/queries/useGetMetrics";
import { DeleteMetricRequest } from "@/app/lib/api/metrics/delete";

function useDeleteMetric({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DeleteMetricRequest) =>
      api.metrics.delete(request),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
      queryClient.invalidateQueries({
        queryKey: [GET_METRICS_QUERY_KEY],
      });
    },
  });
}

export { useDeleteMetric };
