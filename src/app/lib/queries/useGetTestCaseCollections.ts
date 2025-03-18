import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export const GET_TEST_CASE_COLLECTIONS_QUERY_KEY =
  "GET_TEST_CASE_COLLECTIONS_QUERY_KEY";

function useGetTestCaseCollections() {
  return useQuery({
    queryKey: [GET_TEST_CASE_COLLECTIONS_QUERY_KEY],
    queryFn: () => api.testCaseCollections.get(),
  });
}

export { useGetTestCaseCollections };
