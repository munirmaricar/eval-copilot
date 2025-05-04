import { useEffect, useState } from "react";
import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import { useGetMetrics } from "@/app/lib/queries/useGetMetrics";
import { useSearchParams } from "next/navigation";
import { ScoringCriteria } from "../../lib/types";
import { capitalizeFirstLetter } from "@/app/lib/utils/captiliseFirstLetter";
import {
  ExistingExample,
  generateExample,
} from "@/app/lib/open-ai/generateExample";
import { rubericIdToText } from "@/app/lib/utils/rubericIdToText";
import { useTemplate } from "@/app/metric/create/useTemplate";
import { inputVariableIdToOptions } from "@/app/lib/utils/inputVariableIdToOptions";
import { getDefaultScoreFromRuberic } from "@/app/lib/utils/getDefaultScoreFromRuberic";
import { scoringCriteriaToRubericId } from "@/app/lib/utils/scoringCriteriaToRubericId";
import { MetricResponse } from "@/app/lib/api/metrics/get";

const getRuberic = (criteria: ScoringCriteria) => {
  if (criteria === ScoringCriteria.OneToFive) {
    return "one-to-five";
  }
  if (criteria === ScoringCriteria.Binary) {
    return "binary";
  }
  if (criteria === ScoringCriteria.FloatZeroToOne) {
    return "float";
  }
  throw new Error(`Invalid scoring criteria: ${criteria}`);
};

export interface MetricExample {
  id?: string;
  input: string | null;
  response: string | null;
  score: number | null;
  critique: string | null;
  context?: string | null;
  reference?: string | null;
  in_use?: boolean;
}

function useMetricData() {
  const { data } = useGetMetrics();
  const searchParams = useSearchParams();
  const metricId = searchParams.get("metric");
  const promptId = searchParams.get("prompt");

  const [selectedMetric, setSelectedMetric] = useState<MetricResponse | null>(
    null,
  );
  const [selectedPrompt, setSelectedPrompt] = useState<
    MetricResponse["prompts"][number] | null
  >(null);
  const [scoringRuberic, setScoringRuberic] = useState<string | null>(
    "one-to-five",
  );
  const [inputVariables, setInputVariables] = useState<
    InputVariablesMultiSelectOption[]
  >([
    { value: "input", label: "Input", isFixed: true },
    { value: "response", label: "Response", isFixed: true },
  ]);
  const [criteria, setCriteria] = useState<string | null>(null);
  const [metricName, setMetricName] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [examples, setExamples] = useState<MetricExample[]>([
    { input: null, response: null, score: null, critique: null },
  ]);

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    if (metricId === null) {
      return;
    }

    const metric = data.find((metric) => metric.id === metricId);

    if (metric === undefined) {
      throw new Error("Metric not found");
    }

    const prompt = metric.prompts.find((prompt) => prompt.id === promptId);

    if (!prompt) {
      throw new Error("Prompt not found");
    }

    setSelectedMetric(metric);
    setSelectedPrompt(prompt);
  }, [data, metricId, promptId]);

  useEffect(() => {
    if (!selectedPrompt || !selectedMetric) {
      return;
    }

    const hasContext = selectedPrompt.input_variables.includes("context");
    const hasReference = selectedPrompt.input_variables.includes("reference");
    const defaultScoreFromRuberic = getDefaultScoreFromRuberic(
      scoringCriteriaToRubericId(selectedMetric.scoring_criteria),
    );

    let newExamples: MetricExample[] = selectedMetric.few_shots;

    const urlFewShot = searchParams.get("few-shot");

    if (urlFewShot) {
      const fewShot: {
        input: string | null;
        response: string | null;
        reference?: string | null;
        context?: string | null;
        expected_score: number | null;
      } = JSON.parse(urlFewShot);

      newExamples = [
        ...newExamples,
        {
          input: fewShot.input,
          response: fewShot.response,
          ...(hasContext ? { context: fewShot.context } : {}),
          ...(hasReference ? { reference: fewShot.reference } : {}),
          score:
            fewShot.expected_score !== null
              ? fewShot.expected_score
              : defaultScoreFromRuberic,
          critique: null,
        },
      ];
    }

    if (newExamples.length === 0) {
      newExamples = [
        {
          input: null,
          response: null,
          score: defaultScoreFromRuberic,
          ...(hasContext ? { context: null } : {}),
          ...(hasReference ? { reference: null } : {}),
          critique: null,
        },
      ];
    }

    setExamples(newExamples);
    setScoringRuberic(getRuberic(selectedMetric.scoring_criteria));
    setInputVariables(inputVariableIdToOptions(selectedPrompt.input_variables));
    setCriteria(selectedPrompt.criteria);
  }, [data, selectedMetric, selectedPrompt, searchParams]);

  const handleSetScoringRuberic = (scoringRuberic: string | null) => {
    if (scoringRuberic === null) {
      return;
    }

    setExamples(
      examples.map((example) => ({
        ...example,
        score: getDefaultScoreFromRuberic(scoringRuberic),
      })),
    );

    setScoringRuberic(scoringRuberic);
  };

  const createNewExample = () => {
    const defaultScore =
      scoringRuberic === "one-to-five"
        ? 1
        : scoringRuberic === "binary"
          ? 1
          : 0.0;
    setExamples([
      ...examples,
      {
        input: null,
        response: null,
        score: defaultScore,
        critique: null,
        ...inputVariables.reduce(
          (acc, variable) => ({ ...acc, [variable.value]: null }),
          {},
        ),
      },
    ]);
  };

  const generateNewExample = async () => {
    const latestExample = examples[examples.length - 1];

    if (criteria === null) {
      throw new Error("Criteria is required to generate an example");
    }

    if (scoringRuberic === null) {
      throw new Error("Scoring rubric is required to generate an example");
    }

    if (latestExample.input === null) {
      throw new Error("Input is required to generate an example");
    }

    if (latestExample.response === null) {
      throw new Error("Response is required to generate an example");
    }

    if (latestExample.score === null) {
      throw new Error("Score is required to generate an example");
    }

    if (selectedPrompt === null) {
      throw new Error("Prompt is required to generate an example");
    }

    const existingExample: ExistingExample = {
      input: latestExample.input,
      response: latestExample.response,
      score: latestExample.score,
      critique: latestExample.critique,
      ...(latestExample.context ? { context: latestExample.context } : {}),
      ...(latestExample.reference
        ? { reference: latestExample.reference }
        : {}),
    };

    const { example } = await generateExample({
      criteria,
      inputVariables: inputVariables.map((variable) => variable.value),
      scoringRuberic: scoringRuberic,
      existingExample: existingExample,
      template: selectedPrompt.template,
    });

    setExamples([...examples, example]);
  };

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const resetExample = (index: number) => {
    const newExamples = examples.map((example, index) => {
      if (index === index) {
        return {
          input: null,
          response: null,
          score: getDefaultScoreFromRuberic(
            scoringCriteriaToRubericId(selectedMetric!.scoring_criteria),
          ),
          critique: null,
          ...inputVariables.reduce(
            (acc, variable) => ({ ...acc, [variable.value]: null }),
            {},
          ),
        };
      }

      return example;
    });

    setExamples(newExamples);
  };

  const handleSetInputVariables = (
    newInputVariables: InputVariablesMultiSelectOption[],
  ) => {
    setInputVariables(newInputVariables);

    const inputVariablesKeys = newInputVariables.map(
      (variable) => variable.value,
    );

    setExamples(
      examples.map((example) => {
        const inputVariableValues = inputVariablesKeys.reduce((acc, key) => {
          // @ts-ignore
          return { ...acc, [key]: example[key] || null };
        }, {});

        return {
          ...inputVariableValues,
          score: example.score,
          critique: example.critique,
        } as MetricExample;
      }),
    );
  };

  const { template, setTemplate } = useTemplate({
    setScoringRuberic,
    setInputVariables,
    setCriteria,
    examples,
    setExamples,
  });

  const checkExistingMetricName = (metricName: string | null): boolean => {
    return (
      data?.some(
        (metric) =>
          metric.name === metricName?.replace(/\s/g, "_").toLowerCase(),
      ) || false
    );
  };

  return {
    scoringRuberic,
    inputVariables,
    criteria,
    metricName,
    prompt,
    examples,
    setScoringRuberic: handleSetScoringRuberic,
    setInputVariables: handleSetInputVariables,
    setCriteria,
    setMetricName,
    setPrompt,
    setExamples,
    createNewExample,
    generateNewExample,
    removeExample,
    template,
    setTemplate,
    metricNameAlreadyExists: checkExistingMetricName(metricName),
    resetExample,
  };
}

export { useMetricData };
