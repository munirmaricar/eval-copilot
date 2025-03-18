import { FewShot, Prompt, ScoringCriteria } from "../../types";
import { createFewShot, createMetric, createPrompt } from "../../db";

export interface CreatePromptRequest {
  name: string;
  model: string;
  scoring_criteria: ScoringCriteria;
  is_draft?: boolean;
  prompts: {
    version: number;
    is_deployed?: boolean;
    name: string;
    template: string;
    input_variables: string[];
    criteria: string;
  }[];
  few_shots?: {
    input: string;
    response: string;
    score: number;
    context?: string | null;
    reference?: string | null;
    critique: string | null;
  }[];
  test_cases?: {
    id: string;
  }[];
}

interface CreatePromptResponse {
  id: string;
  name: string;
  model: string;
  scoring_criteria: ScoringCriteria;
  is_draft: boolean;
  prompts: {
    version: number;
    is_deployed: boolean;
    id: string;
    name: string;
    template: string;
    input_variables: string[];
    criteria: string;
  }[];
  few_shots: {
    id: string;
    in_use: boolean;
  }[];
}

async function create(
  request: CreatePromptRequest,
): Promise<CreatePromptResponse> {
  const prompts: Prompt[] = request.prompts.map((prompt, index) => {
    return {
      id: crypto.randomUUID(),
      version: prompt.version,
      isDeployed: prompt.is_deployed || false,
      updatedAt: new Date().toISOString(),
      name: prompt.name,
      template: prompt.template,
      inputVariables: prompt.input_variables,
      criteria: prompt.criteria,
    };
  });

  prompts.forEach(createPrompt);

  const fewShots: FewShot[] | undefined = request.few_shots?.map(
    (fewShot, index) => {
      return {
        id: crypto.randomUUID(),
        input: fewShot.input,
        response: fewShot.response,
        score: fewShot.score,
        critique: fewShot.critique,
        ...(fewShot.context ? { context: fewShot.context } : {}),
        ...(fewShot.reference ? { reference: fewShot.reference } : {}),
        inUse: true,
      };
    },
  );

  if (fewShots) {
    fewShots.forEach(createFewShot);
  }

  const metric = {
    id: crypto.randomUUID(),
    name: request.name,
    model: request.model,
    isDraft: request.is_draft || false,
    updatedAt: new Date().toISOString(),
    scoringCriteria: request.scoring_criteria,
    prompts: prompts.map((prompt) => ({
      version: prompt.version,
      isDeployed: prompt.isDeployed,
      id: prompt.id,
    })),
    fewShots:
      fewShots?.map((fewShot) => ({
        id: fewShot.id,
        inUse: fewShot.inUse,
      })) || [],
    testCases: request.test_cases || [],
  };

  createMetric(metric);

  return {
    id: metric.id,
    name: metric.name,
    model: metric.model,
    is_draft: metric.isDraft,
    scoring_criteria: metric.scoringCriteria,
    prompts: prompts.map((prompt) => ({
      version: prompt.version,
      is_deployed: prompt.isDeployed,
      id: prompt.id,
      name: prompt.name,
      template: prompt.template,
      input_variables: prompt.inputVariables,
      criteria: prompt.criteria,
    })),
    few_shots:
      fewShots?.map((fewShot) => ({
        id: fewShot.id,
        in_use: fewShot.inUse,
      })) || [],
  };
}

export { create };
