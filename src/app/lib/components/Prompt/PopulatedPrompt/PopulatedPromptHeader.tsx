import { MetricResponse } from "@/app/lib/api/metrics/get";
import { SingleValue } from "react-select";
import { VersionDropdown } from "@/app/lib/components/Dropdowns/VersionDropdown";
import classNames from "classnames";
import { TertiaryButton } from "@/app/lib/components/Buttons/TertiaryButton";
import Image from "next/image";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";

export const getDeployDisabledTooltip = ({
  deployDisabled,
  initialMetric,
  templateChanged,
}: {
  deployDisabled: boolean;
  initialMetric: boolean;
  templateChanged: boolean;
}) => {
  if (!deployDisabled) {
    return null;
  }

  if (initialMetric) {
    return "You cannot change the prompt of a base metric";
  }

  if (templateChanged) {
    return "Please save your evaluation metric before continuing";
  }

  return "This version has already been deployed";
};
export function PopulatedPromptHeader(props: {
  name: string;
  initialMetric: boolean;
  selectedPrompt: MetricResponse["prompts"][number];
  onVersionChange: (value: SingleValue<any>) => void;
  prompts: MetricResponse["prompts"];
  deployed: boolean;
  onGetCode: () => void;
  onEvaluate: () => void;
  onDeploy: () => void;
  deployDisabled: boolean;
  templateChanged: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <h2 className="inter-600 text-text-secondary text-lg mr-3">
          {props.name}
        </h2>
        {!props.initialMetric && (
          <VersionDropdown
            selectedPrompt={props.selectedPrompt}
            onChange={props.onVersionChange}
            prompts={props.prompts}
            className="mr-3 z-[9999]"
          />
        )}
        <div
          className={classNames(
            "w-1.5 h-1.5 rounded-full bg-accent-green mr-1 mt-1",
            {
              "bg-background-disabled": !props.deployed,
            },
          )}
        />
        <p
          className={classNames("inter-500 text-xs mt-1", {
            "text-text-secondary": props.deployed,
            "text-text-disabled": !props.deployed,
          })}
        >
          {props.deployed ? "Deployed" : "Not deployed"}
        </p>
      </div>
      <div className="flex">
        {props.deployed && (
          <TertiaryButton onClick={props.onGetCode}>
            <Image
              src="/code-icon-black.svg"
              alt="Get code"
              width="16"
              height="16"
              className="mr-2"
            />
            Get code
          </TertiaryButton>
        )}
        <SecondaryButton
          disabled={props.templateChanged}
          onClick={props.onEvaluate}
          className="mr-3"
          disabledTooltip="Please save your evaluation metric before continuing"
        >
          <Image
            src={
              props.templateChanged
                ? "/crosshair-icon-disabled.svg"
                : "/crosshair-icon-black.svg"
            }
            alt="Align your eval metric"
            width="16"
            height="16"
            className="mr-2"
          />
          Align your eval metric
        </SecondaryButton>
        <PrimaryButton
          onClick={props.onDeploy}
          disabled={props.deployDisabled}
          fullWidth={false}
          disabledTooltip={getDeployDisabledTooltip({
            deployDisabled: props.deployDisabled,
            initialMetric: props.initialMetric,
            templateChanged: props.templateChanged,
          })}
          disabledTooltipPosition="top-start"
        >
          <Image
            src={
              props.deployDisabled
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
