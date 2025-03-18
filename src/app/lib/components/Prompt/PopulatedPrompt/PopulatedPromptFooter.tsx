import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";
import Image from "next/image";
import { GrayButton } from "@/app/lib/components/Buttons/GrayButton";
import { AIPrompt } from "@/app/lib/components/AIPrompt/AIPrompt";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { useRouter } from "next/navigation";
import { MetricResponse } from "@/app/lib/api/metrics/get";
import { promptUpdateOptions } from "@/app/lib/components/AIPrompt/options";
import { useDeleteMetric } from "@/app/lib/queries/useDeleteMetric";

function PopulatedPromptFooter({
  createNewPromptVersion,
  templateChanged,
  setTemplate,
  selectedPrompt,
  selectedMetric,
  showAIPromptUpdate,
  setShowAIPromptUpdate,
  updatePrompt,
  isGeneratingUpdatedPrompt,
}: {
  createNewPromptVersion: () => void;
  templateChanged: boolean;
  setTemplate: (value: string) => void;
  selectedPrompt: MetricResponse["prompts"][number];
  selectedMetric: MetricResponse;
  showAIPromptUpdate: boolean;
  setShowAIPromptUpdate: (value: boolean) => void;
  updatePrompt: (prompt: string) => void;
  isGeneratingUpdatedPrompt: boolean;
}) {
  const router = useRouter();

  const { mutate: deleteMetric } = useDeleteMetric({
    onSuccess: () => router.push("/"),
  });

  return (
    <div className="flex h-11 justify-between">
      {templateChanged ? (
        <div className="flex">
          <PrimaryButton
            onClick={createNewPromptVersion}
            fullWidth={false}
            className="mr-3"
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
          <GrayButton
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
          </GrayButton>
        </div>
      ) : (
        <div className="flex">
          <GrayButton
            onClick={() =>
              router.push(
                `/metric/create/?metric=${selectedMetric.id}&prompt=${selectedPrompt.id}&page=add-examples&allow-back=false&redirect=${encodeURIComponent(`/?metric=${selectedMetric.id}&prompt=${selectedPrompt.id}`)}`,
              )
            }
            className="mr-3"
          >
            <Image
              src="/edit-icon-black.svg"
              alt="Edit few-shot examples"
              width="16"
              height="16"
              className="pr-1"
            />
            Edit few-shot examples
          </GrayButton>
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
      <button onClick={() => deleteMetric({ id: selectedMetric.id })}>
        <Image
          src={"/delete-icon-red.svg"}
          alt="Delete metric"
          width="18"
          height="18"
        />
      </button>
    </div>
  );
}

export { PopulatedPromptFooter };
