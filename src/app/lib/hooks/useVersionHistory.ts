import { useState, useEffect, useMemo } from "react";
import {
  PromptVersion,
  ScoringCriteria,
  TestCase,
  VersionHistoryData,
} from "@/app/lib/types";
import {
  calculateAlignmentScore,
  getThreshold,
} from "@/app/lib/components/Generate/ScoreDistribution/utils";

export const useVersionHistory = ({
  promptVersions,
  testCases,
  scoringCriteria,
}: {
  promptVersions: PromptVersion[] | null;
  testCases: TestCase[];
  scoringCriteria: ScoringCriteria;
}) => {
  const [versionHistoryData, setVersionHistoryData] = useState<
    VersionHistoryData[]
  >([]);
  const [loading, setLoading] = useState(false);

  const threshold = useMemo(
    () => getThreshold(scoringCriteria),
    [scoringCriteria],
  );

  useEffect(() => {
    if (!promptVersions || !testCases || testCases.length === 0) {
      setVersionHistoryData([]);
      return;
    }

    const sortedPromptVersions = [...promptVersions].sort(
      (a, b) => a.version - b.version,
    );

    setLoading(true);
    const versionHistory = sortedPromptVersions.map((prompt) => {
      return {
        prompt: prompt,
        alignmentScore: calculateAlignmentScore(testCases, threshold),
      };
    });

    setVersionHistoryData(versionHistory);
    setLoading(false);
  }, [promptVersions, scoringCriteria, threshold, testCases]);

  return { versionHistoryData, testCases, loading };
};
