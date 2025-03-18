import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { GET_METRICS_QUERY_KEY } from "@/app/lib/queries/useGetMetrics";
import { DeleteTestCaseRequest } from "@/app/lib/api/testCases/deleteTestCase";
import { GET_TEST_CASES_FOR_METRIC_QUERY_KEY } from "@/app/lib/queries/useGetTestCasesForMetric";

function useDeleteTestCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DeleteTestCaseRequest) =>
      api.testCases.delete(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [GET_METRICS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [GET_TEST_CASES_FOR_METRIC_QUERY_KEY, data.parentMetricId],
      });
    },
  });
}

export { useDeleteTestCase };
