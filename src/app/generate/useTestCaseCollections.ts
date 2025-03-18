import { useCreateTestCaseCollection } from "@/app/lib/queries/useCreateTestCaseCollection";
import { useGetTestCaseCollections } from "@/app/lib/queries/useGetTestCaseCollections";
import { useUpdateTestCaseCollection } from "@/app/lib/queries/useUpdateTestCaseCollection";

function useTestCaseCollections() {
  const { mutate: createTestCaseCollection } = useCreateTestCaseCollection();
  const { data: testCaseCollections } = useGetTestCaseCollections();
  const { mutate: updateTestCaseCollection } = useUpdateTestCaseCollection();

  return {
    createTestCaseCollection,
    updateTestCaseCollection,
    testCaseCollections: testCaseCollections ?? [],
  };
}

export { useTestCaseCollections };
