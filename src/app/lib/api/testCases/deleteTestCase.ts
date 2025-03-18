import {
  createMetric,
  deleteTestCase as dbDeleteTestCase,
  getMetrics,
} from "@/app/lib/db/index";
import { Metric } from "../../types";

export interface DeleteTestCaseRequest {
  id: string;
}

function deleteTestCase(request: DeleteTestCaseRequest) {
  dbDeleteTestCase(request.id);

  const metrics = getMetrics();

  const parentMetric = metrics.find((metric) =>
    metric.testCases.some((testCase) => testCase.id === request.id),
  ) as Metric;

  const updatedParentMetric = {
    ...parentMetric,
    testCases: parentMetric.testCases.filter(
      (testCase) => testCase.id !== request.id,
    ),
  };

  createMetric(updatedParentMetric);

  return { parentMetricId: parentMetric.id };
}

export { deleteTestCase };
