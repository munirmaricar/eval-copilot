import { useGetMetrics } from "@/app/lib/queries/useGetMetrics";
import { PromptListItem } from "@/app/lib/components/MetricsSidebar/PromptListItem";
import { getLatestPrompt } from "@/app/lib/components/MetricsSidebar/getLatestPrompt";
import { MetricResponse } from "@/app/lib/api/metrics/get";
import { checkIsInitialMetric } from "@/app/lib/metrics/checkIsInitialMetric";

const MetricsList = ({
  searchTerm,
  selectedPrompt,
  selectedMetric,
  setSelectedPrompt,
}: {
  selectedPrompt: MetricResponse["prompts"][number] | null;
  selectedMetric: MetricResponse | null;
  setSelectedPrompt: (value: {
    selectedPromptId: string | null;
    selectedMetricId: string | null;
  }) => void;
  searchTerm: string | null;
}) => {
  const { isLoading, isError, data } = useGetMetrics();

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="py-4 px-6">
        <p className="inter-600 text-text-secondary opacity-70 text-xs">
          There was a problem fetching your metrics. Please try again.
        </p>
      </div>
    );
  }

  return data
    ?.filter((metric) => {
      if (!searchTerm) {
        return true;
      }

      return metric.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (
        getLatestPrompt(a.prompts).updated_at >
        getLatestPrompt(b.prompts).updated_at
      ) {
        return -1;
      }

      return 1;
    })
    .map((metric) => (
      <PromptListItem
        key={metric.id}
        metric={metric}
        isSelected={selectedMetric?.id === metric.id}
        setSelectedPrompt={setSelectedPrompt}
        isInitialMetric={checkIsInitialMetric(metric.name)}
      />
    ));
};

export { MetricsList };
