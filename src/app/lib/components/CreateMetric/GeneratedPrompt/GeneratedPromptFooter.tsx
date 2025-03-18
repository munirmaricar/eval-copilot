import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";
import Image from "next/image";

export function GeneratedPromptFooter(props: {
  onAlignMetrics: () => void;
  disabled: boolean;
  disabledTooltipText: string;
}) {
  return (
    <div className="flex mt-6">
      <PrimaryButton
        onClick={props.onAlignMetrics}
        disabled={props.disabled}
        fullWidth={false}
        disabledTooltip={props.disabledTooltipText}
      >
        <Image
          src={
            props.disabled
              ? "/crosshair-icon-disabled.svg"
              : "/crosshair-icon-white.svg"
          }
          alt="Build Metric Icon"
          width="16"
          height="16"
          className="mr-2.5"
        />
        Align your eval metric
      </PrimaryButton>
    </div>
  );
}
