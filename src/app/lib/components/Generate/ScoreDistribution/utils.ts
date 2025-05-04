export const formatScoreLabel = (
  score: string,
  scoringCriteria: string,
): string => {
  if (scoringCriteria === "Binary") {
    return score === "0" ? "Fail" : "Pass";
  } else if (scoringCriteria === "FloatZeroToOne") {
    return score;
  } else {
    return score;
  }
};

export const getScoreColor = (
  expected: number | null,
  atla: number | null,
): string => {
  if (expected === null || atla === null) return "bg-gray-200";

  if (expected === atla) {
    return "bg-green-200";
  } else if (Math.abs(expected - atla) <= 1) {
    return "bg-yellow-200";
  } else {
    return "bg-red-200";
  }
};

export const getScoreDifferenceDescription = (
  expected: number | null,
  atla: number | null,
): string => {
  if (expected === null || atla === null) return "Missing score";

  if (expected === atla) {
    return "Perfect match";
  } else if (Math.abs(expected - atla) <= 1) {
    return "Close match";
  } else {
    return "Significant difference";
  }
};
