import { VariableWidthCell } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/VariableWidthCell";
import { FixedWidthCell } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/FixedWidthCell";
import classNames from "classnames";
import { useContext } from "react";
import {
  GenerateClickThroughContext,
  GenerateClickThroughStepID,
} from "@/app/lib/components/Generate/GenerateClickThrough/GenerateClickThroughContext";

function TestCasesTableHeader({
  displayContext,
  displayReference,
}: {
  displayContext: boolean;
  displayReference: boolean;
}) {
  const sharedCellClasses =
    "bg-gray inter-400 text-xs text-text-secondary py-2 px-4 border-r border-border-primary";

  const { isStep } = useContext(GenerateClickThroughContext);
  const isFirstClickThroughStep = isStep(GenerateClickThroughStepID.STEP_1);
  const isSecondClickThroughStep = isStep(GenerateClickThroughStepID.STEP_2);

  return (
    <div className="flex flex-grow">
      <VariableWidthCell
        className={classNames(sharedCellClasses + " rounded-tl-lg", {
          "z-50": isFirstClickThroughStep,
        })}
      >
        <p>Input</p>
      </VariableWidthCell>
      {displayContext && (
        <VariableWidthCell
          className={classNames(sharedCellClasses, {
            "z-50": isFirstClickThroughStep,
          })}
        >
          <p>Context</p>
        </VariableWidthCell>
      )}
      {displayReference && (
        <VariableWidthCell
          className={classNames(sharedCellClasses, {
            "z-50": isFirstClickThroughStep,
          })}
        >
          <p>Ground truth response</p>
        </VariableWidthCell>
      )}
      <VariableWidthCell
        className={classNames(sharedCellClasses, {
          "z-50": isFirstClickThroughStep,
        })}
      >
        <p>Response</p>
      </VariableWidthCell>
      <FixedWidthCell
        className={classNames(sharedCellClasses, {
          "z-50": isSecondClickThroughStep,
        })}
      >
        <p>Expected Score</p>
      </FixedWidthCell>
      <FixedWidthCell
        className={classNames(sharedCellClasses, "flex justify-center", {
          "z-50": isSecondClickThroughStep,
        })}
      >
        <p>Atla Score</p>
      </FixedWidthCell>
      <VariableWidthCell
        className={classNames(sharedCellClasses, {
          "z-50": isSecondClickThroughStep,
        })}
      >
        <p>Atla Critique</p>
      </VariableWidthCell>
      <FixedWidthCell
        width="w-10"
        className={classNames(
          sharedCellClasses + " rounded-tr-lg border-none",
          {
            "z-50": isSecondClickThroughStep,
          },
        )}
      />
    </div>
  );
}

export { TestCasesTableHeader };
