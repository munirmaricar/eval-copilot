import { useState, useEffect } from "react";
import { TestCase } from "@/app/lib/types";

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
}: {
  promptVersions: { id: string; version: number }[] | null;
  currentPromptId: string | undefined;
  currentTestCases: TestCase[];
}) => {
  const [versionHistoryData, setVersionHistoryData] = useState<
    VersionHistoryData[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!promptVersions || !currentPromptId || currentTestCases.length === 0) {
      setVersionHistoryData([]);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const versions = promptVersions.map((version) => {
        if (version.id === currentPromptId) {
          const perfectMatches = currentTestCases.filter(
            (tc) =>
              tc.expectedScore !== null &&
              tc.atlaScore !== null &&
              tc.expectedScore === tc.atlaScore,
          ).length;

          const totalWithScores = currentTestCases.filter(
            (tc) => tc.expectedScore !== null && tc.atlaScore !== null,
          ).length;

          const alignmentScore =
            totalWithScores > 0 ? perfectMatches / totalWithScores : 0;

          return {
            id: version.id,
            version: version.version,
            testCases: currentTestCases,
            alignmentScore,
          };
        }

        const versionFactor = Math.max(
          0.4,
          version.version / promptVersions.length,
        );

        const simulatedTestCases = currentTestCases.map((tc) => {
          if (tc.expectedScore === null || tc.atlaScore === null) {
            return { ...tc };
          }

          const hasMatch = Math.random() < versionFactor;

          return {
            ...tc,
            atlaScore: hasMatch
              ? tc.expectedScore
              : Math.max(
                  1,
                  Math.min(
                    5,
                    tc.expectedScore + (Math.random() > 0.5 ? 1 : -1),
                  ),
                ),
          };
        });

        const perfectMatches = simulatedTestCases.filter(
          (tc) =>
            tc.expectedScore !== null &&
            tc.atlaScore !== null &&
            tc.expectedScore === tc.atlaScore,
        ).length;

        const totalWithScores = simulatedTestCases.filter(
          (tc) => tc.expectedScore !== null && tc.atlaScore !== null,
        ).length;

        const alignmentScore =
          totalWithScores > 0 ? perfectMatches / totalWithScores : 0;

        return {
          id: version.id,
          version: version.version,
          testCases: simulatedTestCases,
          alignmentScore,
        };
      });

      setVersionHistoryData(versions);
      setLoading(false);
    }, 500);
  }, [promptVersions, currentPromptId, currentTestCases]);

  return { versionHistoryData, loading };
};
