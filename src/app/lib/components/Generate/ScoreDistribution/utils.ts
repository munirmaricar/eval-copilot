import { ScoringCriteria } from "@/app/lib/types";
import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";

export const getThreshold = (criteria: ScoringCriteria): number => {
  switch (criteria) {
    case ScoringCriteria.FloatZeroToOne:
      return 0.2;
    case ScoringCriteria.Binary:
      return 0;
    default:
      return 1;
  }
};

export const calculateAlignmentScore = (
  testCases: GetTestCasesForMetricResponse,
  threshold: number,
): number => {
  if (!testCases || testCases.length === 0) return 0;

  const testCasesWithBothScores = testCases.filter(
    (tc) => tc.expected_score !== null && tc.atla_score !== null,
  );

  if (testCasesWithBothScores.length === 0) return 0;

  const perfectMatches = testCasesWithBothScores.filter(
    (tc) => tc.expected_score === tc.atla_score,
  ).length;

  const closeMatches = testCasesWithBothScores.filter(
    (tc) =>
      tc.expected_score !== tc.atla_score &&
      Math.abs(tc.expected_score! - tc.atla_score!) <= threshold,
  ).length;

  const alignmentScore =
    (perfectMatches + closeMatches * 0.5) / testCasesWithBothScores.length;

  return parseFloat(alignmentScore.toFixed(2));
};

export const formatScoreLabel = (
  score: string,
  scoringCriteria: ScoringCriteria,
): string => {
  switch (scoringCriteria) {
    case ScoringCriteria.Binary:
      return score === "0" ? "Fail" : "Pass";
    default:
      return score;
  }
};

export const getScoreDetails = (
  expected: number | null,
  atla: number | null,
  scoringCriteria: ScoringCriteria,
): { text: string; color: string; backgroundColor: string } => {
  if (expected === null || atla === null) {
    return {
      text: "Missing score",
      color: "#6b7280",
      backgroundColor: "#e5e7eb",
    };
  }

  if (expected === atla) {
    return {
      text: "Perfect match",
      color: "#15803d",
      backgroundColor: "#d1fae5",
    };
  }

  if (Math.abs(expected - atla) <= getThreshold(scoringCriteria)) {
    return {
      text: "Close match",
      color: "#a16207",
      backgroundColor: "#fef08a",
    };
  }

  return {
    text: "Significant difference",
    color: "#b91c1c",
    backgroundColor: "#fecaca",
  };
};
