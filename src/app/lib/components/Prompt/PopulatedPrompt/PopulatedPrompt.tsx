import { MetricResponse } from "@/app/lib/api/metrics/get";
import { useRouter } from "next/navigation";
import { useEditTemplate } from "@/app/lib/components/Prompt/useEditTemplate";
import { useUpdatePrompt } from "@/app/lib/open-ai/useUpdatePrompt";
import { useContext, useState } from "react";
import { PopulatedPromptFooter } from "@/app/lib/components/Prompt/PopulatedPrompt/PopulatedPromptFooter";
import { checkIsInitialMetric } from "@/app/lib/metrics/checkIsInitialMetric";
import { useDeployMetric } from "@/app/lib/queries/useDeployMetric";
import { PopulatedPromptHeader } from "@/app/lib/components/Prompt/PopulatedPrompt/PopulatedPromptHeader";
import { Prompt } from "@/app/lib/components/Prompt/PopulatedPrompt/Prompt";
import { codeModalContext } from "@/app/lib/components/CodeModal/CodeModalContext";

const PopulatedPrompt = ({
  selectedPrompt,
  selectedMetric,
  setSelectedPrompt,
}: {
  selectedPrompt: MetricResponse["prompts"][number];
  selectedMetric: MetricResponse;
  setSelectedPrompt: (value: {
    selectedPromptId: string | null;
    selectedMetricId: string | null;
  }) => void;
}) => {
  const router = useRouter();

  const [showAIPromptUpdate, setShowAIPromptUpdate] = useState<boolean>(false);

  const { createNewPromptVersion, templateChanged, setTemplate, template } =
    useEditTemplate({
      selectedPrompt,
      selectedMetric,
    });

  const { updatePrompt, isLoading: isGeneratingUpdatedPrompt } =
    useUpdatePrompt({ template, onChange: setTemplate });

  const { openCodeModal } = useContext(codeModalContext);

  const handleOpenCodeModal = () => {
    openCodeModal({
      inputVariables: selectedPrompt.input_variables,
      metricName: selectedMetric.name,
    });
  };

  const { mutate: deployMetric, isPending: isDeployingMetric } =
    useDeployMetric({
      onSucess: handleOpenCodeModal,
    });

  const deployPromptDisabled =
    isDeployingMetric || selectedPrompt.is_deployed || templateChanged;

  const isInitialMetric = checkIsInitialMetric(selectedMetric.name);

  return (
    <>
      <PopulatedPromptHeader
        name={selectedMetric.name}
        initialMetric={isInitialMetric}
        selectedPrompt={selectedPrompt}
        onVersionChange={(value) =>
          setSelectedPrompt({
            selectedPromptId: value?.value!,
            selectedMetricId: selectedMetric.id,
          })
        }
        prompts={selectedMetric.prompts}
        deployed={selectedPrompt.is_deployed}
        onGetCode={handleOpenCodeModal}
        onEvaluate={() =>
          router.push(
            `/generate?metric=${selectedMetric.id}&prompt=${selectedPrompt.id}`,
          )
        }
        onDeploy={() =>
          deployMetric({
            metricId: selectedMetric.id,
            promptId: selectedPrompt.id,
          })
        }
        deployDisabled={deployPromptDisabled}
        templateChanged={templateChanged}
      />
      <Prompt
        template={template}
        onChange={setTemplate}
        disabled={isInitialMetric || isGeneratingUpdatedPrompt}
        templateChanged={templateChanged}
        allowEdit={!isInitialMetric}
      />
      {isInitialMetric ? (
        <div className="h-11" />
      ) : (
        <PopulatedPromptFooter
          templateChanged={templateChanged}
          createNewPromptVersion={createNewPromptVersion}
          setTemplate={setTemplate}
          selectedPrompt={selectedPrompt}
          selectedMetric={selectedMetric}
          showAIPromptUpdate={showAIPromptUpdate}
          setShowAIPromptUpdate={setShowAIPromptUpdate}
          updatePrompt={updatePrompt}
          isGeneratingUpdatedPrompt={isGeneratingUpdatedPrompt}
        />
      )}
    </>
  );
};

export { PopulatedPrompt };
