import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { UpdateTestCaseCollectionRequest } from "@/app/lib/api/testCaseCollections/update";
import { GET_TEST_CASE_COLLECTIONS_QUERY_KEY } from "@/app/lib/queries/useGetTestCaseCollections";

function useUpdateTestCaseCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateTestCaseCollectionRequest) =>
      api.testCaseCollections.update(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_TEST_CASE_COLLECTIONS_QUERY_KEY],
      });
    },
  });
}

export { useUpdateTestCaseCollection };
