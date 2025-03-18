import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";
import Image from "next/image";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { MetricResponse } from "@/app/lib/api/metrics/get";
import { useRouter } from "next/navigation";
import { AIPrompt } from "@/app/lib/components/AIPrompt/AIPrompt";
import { useContext, useState } from "react";
import { useUpdatePrompt } from "@/app/lib/open-ai/useUpdatePrompt";
import { checkIsInitialMetric } from "@/app/lib/metrics/checkIsInitialMetric";
import { promptUpdateOptions } from "@/app/lib/components/AIPrompt/options";
import { Prompt } from "@/app/lib/components/Prompt/PopulatedPrompt/Prompt";
import {
  GenerateClickThroughContext,
  GenerateClickThroughStepID,
} from "@/app/lib/components/Generate/GenerateClickThrough/GenerateClickThroughContext";
import classNames from "classnames";

function PromptModal({
  selectedPrompt,
  selectedMetric,
  onClose,
  template,
  setTemplate,
  templateChanged,
  createNewPromptVersion,
}: {
  selectedPrompt: MetricResponse["prompts"][number];
  selectedMetric: MetricResponse;
  onClose: () => void;
  templateChanged: boolean;
  setTemplate: (value: string) => void;
  template: string;
  createNewPromptVersion: () => void;
}) {
  const router = useRouter();

  const [showAIPromptUpdate, setShowAIPromptUpdate] = useState<boolean>(false);

  const { updatePrompt, isLoading: isGeneratingUpdatedPrompt } =
    useUpdatePrompt({ template, onChange: setTemplate });

  const isInitialMetric = checkIsInitialMetric(selectedMetric.name);

  const handleOnClose = () => {
    setTemplate(selectedPrompt.template);
    onClose();
  };

  const { isStep } = useContext(GenerateClickThroughContext);
  const isThirdClickThroughStep = isStep(GenerateClickThroughStepID.STEP_3);

  return (
    <div
      className={classNames(
        "absolute h-3/4 border bottom-8 right-8 w-[550px] bg-gray border-border-primary rounded-xl shadow-2xl p-4 flex flex-col z-20",
        { "z-50 rounded-lg shadow-[0_0_0_10px_white]": isThirdClickThroughStep },
      )}
    >
      <button onClick={handleOnClose} className="absolute top-3.5 right-5 z-20">
        <Image
          src="/close-icon-grey.svg"
          alt="Close prompt modal"
          width="16"
          height="16"
        />
      </button>
      <Prompt
        template={template}
        onChange={setTemplate}
        disabled={isInitialMetric || isGeneratingUpdatedPrompt}
        templateChanged={templateChanged}
        allowEdit={!isInitialMetric}
      />
      {!isInitialMetric && (
        <div>
          <div className="flex">
            {templateChanged ? (
              <>
                <PrimaryButton
                  fullWidth={false}
                  className="mr-3"
                  onClick={createNewPromptVersion}
                  disabled={isGeneratingUpdatedPrompt}
                >
                  <Image
                    src={
                      isGeneratingUpdatedPrompt
                        ? "/spanner-icon-disabled.svg"
                        : "/spanner-icon-white.svg"
                    }
                    alt="Save updated evaluation metric"
                    width="15"
                    height="15"
                    className="mr-2"
                  />
                  Save evaluation metric
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => setTemplate(selectedPrompt.template)}
                  disabled={isGeneratingUpdatedPrompt}
                >
                  <Image
                    src={
                      isGeneratingUpdatedPrompt
                        ? "/close-icon-disabled.svg"
                        : "/close-icon-black.svg"
                    }
                    alt="Cancel editing evaluation metric"
                    width="20"
                    height="20"
                    className="pr-1"
                  />
                  Cancel
                </SecondaryButton>
              </>
            ) : (
              <div className="flex overflow-visible">
                <PrimaryButton
                  onClick={() =>
                    router.push(
                      `/metric/create/?metric=${selectedMetric.id}&prompt=${selectedPrompt.id}&page=add-examples&allow-back=false&redirect=${encodeURIComponent(`/generate?metric=${selectedMetric.id}&prompt=${selectedPrompt.id}`)}`,
                    )
                  }
                  className="mr-3 px-4"
                  fullWidth={false}
                >
                  <Image
                    src="/edit-icon-white.svg"
                    alt="Edit few-shot examples"
                    width="23"
                    height="23"
                    className="pr-2"
                  />
                  Edit few-shot examples
                </PrimaryButton>
                <div className="relative overflow-visible">
                  {showAIPromptUpdate && (
                    <AIPrompt
                      onClose={() => setShowAIPromptUpdate(false)}
                      onSubmit={(prompt) => {
                        updatePrompt(prompt);
                        setShowAIPromptUpdate(false);
                      }}
                      options={promptUpdateOptions}
                    />
                  )}
                  <SecondaryButton
                    disabled={showAIPromptUpdate}
                    onClick={() => setShowAIPromptUpdate(true)}
                  >
                    <Image
                      src={
                        showAIPromptUpdate
                          ? "/sparkle-icon-disabled.svg"
                          : "/sparkle-icon-black.svg"
                      }
                      alt="Describe how to edit the prompt"
                      width="25"
                      height="25"
                      className="pr-2"
                    />
                    Describe how to edit the prompt
                  </SecondaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { PromptModal };
