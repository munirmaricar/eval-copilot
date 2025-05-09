import { useState, useEffect } from "react";
import { TestCase } from "@/app/lib/types";
import { getThreshold } from "@/app/lib/components/Generate/ScoreDistribution/utils";

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
  scoringCriteria = "OneToFive",
}: {
  promptVersions: { id: string; version: number }[] | null;
  currentPromptId: string | undefined;
  currentTestCases: TestCase[];
  scoringCriteria: string;
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
          const testCasesWithBothScores = currentTestCases.filter(
            (tc) => tc.expectedScore !== null && tc.atlaScore !== null,
          );

          if (testCasesWithBothScores.length === 0) {
            return {
              id: version.id,
              version: version.version,
              testCases: currentTestCases,
              alignmentScore: 0,
            };
          }

          const perfectMatches = testCasesWithBothScores.filter(
            (tc) => tc.expectedScore === tc.atlaScore,
          ).length;

          const threshold = getThreshold(scoringCriteria);
          const closeMatches = testCasesWithBothScores.filter(
            (tc) =>
              tc.expectedScore !== tc.atlaScore &&
              Math.abs(tc.expectedScore! - tc.atlaScore!) <= threshold,
          ).length;

          const alignmentScore =
            (perfectMatches + closeMatches * 0.5) /
            testCasesWithBothScores.length;

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
          let simulatedScore;
          const threshold = getThreshold(scoringCriteria);

          if (hasMatch) {
            simulatedScore = tc.expectedScore;
          } else {
            if (scoringCriteria === "Binary") {
              simulatedScore = tc.expectedScore === 1 ? 0 : 1;
            } else if (scoringCriteria === "FloatZeroToOne") {
              const diff = Math.random() * (1.0 - threshold) + threshold;
              simulatedScore = Math.max(
                0,
                Math.min(
                  1,
                  tc.expectedScore + (Math.random() > 0.5 ? diff : -diff),
                ),
              );
              simulatedScore = Math.round(simulatedScore * 10) / 10;
            } else {
              const diff = Math.floor(Math.random() * 4) + 1;
              simulatedScore = Math.max(
                1,
                Math.min(
                  5,
                  tc.expectedScore + (Math.random() > 0.5 ? diff : -diff),
                ),
              );
            }
          }

          return {
            ...tc,
            atlaScore: simulatedScore,
          };
        });

        const testCasesWithBothScores = simulatedTestCases.filter(
          (tc) => tc.expectedScore !== null && tc.atlaScore !== null,
        );

        if (testCasesWithBothScores.length === 0) {
          return {
            id: version.id,
            version: version.version,
            testCases: simulatedTestCases,
            alignmentScore: 0,
          };
        }

        const perfectMatches = testCasesWithBothScores.filter(
          (tc) => tc.expectedScore === tc.atlaScore,
        ).length;

        const threshold = getThreshold(scoringCriteria);
        const closeMatches = testCasesWithBothScores.filter(
          (tc) =>
            tc.expectedScore !== tc.atlaScore &&
            Math.abs(tc.expectedScore! - tc.atlaScore!) <= threshold,
        ).length;

        const alignmentScore =
          (perfectMatches + closeMatches * 0.5) /
          testCasesWithBothScores.length;

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
  }, [promptVersions, currentPromptId, currentTestCases, scoringCriteria]);

  return { versionHistoryData, loading };
};
