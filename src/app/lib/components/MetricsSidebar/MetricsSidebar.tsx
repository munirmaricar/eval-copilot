import { useGetMetrics } from "@/app/lib/queries/useGetMetrics";
import { MetricsList } from "@/app/lib/components/MetricsSidebar/MetricsList";
import { useState } from "react";
import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";
import Image from "next/image";
import { MetricResponse } from "@/app/lib/api/metrics/get";
import { useRouter } from "next/navigation";

const MetricsSidebar = ({
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
}) => {
  const { isLoading, isError, data } = useGetMetrics();

  const metricsCount = isLoading || isError ? "" : `(${data?.length})`;

  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const router = useRouter();

  return (
    <div className="bg-white w-full h-full rounded-2xl border border-border-gray flex flex-col justify-between">
      <div>
        <div className="py-4 px-6">
          <h2 className="inter-600 text-text-secondary opacity-70 text-xs">
            YOUR METRICS {metricsCount}
          </h2>
        </div>
        <div className="px-3 mb-2">
          <input
            type="text"
            placeholder="Search"
            className="w-full h-11 bg-gray border border-border-primary rounded-lg p-3 inter-400 text-sm"
            onChange={(e) => setSearchTerm(e.target.value || null)}
          />
        </div>
      </div>
      <div className="min-h-0 overflow-auto flex flex-grow flex-col">
        <MetricsList
          searchTerm={searchTerm}
          selectedMetric={selectedMetric}
          setSelectedPrompt={setSelectedPrompt}
          selectedPrompt={selectedPrompt}
        />
      </div>
      <div className="border-t border-border-primary py-4 px-6">
        <PrimaryButton onClick={() => router.push("/metric/create")}>
          <Image
            src="/plus-icon.svg"
            alt="Generate new eval prompt"
            width="20"
            height="20"
            className="pr-1"
          />
          Generate new eval prompt
        </PrimaryButton>
      </div>
    </div>
  );
};

export { MetricsSidebar };
