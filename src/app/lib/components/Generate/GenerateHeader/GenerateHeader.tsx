import Image from "next/image";
import { PromptToggle } from "@/app/lib/components/Generate/Prompt/PromptToggle";
import { CohensKappa } from "@/app/lib/components/Generate/GenerateHeader/CohensKappa";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { VersionDropdown } from "@/app/lib/components/Dropdowns/VersionDropdown";
import { MetricResponse } from "@/app/lib/api/metrics/get";
import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";
import { checkIsInitialMetric } from "@/app/lib/metrics/checkIsInitialMetric";
import { useDeployMetric } from "@/app/lib/queries/useDeployMetric";
import { getDeployDisabledTooltip } from "@/app/lib/components/Prompt/PopulatedPrompt/PopulatedPromptHeader";
import { codeModalContext } from "@/app/lib/components/CodeModal/CodeModalContext";
import { useContext } from "react";
import classNames from "classnames";

function GenerateHeader({
  onBack,
  title,
  showPrompt,
  onPromptToggle,
  kappa,
  runningAllEvaluations,
  runAllEvaluations,
  noCompleteTestCases,
  selectedPrompt,
  selectedMetric,
  setSelectedPrompt,
  templateChanged,
}: {
  onBack: () => void;
  onPromptToggle: (value: boolean) => void;
  showPrompt: boolean;
  title?: string;
  kappa: number | null;
  runningAllEvaluations: boolean;
  runAllEvaluations: () => void;
  noCompleteTestCases: boolean;
  selectedPrompt: MetricResponse["prompts"][number] | null;
  selectedMetric: MetricResponse | null;
  setSelectedPrompt: (value: {
    selectedPromptId: string | null;
    selectedMetricId: string | null;
  }) => void;
  templateChanged: boolean;
}) {
  const runAllEvaluationsDisabled =
    runningAllEvaluations || noCompleteTestCases || templateChanged;

  const { openCodeModal } = useContext(codeModalContext);

  const { mutate: deployMetric, isPending: isDeployingMetric } =
    useDeployMetric({
      onSucess: () =>
        openCodeModal({
          inputVariables: selectedPrompt!.input_variables,
          metricName: selectedMetric!.name,
        }),
    });

  const deployPromptDisabled =
    isDeployingMetric ||
    templateChanged ||
    selectedPrompt?.is_deployed === true ||
    selectedPrompt?.is_deployed === undefined;

  const isInitialMetric = checkIsInitialMetric(selectedMetric?.name);

  const getRunEvalsDisabledText = () => {
    if (noCompleteTestCases) {
      return "Add a test case to start running evaluations";
    }

    if (templateChanged) {
      return "Please save your evaluation metric before continuing";
    }
  };

  return (
    <div className="flex items-center mb-6 justify-between h-6 px-6">
      <div className="flex items-center">
        <button onClick={onBack} className="mr-4">
          <Image
            src="/icon-arrow-left-black.svg"
            alt="Back to all metrics"
            width="24"
            height="24"
          />
        </button>
        <h1 className="inter-600 text-lg text-text-secondary mr-2">{title}</h1>
        {!isInitialMetric && (
          <VersionDropdown
            selectedPrompt={selectedPrompt}
            onChange={(value) =>
              setSelectedPrompt({
                selectedPromptId: value?.value!,
                selectedMetricId: selectedMetric?.id!,
              })
            }
            prompts={selectedMetric?.prompts || null}
            className="mr-3"
          />
        )}
        <CohensKappa kappa={kappa} />
      </div>
      <div className="flex items-center">
        <div className={classNames("flex items-center bg-white")}>
          <PromptToggle
            checked={showPrompt}
            onChange={(event) => onPromptToggle(event.target.checked)}
          />
          <p className="ml-2 inter-600 text-sm text-text-secondary">
            Show eval prompt
          </p>
        </div>
        <SecondaryButton
          onClick={runAllEvaluations}
          disabled={runAllEvaluationsDisabled}
          disabledTooltip={getRunEvalsDisabledText()}
          className={classNames("mx-3")}
        >
          <Image
            src={
              runAllEvaluationsDisabled
                ? "/refresh-icon-disabled.svg"
                : "/refresh-icon-black.svg"
            }
            alt="Run all evaluations"
            width="16"
            height="16"
            className="mr-2"
          />
          Run evaluations
        </SecondaryButton>
        <PrimaryButton
          onClick={() =>
            deployMetric({
              metricId: selectedMetric!.id,
              promptId: selectedPrompt!.id,
            })
          }
          disabled={deployPromptDisabled}
          fullWidth={false}
          disabledTooltipPosition="top-start"
          disabledTooltip={getDeployDisabledTooltip({
            deployDisabled: deployPromptDisabled,
            initialMetric: isInitialMetric,
            templateChanged,
          })}
        >
          <Image
            src={
              deployPromptDisabled
                ? "/atla-icon-disabled.svg"
                : "/atla-icon-white.svg"
            }
            alt="Deploy eval prompt"
            width="16"
            height="16"
            className="mr-2"
          />
          Deploy
        </PrimaryButton>
      </div>
    </div>
  );
}

export { GenerateHeader };
