import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { CreateTestCaseCollectionRequest } from "@/app/lib/api/testCaseCollections/create";
import { GET_TEST_CASE_COLLECTIONS_QUERY_KEY } from "@/app/lib/queries/useGetTestCaseCollections";

function useCreateTestCaseCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateTestCaseCollectionRequest) =>
      api.testCaseCollections.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_TEST_CASE_COLLECTIONS_QUERY_KEY],
      });
    },
  });
}

export { useCreateTestCaseCollection };
