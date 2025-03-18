import { useEffect, useState } from "react";
import { useSelectedPrompt } from "@/app/useSelectedPrompt";
import { useUpdatePrompt } from "@/app/lib/queries/useUpdatePrompt";
import { MetricResponse } from "@/app/lib/api/metrics/get";

function useEditTemplate({
  selectedPrompt,
  selectedMetric,
}: {
  selectedPrompt: MetricResponse["prompts"][number] | null;
  selectedMetric: MetricResponse | null;
}) {
  const [template, setTemplate] = useState<string | null>(
    selectedPrompt?.template || null,
  );

  useEffect(() => {
    if (selectedPrompt === null) {
      return;
    }

    setTemplate(selectedPrompt.template);
  }, [selectedPrompt]);

  const { handleSetSelectedPrompt } = useSelectedPrompt();

  const templateChanged = selectedPrompt?.template !== template;

  const { mutate } = useUpdatePrompt();

  const createNewPromptVersion = () => {
    if (selectedMetric === null) {
      throw new Error("Selected metric not loaded");
    }

    if (selectedPrompt === null) {
      throw new Error("Selected prompt not loaded");
    }

    if (template === null) {
      throw new Error("Template not loaded");
    }

    const latestPromptVersion = selectedMetric.prompts.reduce((acc, prompt) => {
      return prompt.version > acc ? prompt.version : acc;
    }, 0);

    const newPrompt = {
      id: crypto.randomUUID(),
      version: latestPromptVersion + 1,
      is_deployed: false,
      updated_at: new Date().toISOString(),
      name: selectedPrompt.name,
      template: template,
      input_variables: selectedPrompt.input_variables,
      criteria: selectedPrompt.criteria,
    };

    const newMetric = {
      ...selectedMetric,
      prompts: [...selectedMetric.prompts, newPrompt],
      few_shots: selectedMetric.few_shots,
    };

    mutate({ id: selectedMetric.id, metric: newMetric });

    handleSetSelectedPrompt({
      selectedPromptId: newPrompt.id,
      selectedMetricId: selectedMetric.id,
    });
  };

  return { createNewPromptVersion, templateChanged, template, setTemplate };
}

export { useEditTemplate };
