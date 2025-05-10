import { useState, useEffect, useMemo } from "react";
import {
  PromptVersion,
  ScoringCriteria,
  VersionHistoryData,
} from "@/app/lib/types";
import {
  calculateAlignmentScore,
  getThreshold,
} from "@/app/lib/components/Generate/ScoreDistribution/utils";
import { getTestCasesForMetric } from "../api/testCases/getTestCasesForMetric";
import { GetTestCasesForMetricResponse } from "../api/testCases/getTestCasesForMetric";
export const useVersionHistory = ({
  promptVersions,
  metricId,
  scoringCriteria,
}: {
  promptVersions: PromptVersion[] | null;
  metricId: string | undefined;
  scoringCriteria: ScoringCriteria;
}) => {
  const [versionHistoryData, setVersionHistoryData] = useState<
    VersionHistoryData[]
  >([]);
  const [testCases, setTestCases] = useState<GetTestCasesForMetricResponse>([]);
  const [loading, setLoading] = useState(false);

  const threshold = useMemo(
    () => getThreshold(scoringCriteria),
    [scoringCriteria],
  );

  useEffect(() => {
    if (!promptVersions || !metricId) {
      setVersionHistoryData([]);
      setTestCases([]);
      return;
    }

    const sortedPromptVersions = [...promptVersions].sort(
      (a, b) => a.version - b.version,
    );

    setLoading(true);
    getTestCasesForMetric({
      metricId: metricId,
    })
      .then((testCases) => {
        setTestCases(testCases);

        const versionHistory = sortedPromptVersions.map((prompt) => {
          return {
            prompt: prompt,
            alignmentScore: calculateAlignmentScore(testCases, threshold),
          };
        });

        setVersionHistoryData(versionHistory);
        setLoading(false);
      })
      .catch(() => {
        setVersionHistoryData([]);
        setTestCases([]);
        setLoading(false);
      });
  }, [promptVersions, scoringCriteria, threshold, metricId]);

  return { versionHistoryData, testCases, loading };
};
