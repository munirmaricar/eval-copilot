import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { CreateTestCaseRequest } from "@/app/lib/api/testCases/create";
import { GET_TEST_CASES_FOR_METRIC_QUERY_KEY } from "@/app/lib/queries/useGetTestCasesForMetric";

function useCreateTestCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateTestCaseRequest) =>
      api.testCases.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_TEST_CASES_FOR_METRIC_QUERY_KEY],
      });
    },
  });
}

export { useCreateTestCase };
