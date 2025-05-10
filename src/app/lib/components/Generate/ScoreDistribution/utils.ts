import { ScoringCriteria, TestCase } from "@/app/lib/types";

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
  testCases: TestCase[],
  threshold: number,
): number => {
  if (!testCases || testCases.length === 0) return 0;

  const testCasesWithBothScores = testCases.filter(
    (tc) => tc.expectedScore !== null && tc.atlaScore !== null,
  );

  if (testCasesWithBothScores.length === 0) return 0;

  const perfectMatches = testCasesWithBothScores.filter(
    (tc) => tc.expectedScore === tc.atlaScore,
  ).length;

  const closeMatches = testCasesWithBothScores.filter(
    (tc) =>
      tc.expectedScore !== tc.atlaScore &&
      Math.abs(tc.expectedScore! - tc.atlaScore!) <= threshold,
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
