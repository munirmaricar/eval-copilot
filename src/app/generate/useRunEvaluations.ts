import { runEvaluation } from "@/app/lib/open-ai/runEvaluation";
import { ScoringCriteria } from "../lib/types";
import { MetricResponse } from "@/app/lib/api/metrics/get";
import { useState } from "react";
import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";

export type RunEvaluationInput = {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
}[];

function useRunEvaluations({
  scoringRuberic,
  template,
  examples,
  setTestCaseValues,
  completeTestCases,
}: {
  template?: string;
  scoringRuberic?: ScoringCriteria;
  examples?: MetricResponse["few_shots"];
  setTestCaseValues: (
    values: {
      id: string;
      key: string;
      value: string | number | null;
    }[],
  ) => void;
  completeTestCases: GetTestCasesForMetricResponse | null;
}) {
  const [runningEvaluations, setRunningEvaluations] = useState<string[]>([]);
  const [runningAllEvaluations, setRunningAllEvaluations] =
    useState<boolean>(false);

  const runEvaluations = async (testCases: RunEvaluationInput) => {
    if (!scoringRuberic) {
      throw new Error("Scoring ruberic is required to run evaluations");
    }

    if (!template) {
      throw new Error("Template is required to run evaluations");
    }

    if (!examples) {
      throw new Error("Examples are required to run evaluations");
    }

    setRunningEvaluations(testCases.map((testCase) => testCase.id));

    const result = await Promise.all(
      testCases.map((testCase) => {
        if (testCase.input === null) {
          throw new Error("Example input is required to run evaluations");
        }

        if (testCase.response === null) {
          throw new Error("Example response is required to run evaluations");
        }

        return runEvaluation({
          scoringCriteria: scoringRuberic,
          input: testCase.input,
          response: testCase.response,
          context: testCase.context,
          reference: testCase.reference,
          template,
          examples,
        });
      }),
    );

    const updates = result.flatMap((evaluation, index) => {
      return [
        {
          id: testCases[index].id,
          key: "atla_score",
          value: evaluation.evaluation.score,
        },
        {
          id: testCases[index].id,
          key: "critique",
          value: evaluation.evaluation.critique,
        },
      ];
    });

    setTestCaseValues(updates);
    setRunningEvaluations([]);
  };

  const runAllEvaluations = async () => {
    if (completeTestCases === null) {
      throw new Error("Test cases are not loaded yet");
    }

    setRunningAllEvaluations(true);

    const testCases: RunEvaluationInput = completeTestCases.map((testCase) => ({
      id: testCase.id,
      input: testCase.input,
      response: testCase.response,
      ...(testCase.context ? { context: testCase.context } : {}),
      ...(testCase.reference ? { reference: testCase.reference } : {}),
    }));

    await runEvaluations(testCases);
    setRunningAllEvaluations(false);
  };

  return {
    runEvaluations,
    runningEvaluations,
    runningAllEvaluations,
    runAllEvaluations,
  };
}

export { useRunEvaluations };
