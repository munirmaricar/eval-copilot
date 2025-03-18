"use client";

import { BuildMetric } from "@/app/lib/components/CreateMetric/BuildMetric/BuildMetric";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GeneratedPrompt } from "@/app/lib/components/CreateMetric/GeneratedPrompt/GeneratedPrompt";
import { useMetricData } from "@/app/metric/create/useMetricData";
import { useSaveMetric } from "@/app/metric/create/useSaveMetric";
import { AddExamples } from "@/app/lib/components/CreateMetric/AddExamples/AddExamples";
import { useUpdateExamples } from "@/app/metric/create/useUpdateExamples";

export default function CreateMetric() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [page, setPage] = useState<string>(
    searchParams.get("page") || "build-metric",
  );

  const {
    scoringRuberic,
    inputVariables,
    criteria,
    metricName,
    prompt,
    setScoringRuberic,
    setInputVariables,
    setCriteria,
    setMetricName,
    setPrompt,
    examples,
    setExamples,
    createNewExample,
    generateNewExample,
    removeExample,
    template,
    setTemplate,
    metricNameAlreadyExists,
    resetExample,
  } = useMetricData();

  const redirectUrl = searchParams.get("redirect");
  const { saveMetric, isSavingMetric } = useSaveMetric({
    scoringRuberic,
    inputVariables,
    metricName,
    prompt,
    examples,
    criteria,
    onSuccess: ({ metricId, promptId }) =>
      router.push(
        redirectUrl || `/generate?prompt=${promptId}&metric=${metricId}`,
      ),
    onError: () =>
      alert(
        "Something went wrong while trying to save the metric. Please try again.",
      ),
  });

  const { updateExamples } = useUpdateExamples({
    examples,
    metricId: searchParams.get("metric")!,
    onSuccess: ({ metricId, promptId }) =>
      router.push(
        redirectUrl || `/generate?prompt=${promptId}&metric=${metricId}`,
      ),
    onError: () =>
      alert(
        "Something went wrong while trying to save the examples. Please try again.",
      ),
  });

  return (
    <main className="h-full w-full bg-gray flex justify-center p-12">
      <div className="w-[650px] bg-white rounded-2xl drop-shadow-lg">
        {page === "build-metric" && (
          <BuildMetric
            onClose={() => router.push(redirectUrl || "/")}
            onGeneratePrompt={() => {
              setPrompt(null);
              setPage("generated-prompt");
            }}
            scoringRuberic={scoringRuberic}
            inputVariables={inputVariables}
            criteria={criteria}
            onScoringRubericChange={setScoringRuberic}
            onInputVariablesChange={setInputVariables}
            onCriteriaChange={setCriteria}
            selectedTemplate={template}
            onSelectedTemplateChange={setTemplate}
          />
        )}
        {page === "generated-prompt" && (
          <GeneratedPrompt
            onClose={() => router.push(redirectUrl || "/")}
            onBack={() => setPage("build-metric")}
            scoringRuberic={scoringRuberic}
            inputVariables={inputVariables}
            criteria={criteria}
            metricName={metricName}
            onMetricNameChange={setMetricName}
            onPromptChange={setPrompt}
            prompt={prompt}
            saveMetric={saveMetric}
            metricNameAlreadyExists={metricNameAlreadyExists}
            isSavingMetric={isSavingMetric}
          />
        )}
        {page === "add-examples" && (
          <AddExamples
            onClose={() => router.push(redirectUrl || "/")}
            metricId={searchParams.get("metric")}
            onBack={() => setPage("generated-prompt")}
            onSave={saveMetric}
            onUpdateExamples={updateExamples}
            scoringRuberic={scoringRuberic}
            inputVariables={inputVariables}
            examples={examples}
            onExamplesChange={setExamples}
            createNewExample={createNewExample}
            generateNewExample={generateNewExample}
            removeExample={removeExample}
            resetExample={resetExample}
          />
        )}
      </div>
    </main>
  );
}
