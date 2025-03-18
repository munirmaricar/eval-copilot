import { SecondaryButtonToggleLarge } from "@/app/lib/components/Buttons/SecondaryButtonToggleLarge";
import {
  InputVariablesMultiSelect,
  InputVariablesMultiSelectOption,
} from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import { ScoringDropdown } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/ScoringDropdown";
import Image from "next/image";

const MetricDetails = ({
  scoringRuberic,
  inputVariables,
  criteria,
  onScoringRubericChange,
  onInputVariablesChange,
  onCriteriaChange,
}: {
  scoringRuberic: string | null;
  inputVariables: InputVariablesMultiSelectOption[];
  criteria: string | null;
  onScoringRubericChange: (scoringRuberic: string) => void;
  onInputVariablesChange: (
    inputVariables: InputVariablesMultiSelectOption[],
  ) => void;
  onCriteriaChange: (criteria: string | null) => void;
}) => {
  const onInputVarsInfoClick = () => {
    window.open(
      "https://docs.atla-ai.com/use-cases/rag",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="mt-4 px-6">
      <textarea
        className="w-full inter-400 text-xs text-text-secondary py-1.5 px-2 border border-border-primary rounded h-20 resize-none"
        placeholder="e.g. Assess the presence of incorrect content in AI’s response"
        value={criteria || ""}
        onChange={(e) => onCriteriaChange(e.target.value || null)}
      />
      <div className="bg-gray rounded-2xl pl-5 pr-8 py-6 mt-4 flex">
        <div className="flex flex-col items-start justify-around">
          <p className="inter-600 text-sm text-text-secondary mb-6 relative left-4">
            Scoring:
          </p>
          <p className="inter-600 text-sm text-text-secondary mr-8 text-nowrap flex items-center">
            <button onClick={onInputVarsInfoClick}>
              <Image
                src={"/info-icon-text-secondary.svg"}
                alt="Open input variables docs"
                width="13"
                height="13"
                className="mr-1"
              />
            </button>
            Input variables:
          </p>
        </div>
        <div className="flex flex-col items-stretch justify-around flex-grow">
          <ScoringDropdown
            value={scoringRuberic}
            onChange={onScoringRubericChange}
          />
          <div className="mb-6" />
          <InputVariablesMultiSelect
            value={inputVariables}
            onChange={onInputVariablesChange}
          />
        </div>
      </div>
    </div>
  );
};

export { MetricDetails };
