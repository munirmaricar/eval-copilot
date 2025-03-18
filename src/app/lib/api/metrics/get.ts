import { Prompt, ScoringCriteria } from "../../types";
import { getFewShotById, getMetrics, getPromptById } from "../../db";
import { setInitialMetrics } from "@/app/lib/db/setInitialMetrics";

export interface MetricResponse {
  id: string;
  name: string;
  model: string;
  scoring_criteria: ScoringCriteria;
  is_draft: boolean;
  updated_at: string;
  prompts: {
    version: number;
    is_deployed: boolean;
    id: string;
    updated_at: string;
    name: string;
    template: string;
    input_variables: string[];
    criteria: string;
  }[];
  few_shots: {
    id: string;
    input: string;
    response: string;
    score: number;
    context?: string;
    reference?: string;
    critique: string;
    in_use: boolean;
  }[];
  test_cases: {
    id: string;
  }[];
}

type GetMetricsResponse = MetricResponse[];

async function get(): Promise<GetMetricsResponse> {
  // Create default metrics if they do not already exist
  setInitialMetrics();

  const metrics = getMetrics();

  return metrics.map((metric) => {
    const promptIds = metric.prompts.map((prompt) => prompt.id);
    const prompts = promptIds
      .map((id) => getPromptById(id))
      .map((prompt: Prompt | null) => {
        if (prompt === null) {
          throw new Error("Prompt not found");
        }
        return {
          version: prompt.version,
          is_deployed: prompt.isDeployed,
          id: prompt.id,
          updated_at: prompt.updatedAt,
          name: prompt.name,
          template: prompt.template,
          input_variables: prompt.inputVariables,
          criteria: prompt.criteria,
        };
      });

    return {
      id: metric.id,
      name: metric.name,
      model: metric.model,
      updated_at: metric.updatedAt,
      scoring_criteria: metric.scoringCriteria,
      is_draft: metric.isDraft,
      prompts: prompts,
      few_shots: metric.fewShots
        .map((fewShot) => getFewShotById(fewShot.id))
        .map((fewShot) => {
          return {
            id: fewShot.id,
            input: fewShot.input,
            response: fewShot.response,
            score: fewShot.score,
            critique: fewShot.critique,
            ...(fewShot.context ? { context: fewShot.context } : {}),
            ...(fewShot.reference ? { reference: fewShot.reference } : {}),
            in_use: fewShot.inUse,
          };
        }),
      test_cases: metric.testCases,
    };
  });
}

export { get };
