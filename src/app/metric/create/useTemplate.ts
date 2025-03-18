import { useState } from "react";
import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import { MetricExample } from "@/app/metric/create/useMetricData";

const setExampleKeys = ({
  examples,
  keys,
}: {
  examples: MetricExample[];
  keys: string[];
}): MetricExample[] => {
  return examples.map((example) => {
    const keyValues = keys.reduce((acc, key) => {
      // @ts-ignore
      return { ...acc, [key]: example[key] || null };
    }, {});

    return {
      ...keyValues,
      score: 1,
      critique: example.critique,
    } as MetricExample;
  });
};

function useTemplate({
  setScoringRuberic,
  setInputVariables,
  setCriteria,
  examples,
  setExamples,
}: {
  setScoringRuberic: (scoringRuberic: string | null) => void;
  setCriteria: (criteria: string | null) => void;
  setInputVariables: (
    inputVariables: InputVariablesMultiSelectOption[],
  ) => void;
  examples: MetricExample[];
  setExamples: (examples: MetricExample[]) => void;
}) {
  const [template, setTemplate] = useState<string | null>(null);

  const handleSetTemplate = (newTemplate: string) => {
    const options: Record<
      string,
      {
        scoringRuberic: string;
        inputVariables: InputVariablesMultiSelectOption[];
        criteria: string;
      }
    > = {
      recall: {
        scoringRuberic: "one-to-five",
        inputVariables: [
          { value: "input", label: "Input", isFixed: true },
          { value: "response", label: "Response", isFixed: true },
          {
            value: "reference",
            label: "Ground truth response",
            isFixed: false,
          },
        ],
        criteria:
          "Measure how completely the response captures the key facts and details of the reference response.",
      },
      precision: {
        scoringRuberic: "one-to-five",
        inputVariables: [
          { value: "input", label: "Input", isFixed: true },
          { value: "response", label: "Response", isFixed: true },
          {
            value: "reference",
            label: "Ground truth response",
            isFixed: false,
          },
        ],
        criteria:
          "Assess the relevance of all the information in the response against the reference response.",
      },
      ["logical-coherence"]: {
        scoringRuberic: "one-to-five",
        inputVariables: [
          { value: "input", label: "Input", isFixed: true },
          { value: "response", label: "Response", isFixed: true },
        ],
        criteria:
          "Measure the logical flow, consistency, and rationality of the response.",
      },
      ["context-relevance"]: {
        scoringRuberic: "one-to-five",
        inputVariables: [
          { value: "input", label: "Input", isFixed: true },
          { value: "response", label: "Response", isFixed: true },
          { value: "context", label: "Context", isFixed: false },
        ],
        criteria: "Measure how on-point the retrieved context is.",
      },
      faithfulness: {
        scoringRuberic: "one-to-five",
        inputVariables: [
          { value: "input", label: "Input", isFixed: true },
          { value: "response", label: "Response", isFixed: true },
          { value: "context", label: "Context", isFixed: false },
        ],
        criteria:
          "Determine if the response is factually based on the provided context.",
      },
      hallucination: {
        scoringRuberic: "one-to-five",
        inputVariables: [
          { value: "input", label: "Input", isFixed: true },
          { value: "response", label: "Response", isFixed: true },
          {
            value: "reference",
            label: "Ground truth response",
            isFixed: false,
          },
        ],
        criteria:
          "Assess the presence of incorrect or unrelated content in the AI’s response against the reference response.",
      },
    };

    if (newTemplate === template) {
      setTemplate(null);
      setScoringRuberic("one-to-five");
      setInputVariables([
        { value: "input", label: "Input", isFixed: true },
        { value: "response", label: "Response", isFixed: true },
      ]);
      setCriteria(null);
      setExamples(setExampleKeys({ examples, keys: ["input", "response"] }));

      return;
    }

    setTemplate(newTemplate);
    setScoringRuberic(options[newTemplate].scoringRuberic);
    setInputVariables(options[newTemplate].inputVariables);
    setCriteria(options[newTemplate].criteria);

    const inputVariablesKeys = options[newTemplate].inputVariables.map(
      (variable) => variable.value,
    );

    setExamples(setExampleKeys({ examples, keys: inputVariablesKeys }));
  };

  return { template, setTemplate: handleSetTemplate };
}

export { useTemplate };
