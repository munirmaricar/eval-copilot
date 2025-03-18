import { getMetricById, getTestCaseById } from "../../db";

export interface GetTestCasesForMetricRequest {
  metricId: string;
}

export type GetTestCasesForMetricResponse = {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  expected_score: number | null;
  atla_score: number | null;
  critique: string | null;
}[];

async function getTestCasesForMetric(
  request: GetTestCasesForMetricRequest,
): Promise<GetTestCasesForMetricResponse> {
  const metric = getMetricById(request.metricId);

  if (!metric) {
    throw new Error("Metric not found");
  }

  return metric.testCases
    .map(({ id }) => {
      const testCase = getTestCaseById(id);

      if (testCase === null) {
        throw new Error("Test case not found");
      }

      return testCase;
    })
    .map((testCase) => {
      const { expectedScore, atlaScore, ...rest } = testCase;
      return {
        ...rest,
        expected_score: expectedScore,
        atla_score: atlaScore,
      };
    });
}

export { getTestCasesForMetric };
