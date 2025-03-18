import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import { useGeneratePrompt } from "@/app/lib/open-ai/useGeneratePrompt";
import { useState } from "react";
import { GeneratedPromptHeader } from "@/app/lib/components/CreateMetric/GeneratedPrompt/GeneratedPromptHeader";
import { GeneratedPromptFooter } from "@/app/lib/components/CreateMetric/GeneratedPrompt/GeneratedPromptFooter";
import { Prompt } from "@/app/lib/components/Prompt/PopulatedPrompt/Prompt";

const GeneratedPrompt = ({
  onClose,
  onBack,
  scoringRuberic,
  inputVariables,
  criteria,
  prompt,
  onPromptChange,
  metricName,
  onMetricNameChange,
  saveMetric,
  metricNameAlreadyExists,
  isSavingMetric,
}: {
  onClose: () => void;
  onBack: () => void;
  scoringRuberic: string | null;
  inputVariables: InputVariablesMultiSelectOption[];
  criteria: string | null;
  prompt: string | null;
  onPromptChange: (prompt: string | null) => void;
  metricName: string | null;
  onMetricNameChange: (metricName: string | null) => void;
  saveMetric: () => void;
  metricNameAlreadyExists: boolean;
  isSavingMetric: boolean;
}) => {
  if (!scoringRuberic) {
    throw new Error("Scoring ruberic is required");
  }

  if (!criteria) {
    throw new Error("Criteria is required");
  }

  const [skipPromptGeneration] = useState(!!prompt);

  const { isLoading: promptIsGenerating } = useGeneratePrompt({
    inputVariables: inputVariables.map((value) => value.value),
    criteria,
    scoringRuberic,
    onChange: onPromptChange,
    skip: !!skipPromptGeneration,
  });

  const noMetricNameSet = metricName === null;
  const metricNameOnlyContainsSpaces = metricName?.trim() === "";
  const metricNameContainsSpecialCharacters = RegExp(/[^a-zA-Z\s_]/).test(
    metricName || "",
  );

  const savePromptDisabled =
    prompt === null ||
    noMetricNameSet ||
    metricNameContainsSpecialCharacters ||
    metricNameAlreadyExists ||
    metricNameOnlyContainsSpaces ||
    promptIsGenerating;

  const getDisabledText = (): {
    errorMessage: string | null;
    tooltipText: string;
  } => {
    if (promptIsGenerating) {
      return {
        tooltipText: "Save is available once the prompt has been generated",
        errorMessage: null,
      };
    }

    if (noMetricNameSet) {
      return {
        tooltipText:
          "Please enter a valid name for your evaluation criteria to continue",
        errorMessage: null,
      };
    }

    if (metricNameContainsSpecialCharacters) {
      const text =
        "Criteria name can only contain letters, spaces, and underscores";
      return { tooltipText: text, errorMessage: text };
    }

    if (metricNameAlreadyExists) {
      const text =
        "Criteria name already exists. Please choose a different name";
      return { tooltipText: text, errorMessage: text };
    }

    if (metricNameOnlyContainsSpaces) {
      const text = "Criteria name cannot be empty";
      return { tooltipText: text, errorMessage: text };
    }

    return {
      tooltipText: "",
      errorMessage: null,
    };
  };

  const disabledText = getDisabledText();

  return (
    <div className="flex flex-col h-full p-6">
      <GeneratedPromptHeader onClose={onClose} onBack={onBack} />
      <div className="flex-grow flex flex-col mb-6 min-h-0">
        <p className="inter-500 text-xs text-text-secondary mb-2">
          Criteria name
        </p>
        <input
          className="border border-border-primary w-full rounded inter-400 text-text-secondary text-xs py-1.5 px-2"
          type="text"
          placeholder="Enter criteria name"
          value={metricName || ""}
          onChange={(event) => onMetricNameChange(event.target.value || null)}
        />
        <p className="text-red inter-500 text-xs mt-2 h-3">
          {disabledText.errorMessage && !isSavingMetric
            ? disabledText.errorMessage
            : ""}
        </p>
        <Prompt
          template={prompt || ""}
          onChange={(value) => onPromptChange(value)}
          disabled={promptIsGenerating}
          templateChanged={promptIsGenerating}
          allowEdit
        />
      </div>
      <GeneratedPromptFooter
        onAlignMetrics={saveMetric}
        disabled={savePromptDisabled}
        disabledTooltipText={disabledText.tooltipText}
      />
    </div>
  );
};

export { GeneratedPrompt };
