import {
  createMetric,
  createPrompt,
  getMetricById,
  getPromptsForMetric,
} from "../../db";
import { Metric, Prompt } from "../../types";

export interface DeployMetricRequest {
  metricId: string;
  promptId: string;
}

export interface DeployMetricResponse {
  metric: Metric;
}

function deploy(request: DeployMetricRequest): DeployMetricResponse {
  const metric = getMetricById(request.metricId);
  const prompts = getPromptsForMetric(request.metricId);

  if (!metric) {
    throw new Error("Metric not found");
  }

  const newMetricPrompts: Metric["prompts"] = metric.prompts.map((prompt) => {
    if (prompt.id === request.promptId) {
      return {
        ...prompt,
        isDeployed: true,
      };
    }
    return {
      ...prompt,
      isDeployed: false,
    };
  });

  const newMetric = { ...metric, prompts: newMetricPrompts };

  createMetric(newMetric);

  const newPrompts: Prompt[] = prompts.map((prompt) => {
    if (prompt.id === request.promptId) {
      return {
        ...prompt,
        isDeployed: true,
      };
    }

    return {
      ...prompt,
      isDeployed: false,
    };
  });

  newPrompts.forEach((prompt) => {
    createPrompt(prompt);
  });

  return {
    metric: newMetric,
  };
}

export { deploy };
