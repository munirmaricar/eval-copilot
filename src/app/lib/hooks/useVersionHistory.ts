import { useState, useEffect, useMemo } from "react";
import { ScoringCriteria, TestCase } from "@/app/lib/types";
import {
  calculateAlignmentScore,
  getThreshold,
} from "@/app/lib/components/Generate/ScoreDistribution/utils";

type VersionHistoryData = {
  id: string;
  version: number;
  testCases: TestCase[];
  alignmentScore: number;
};

export const useVersionHistory = ({
  promptVersions,
  currentPromptId,
  currentTestCases,
  scoringCriteria = ScoringCriteria.OneToFive,
}: {
  promptVersions: { id: string; version: number }[] | null;
  currentPromptId: string | undefined;
  currentTestCases: TestCase[];
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
    if (!promptVersions || !currentPromptId || currentTestCases.length === 0) {
      setVersionHistoryData([]);
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(() => {
      try {
        const sortedVersions = [...promptVersions].sort(
          (a, b) => a.version - b.version,
        );

        const currentVersionIndex = sortedVersions.findIndex(
          (v) => v.id === currentPromptId,
        );

        if (currentVersionIndex === -1) {
          setVersionHistoryData([]);
          setLoading(false);
          return;
        }

        const currentVersionAlignment = calculateAlignmentScore(
          currentTestCases,
          threshold,
        );

        const currentVersionData = {
          id: currentPromptId,
          version: sortedVersions[currentVersionIndex].version,
          testCases: currentTestCases,
          alignmentScore: currentVersionAlignment,
        };

        if (sortedVersions.length === 1) {
          setVersionHistoryData([currentVersionData]);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error generating version history data:", error);
        setVersionHistoryData([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    promptVersions,
    currentPromptId,
    currentTestCases,
    scoringCriteria,
    threshold,
  ]);

  return { versionHistoryData, loading };
};
