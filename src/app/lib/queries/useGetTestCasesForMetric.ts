import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import {
  GetTestCasesForMetricRequest,
  GetTestCasesForMetricResponse,
} from "@/app/lib/api/testCases/getTestCasesForMetric";

export const GET_TEST_CASES_FOR_METRIC_QUERY_KEY =
  "GET_TEST_CASES_FOR_METRIC_QUERY_KEY";

function useGetTestCasesForMetric(request: { metricId?: string }) {
  return useQuery({
    queryKey: [GET_TEST_CASES_FOR_METRIC_QUERY_KEY, request.metricId],
    enabled: !!request.metricId,
    queryFn: async () =>
      api.testCases.getTestCasesForMetric({ metricId: request.metricId! }),
  });
}

export { useGetTestCasesForMetric };
