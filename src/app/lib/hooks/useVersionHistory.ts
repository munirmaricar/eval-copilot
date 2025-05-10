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

export const storePromptVersionTestCases = (
  promptVersionId: string,
  testCases: TestCase[],
) => {
  localStorage.setItem(
    `promptVersionTestCases-${promptVersionId}`,
    JSON.stringify(testCases),
  );
};

export const getPromptVersionTestCases = (
  promptVersionId: string,
): TestCase[] => {
  const promptVersionTestCases = localStorage.getItem(
    `promptVersionTestCases-${promptVersionId}`,
  );
  if (!promptVersionTestCases) return [];
  return JSON.parse(promptVersionTestCases);
};

export const useVersionHistory = ({
  currentPromptId,
  promptVersions,
  scoringCriteria,
}: {
  currentPromptId: string | undefined;
  promptVersions: PromptVersion[] | null;
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
    if (!promptVersions) {
      setVersionHistoryData([]);
      return;
    }

    setLoading(true);
    const sortedPromptVersions = [...promptVersions].sort(
      (a, b) => a.version - b.version,
    );
    const versionHistory = sortedPromptVersions.map((prompt) => {
      const testCases = getPromptVersionTestCases(prompt.id);
      return {
        prompt: prompt,
        alignmentScore: calculateAlignmentScore(testCases, threshold),
      };
    });
    setVersionHistoryData(versionHistory);
    setLoading(false);
  }, [promptVersions, scoringCriteria, threshold, currentPromptId]);

  return { versionHistoryData, loading };
};
