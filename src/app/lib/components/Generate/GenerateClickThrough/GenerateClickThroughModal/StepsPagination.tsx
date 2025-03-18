import { useContext } from "react";
import {
  GenerateClickThroughContext,
  GenerateClickThroughStepID,
} from "@/app/lib/components/Generate/GenerateClickThrough/GenerateClickThroughContext";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

function StepsPagination() {
  const { step, setStep, setShowClickThrough } = useContext(
    GenerateClickThroughContext,
  );

  const stepNumberBaseClasses =
    "flex items-center justify-center text-md text-text-secondary inter-500 w-6 h-6 ";
  const selectedClasses = "bg-accent-green text-white rounded-full";

  const onBackClick = () => {
    const currentStepNumber = parseInt(step.id.split("_")[1]);
    const newStepNumber = currentStepNumber - 1;

    if (newStepNumber < 1) {
      return setStep(GenerateClickThroughStepID.INTRO);
    }

    setStep(`STEP_${newStepNumber}` as GenerateClickThroughStepID);
  };

  const onForwardClick = () => {
    const currentStepNumber = parseInt(step.id.split("_")[1]);
    const newStepNumber = currentStepNumber + 1;

    if (newStepNumber > 4) {
      return setShowClickThrough(false);
    }

    setStep(`STEP_${newStepNumber}` as GenerateClickThroughStepID);
  };

  const getSelectedClasses = (stepId: GenerateClickThroughStepID) => {
    return step.id === stepId ? selectedClasses : "";
  };

  return (
    <div className="flex items-center">
      <button onClick={onBackClick}>
        <Image
          src="/keyboard-arrow-left-icon-black.svg"
          alt="Generate new eval prompt"
          width="20"
          height="20"
          className="mr-1"
        />
      </button>
      <button
        onClick={() => setStep(GenerateClickThroughStepID.STEP_1)}
        className={twMerge(
          stepNumberBaseClasses,
          getSelectedClasses(GenerateClickThroughStepID.STEP_1),
        )}
      >
        1
      </button>
      <button
        onClick={() => setStep(GenerateClickThroughStepID.STEP_2)}
        className={twMerge(
          stepNumberBaseClasses,
          getSelectedClasses(GenerateClickThroughStepID.STEP_2),
        )}
      >
        2
      </button>
      <button
        onClick={() => setStep(GenerateClickThroughStepID.STEP_3)}
        className={twMerge(
          stepNumberBaseClasses,
          getSelectedClasses(GenerateClickThroughStepID.STEP_3),
        )}
      >
        3
      </button>
      <button
        onClick={() => setStep(GenerateClickThroughStepID.STEP_4)}
        className={twMerge(
          stepNumberBaseClasses,
          getSelectedClasses(GenerateClickThroughStepID.STEP_4),
        )}
      >
        4
      </button>
      <button onClick={onForwardClick}>
        <Image
          src="/keyboard-arrow-right-icon-black.svg"
          alt="Generate new eval prompt"
          width="20"
          height="20"
          className="ml-1"
        />
      </button>
    </div>
  );
}

export { StepsPagination };
