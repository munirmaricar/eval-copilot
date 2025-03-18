import classNames from "classnames";
import Image from "next/image";
import { Tooltip as TT } from "react-tooltip";
import { Tooltip } from "@/app/lib/components/Tooltips/Tooltip";
import { useContext } from "react";
import {
  GenerateClickThroughContext,
  GenerateClickThroughStepID,
} from "@/app/lib/components/Generate/GenerateClickThrough/GenerateClickThroughContext";

function CohensKappa({ kappa }: { kappa: number | null }) {
  const hasKappa = kappa !== null;
  const lowScore = hasKappa && kappa < 0.2;
  const mediumScore = hasKappa && kappa >= 0.2 && kappa <= 0.41;
  const highScore = hasKappa && kappa > 0.41;

  const { isStep } = useContext(GenerateClickThroughContext);
  const isFourthClickThroughStep = isStep(GenerateClickThroughStepID.STEP_4);

  const classes = classNames(
    "inter-500 text-xs py-1.5 px-4 rounded cursor-pointer border flex justify-center",
    {
      "bg-white border-text-disabled text-text-disabled": !hasKappa,
      "bg-error-primary-20 text-error-primary-80 border-text-secondary":
        lowScore,
      "bg-warning-primary-20 text-warning-primary-50 border-text-secondary":
        mediumScore,
      "bg-success-primary-0 text-success-primary border-text-secondary":
        highScore,
      "z-50 rounded-lg shadow-[0_0_0_10px_white]": isFourthClickThroughStep,
    },
  );

  const noKappaTooltipHtml = `
  <p style="font-size: 14px;margin-bottom: 8px;">Cohen’s Kappa</p>
  <p style="font-size: 12px;margin-bottom: 16px;">Cohen's Kappa is a statistical measure<br /> representing the level of agreement between<br />your expected scores and Atla’s scores.</p>
  
  <p style="font-size:12px;font-style: italic;">*Requires 3 or more test samples with expected scores</p>
  `;

  const kappaTooltipHtml = `
  <p style="font-size: 14px;margin-bottom: 8px;">Cohen’s Kappa</p>
  <p style="font-size: 12px;margin-bottom: 16px;">Cohen's Kappa represents the level of agreement between<br />your expected scores and Atla’s scores. It ranges from -1 to 1:</p>
  
  <p style="font-size:12px;">• Values < 0 indicate <strong>no agreement</strong></p>
  <p style="font-size:12px;">• 0 indicates <strong>agreement by chance</strong></p>
  <p style="font-size:12px;">• 0.01 to 0.20 indicates <strong>slight agreement</strong></p>
  <p style="font-size:12px;">• 0.21 to 0.40 indicates <strong>fair agreement</strong></p>
  <p style="font-size:12px;">• 0.41 to 0.60 indicates <strong>moderate agreement</strong></p>
  <p style="font-size:12px;">• 0.61 to 0.80 indicates <strong>substantial agreement</strong></p>
  <p style="font-size:12px;">• 0.81 to 1.00 indicates <strong>almost perfect agreement</strong></p>`;

  const requestAReviewTooltipHtml = `
    <p style="font-size:12px;text-align: center;margin-bottom: 10px">Try adjusting the prompts to improve<br />the Cohen&apos;s Kappa score.</p>
    <p style="font-size:12px;text-align: center;font-weight: 700">Still not working?<p>
    <p style="font-size:12px;text-align: center">Click to request a review</p>
  `;

  return (
    <>
      <TT
        id="cohens-kappa-description"
        style={{
          borderRadius: "8px",
          backgroundColor: "#262626",
          zIndex: 100,
        }}
        opacity={1}
      />
      <div className="flex items-center justify-center">
        <div
          data-tooltip-id="cohens-kappa-description"
          data-tooltip-html={hasKappa ? kappaTooltipHtml : noKappaTooltipHtml}
          data-tooltip-place="right"
          className={classes}
        >
          Cohen&apos;s Kappa
          <div className="width w-7 ml-2 text-center">
            {hasKappa ? kappa : "-"}
          </div>
        </div>
        {lowScore && (
          <Tooltip
            id={"kappa-request-a-review"}
            html={requestAReviewTooltipHtml}
            place="right"
          >
            <button className="flex items-center bg-error-primary-20 border border-error-primary-80 rounded-3xl inter-600 text-sm py-1 px-2 ml-2">
              <Image
                src={"/person-icon-black.svg"}
                alt="Request human review"
                width="20"
                height="20"
                className="pr-1"
              />
              Request human review
            </button>
          </Tooltip>
        )}
      </div>
    </>
  );
}

export { CohensKappa };
