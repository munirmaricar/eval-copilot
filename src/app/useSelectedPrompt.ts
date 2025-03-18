import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetMetrics } from "@/app/lib/queries/useGetMetrics";
import { useCallback, useEffect, useState } from "react";
import { MetricResponse } from "@/app/lib/api/metrics/get";

function useSelectedPrompt() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: metricsData } = useGetMetrics();

  const selectedPromptId = searchParams.get("prompt");
  const selectedMetricId = searchParams.get("metric");

  const [selectedPrompt, setSelectedPrompt] = useState<
    MetricResponse["prompts"][number] | null
  >(null);

  const [selectedMetric, setSelectedMetric] = useState<MetricResponse | null>(
    null,
  );

  const setQueryString = useCallback(
    (values: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      values.forEach(({ name, value }) => params.set(name, value));

      const queryString = params.toString();

      router.push(`${pathname}?${queryString}`);
    },
    [searchParams, router, pathname],
  );

  const handleSetSelectedPrompt = ({
    selectedPromptId,
    selectedMetricId,
  }: {
    selectedPromptId: string | null;
    selectedMetricId: string | null;
  }) => {
    setQueryString([
      { name: "prompt", value: selectedPromptId ?? "null" },
      { name: "metric", value: selectedMetricId ?? "null" },
    ]);
  };

  useEffect(() => {
    if (!metricsData) {
      return;
    }

    const metric =
      metricsData.find((metric) => metric.id === selectedMetricId) || null;

    const selectedPrompt =
      metric?.prompts.find((prompts) => prompts.id === selectedPromptId) ||
      null;

    setSelectedPrompt(selectedPrompt);
    setSelectedMetric(metric);
  }, [metricsData, selectedPromptId, selectedMetricId]);

  return { selectedPrompt, handleSetSelectedPrompt, selectedMetric };
}

export { useSelectedPrompt };
