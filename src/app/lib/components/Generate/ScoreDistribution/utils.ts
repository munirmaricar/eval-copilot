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
  testCases: TestCase[] | undefined,
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
  if (scoringCriteria === ScoringCriteria.Binary) {
    return score === "0" ? "Fail" : "Pass";
  } else if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
    return score;
  } else {
    return score;
  }
};

export const getScoreColors = (
  expected: number | null,
  atla: number | null,
  scoringCriteria: ScoringCriteria,
): { backgroundColor: string; color: string } => {
  if (expected === null || atla === null) {
    return {
      backgroundColor: "#e5e7eb",
      color: "#6b7280",
    };
  }

  if (expected === atla) {
    return {
      backgroundColor: "#d1fae5",
      color: "#15803d",
    };
  }

  if (Math.abs(expected - atla) <= getThreshold(scoringCriteria)) {
    return {
      backgroundColor: "#fef08a",
      color: "#a16207",
    };
  }

  return {
    backgroundColor: "#fecaca",
    color: "#b91c1c",
  };
};

export const getScoreDifferenceDescription = (
  expected: number | null,
  atla: number | null,
  scoringCriteria: ScoringCriteria,
): string => {
  if (expected === null || atla === null) return "Missing score";

  if (expected === atla) {
    return "Perfect match";
  }

  if (Math.abs(expected - atla) <= getThreshold(scoringCriteria)) {
    return "Close match";
  } else {
    return "Significant difference";
  }
};
