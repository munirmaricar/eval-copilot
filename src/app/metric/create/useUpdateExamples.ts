import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import { CreatePromptRequest } from "@/app/lib/api/prompts/create";
import { ScoringCriteria } from "../../lib/types";
import { useEffect } from "react";
import { MetricExample } from "@/app/metric/create/useMetricData";
import { useUpdatePrompt } from "@/app/lib/queries/useUpdatePrompt";
import { useGetMetrics } from "@/app/lib/queries/useGetMetrics";
import { UpdatePromptRequest } from "@/app/lib/api/prompts/update";
import { isExampleComplete } from "@/app/lib/utils/isExampleComplete";

function useUpdateExamples({
  examples,
  metricId,
  onSuccess,
  onError,
}: {
  examples: MetricExample[];
  metricId: string;
  onSuccess: (value: { metricId: string; promptId: string }) => void;
  onError: () => void;
}) {
  const {
    mutate: updatePrompt,
    isSuccess,
    isError,
    data: updatePromptData,
  } = useUpdatePrompt();
  const { data: getMetricsData } = useGetMetrics();

  const updateExamples = () => {
    if (!getMetricsData) {
      throw new Error("No data returned from get metrics query");
    }

    const metric = getMetricsData.find((metric) => metric.id === metricId);

    if (!metric) {
      throw new Error(`No metric found with id: ${metricId}`);
    }

    const cleanedExamples = examples.filter((example) =>
      isExampleComplete(example),
    );

    const request: UpdatePromptRequest = {
      id: metricId,
      metric: {
        name: metric.name,
        model: "atla",
        scoring_criteria: metric.scoring_criteria,
        is_draft: metric.is_draft,
        prompts: metric.prompts,
        few_shots: cleanedExamples.map((example) => ({
          id: example.id || crypto.randomUUID(),
          input: example.input!,
          response: example.response!,
          score: example.score!,
          critique: example.critique!,
          ...(example.context && { context: example.context }),
          ...(example.reference && { reference: example.reference }),
          in_use: example.in_use || true,
        })),
      },
    };

    updatePrompt(request);
  };
  useEffect(() => {
    if (!updatePromptData) {
      return;
    }

    if (isSuccess && !updatePromptData) {
      throw new Error("No data returned from create prompt mutation");
    }

    if (isSuccess) {
      const latestPrompt = updatePromptData.prompts.reduce((latest, prompt) => {
        return prompt.version > latest.version ? prompt : latest;
      });

      onSuccess({
        metricId: updatePromptData.id,
        promptId: latestPrompt.id,
      });
    }
  }, [isSuccess, onSuccess, updatePromptData]);

  useEffect(() => {
    if (isError) {
      onError();
    }
  }, [isError, onError]);

  return { updateExamples };
}

export { useUpdateExamples };
