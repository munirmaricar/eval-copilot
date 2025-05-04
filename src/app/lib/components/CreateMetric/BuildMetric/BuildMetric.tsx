import Image from "next/image";
import { MetricTemplateGroup } from "@/app/lib/components/CreateMetric/BuildMetric/MetricTemplateGroup";
import { useEffect, useState } from "react";
import { MetricDetails } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/MetricDetails";
import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";

const BuildMetric = ({
  onClose,
  onGeneratePrompt,
  scoringRuberic,
  inputVariables,
  criteria,
  selectedTemplate,
  onSelectedTemplateChange,
  onScoringRubericChange,
  onInputVariablesChange,
  onCriteriaChange,
}: {
  onClose: () => void;
  onGeneratePrompt: () => void;
  scoringRuberic: string | null;
  inputVariables: InputVariablesMultiSelectOption[];
  criteria: string | null;
  selectedTemplate: string | null;
  onSelectedTemplateChange: (selectedTemplate: string) => void;
  onScoringRubericChange: (scoringRuberic: string) => void;
  onInputVariablesChange: (
    inputVariables: InputVariablesMultiSelectOption[],
  ) => void;
  onCriteriaChange: (criteria: string | null) => void;
}) => {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex flex-col items-center">
        <button onClick={onClose}>
          <Image
            src="/close-icon-grey.svg"
            alt="Close metric builder"
            width="24"
            height="24"
            className="absolute top-4 right-6"
          />
        </button>
        <Image
          src="/metric-icon-black.svg"
          alt="Build Metric Icon"
          width="60"
          height="60"
        />
        <h1 className="mt-6 inter-600 text-2xl text-text-secondary">
          Describe your eval task
        </h1>
        <p className="mt-1 inter-500 text-xs text-text-secondary opacity-70 mb-5 text-center">
          Turn an eval task description into a high quality evaluation
          <br /> prompt. Try one of our templates or define your own.{" "}
        </p>
      </div>
      <div className="flex-grow min-h-0 overflow-auto">
        <div className="flex flex-col items-center">
          <MetricTemplateGroup
            width="w-24"
            templates={[
              {
                name: "Hallucination",
                description:
                  "Assesses the presence of incorrect or unrelated content in the AI’s response.",
                onClick: () => onSelectedTemplateChange("hallucination"),
                selected: selectedTemplate === "hallucination",
              },
              {
                name: "Recall",
                description:
                  "Measures how complete the response captures the key facts and details.",
                onClick: () => onSelectedTemplateChange("recall"),
                selected: selectedTemplate === "recall",
              },
              {
                name: "Precision",
                description:
                  "Assesses the relevance of all the information in the response.",
                onClick: () => onSelectedTemplateChange("precision"),
                selected: selectedTemplate === "precision",
              },
            ]}
          />
          <MetricTemplateGroup
            width="w-32"
            templates={[
              {
                name: "Logical Coherence",
                description:
                  "Measures the logical flow, consistency, and rationality of the response.",
                onClick: () => onSelectedTemplateChange("logical-coherence"),
                selected: selectedTemplate === "logical-coherence",
              },
              {
                name: "Context Relevance",
                description: "Measures how on-point the retrieved context is.",
                onClick: () => onSelectedTemplateChange("context-relevance"),
                selected: selectedTemplate === "context-relevance",
              },
            ]}
          />
          <MetricTemplateGroup
            width="w-24"
            templates={[
              {
                name: "Faithfulness",
                description:
                  "Determines if the response is factually based on the provided context.",
                onClick: () => onSelectedTemplateChange("faithfulness"),
                selected: selectedTemplate === "faithfulness",
              },
            ]}
          />
        </div>
        <MetricDetails
          scoringRuberic={scoringRuberic}
          inputVariables={inputVariables}
          criteria={criteria}
          onScoringRubericChange={onScoringRubericChange}
          onInputVariablesChange={onInputVariablesChange}
          onCriteriaChange={onCriteriaChange}
        />
      </div>
      <div>
        <PrimaryButton
          onClick={onGeneratePrompt}
          disabled={scoringRuberic === null || criteria === null}
        >
          Generate eval prompt
        </PrimaryButton>
      </div>
    </div>
  );
};

export { BuildMetric };
