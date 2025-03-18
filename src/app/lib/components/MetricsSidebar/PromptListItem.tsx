import { MetricResponse } from "@/app/lib/api/metrics/get";
import { DateTime } from "luxon";
import classNames from "classnames";
import { getLatestPrompt } from "@/app/lib/components/MetricsSidebar/getLatestPrompt";

const PromptListItem = ({
  metric,
  setSelectedPrompt,
  isSelected,
  isInitialMetric,
}: {
  metric: MetricResponse;
  isSelected: boolean;
  setSelectedPrompt: (value: {
    selectedPromptId: string | null;
    selectedMetricId: string | null;
  }) => void;
  isInitialMetric: boolean;
}) => {
  const latestPrompt = getLatestPrompt(metric.prompts);
  const numberOfVersions = metric.prompts.length;
  const versionText = numberOfVersions > 1 ? "versions" : "version";
  const versionCountText = metric.is_draft
    ? "Draft"
    : `${numberOfVersions} ${versionText}`;

  return (
    <div
      onClick={() => {
        isSelected
          ? setSelectedPrompt({
              selectedPromptId: null,
              selectedMetricId: null,
            })
          : setSelectedPrompt({
              selectedPromptId: latestPrompt.id,
              selectedMetricId: metric.id,
            });
      }}
      className={classNames("py-4 px-6  flex flex-col cursor-pointer", {
        "bg-gray border-l-8 border-text-secondary": isSelected,
        "border-b border-border-primary": !isSelected,
      })}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="inter-600 text-base text-text-secondary ">
          {metric.name}
        </h3>
        <div
          className={classNames("w-1.5 h-1.5 rounded-full bg-accent-green", {
            "bg-background-disabled": !latestPrompt.is_deployed,
          })}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="inter-400 text-text-secondary opacity-70 text-xs">
          {DateTime.fromISO(latestPrompt.updated_at).toLocaleString(
            DateTime.DATETIME_MED,
          )}
        </p>
        {isInitialMetric ? (
          <p className="inter-500 text-xs text-text-secondary opacity-70 bg-gray py-0.5 px-1 rounded border-text-secondary border border-opacity-10">
            Base metric
          </p>
        ) : (
          <p className="inter-500 text-text-secondary opacity-70 text-xs">
            {versionCountText}
          </p>
        )}
      </div>
    </div>
  );
};

export { PromptListItem };
