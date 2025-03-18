import {
  deleteFewShot,
  deletePrompt,
  deleteTestCase,
  getMetricById,
  deleteMetric as dbDeleteMetric,
} from "../../db";

export interface DeleteMetricRequest {
  id: string;
}

async function deleteMetric(request: DeleteMetricRequest) {
  const metric = getMetricById(request.id);

  if (!metric) {
    throw new Error("Metric not found");
  }

  metric.prompts.forEach((prompt) => deletePrompt({ id: prompt.id }));
  metric.fewShots.forEach((fewShot) => deleteFewShot({ id: fewShot.id }));
  metric.testCases.forEach((testCase) => deleteTestCase(testCase.id));
  dbDeleteMetric({ id: metric.id });
}

export { deleteMetric };
