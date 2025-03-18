import { useContext } from "react";
import {
  GenerateClickThroughContext,
  GenerateClickThroughStepID,
} from "@/app/lib/components/Generate/GenerateClickThrough/GenerateClickThroughContext";
import classNames from "classnames";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { twMerge } from "tailwind-merge";
import { StepsPagination } from "@/app/lib/components/Generate/GenerateClickThrough/GenerateClickThroughModal/StepsPagination";
import Image from "next/image";

function GenerateClickThroughModal() {
  const { step, isStep, setStep, setShowClickThrough } = useContext(
    GenerateClickThroughContext,
  );

  const isIntroStep = isStep(GenerateClickThroughStepID.INTRO);
  const isFirstStep = isStep(GenerateClickThroughStepID.STEP_1);
  const isSecondStep = isStep(GenerateClickThroughStepID.STEP_2);
  const isThirdStep = isStep(GenerateClickThroughStepID.STEP_3);
  const isFourthStep = isStep(GenerateClickThroughStepID.STEP_4);

  return (
    <div
      className={twMerge(
        classNames(
          "absolute bg-gray opacity-100 z-50 rounded-lg p-1 max-w-[600px] shadow-2xl",
          {
            "max-w-2/3 [top:50%] [left:50%] transform translate-x-[-50%] translate-y-[-100%]":
              isIntroStep,
            "[top:50%] left-7": isFirstStep,
            "[top:420px] right-9": isSecondStep,
            "[top:40%] [right:610px] ml-5": isThirdStep,
            "[top:50%] [left:50%] transform translate-x-[-50%] translate-y-[-100%]":
              isFourthStep,
          },
        ),
      )}
    >
      <div className="bg-gray rounded-t-lg pt-5 px-6">
        <h2 className="text-lg inter-600 text-text-secondary">{step.title}</h2>

        <button onClick={() => setShowClickThrough(false)}>
          <Image
            src="/close-icon-grey.svg"
            alt="Close metric builder"
            width="20"
            height="20"
            className="absolute top-5 right-6"
          />
        </button>
      </div>
      <div className=" p-6 text-sm inter-400 text-text-secondary opacity-70 bg-white rounded-b-lg">
        <p>{step.content}</p>
        <div className="flex justify-center mt-8">
          {isIntroStep ? (
            <SecondaryButton
              onClick={() => setStep(GenerateClickThroughStepID.STEP_1)}
              className="w-64"
            >
              Let&apos;s Go
            </SecondaryButton>
          ) : (
            <StepsPagination />
          )}
        </div>
      </div>
    </div>
  );
}

export { GenerateClickThroughModal };
