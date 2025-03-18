import { getTestCaseById, getTestCaseCollections } from "../../db";

export type GetTestCaseCollectionsResponse = {
  id: string;
  name: string;
  description: string;
  testCases: {
    id: string;
    input: string | null;
    response: string | null;
    context?: string | null;
    reference?: string | null;
    expected_score: number | null;
    atla_score: number | null;
    critique: string | null;
  }[];
}[];

async function get(): Promise<GetTestCaseCollectionsResponse> {
  const testCaseCollections = getTestCaseCollections();

  return testCaseCollections.map((testCaseCollection) => ({
    id: testCaseCollection.id,
    name: testCaseCollection.name,
    description: testCaseCollection.description,
    testCases: testCaseCollection.testCases.map(({ id }) => {
      const testCase = getTestCaseById(id);

      if (!testCase) {
        throw new Error(`Test case with id ${id} not found`);
      }

      return {
        id: testCase.id,
        input: testCase.input,
        response: testCase.response,
        ...(testCase.context ? { context: testCase.context } : {}),
        ...(testCase.reference ? { reference: testCase.reference } : {}),
        expected_score: testCase.expectedScore,
        atla_score: testCase.atlaScore,
        critique: testCase.critique,
      };
    }),
  }));
}

export { get };
