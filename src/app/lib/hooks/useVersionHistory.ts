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
        const versions = promptVersions.map((version) => {
          if (version.id === currentPromptId) {
            return {
              id: version.id,
              version: version.version,
              testCases: currentTestCases,
              alignmentScore: calculateAlignmentScore(
                currentTestCases,
                threshold,
              ),
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

            if (hasMatch) {
              simulatedScore = tc.expectedScore;
            } else {
              if (scoringCriteria === ScoringCriteria.Binary) {
                simulatedScore = tc.expectedScore === 1 ? 0 : 1;
              } else if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
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

          return {
            id: version.id,
            version: version.version,
            testCases: simulatedTestCases,
            alignmentScore: calculateAlignmentScore(
              simulatedTestCases,
              threshold,
            ),
          };
        });

        setVersionHistoryData(versions);
      } catch (error) {
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
