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

export const getScoreColors = (
  expected: number | null,
  atla: number | null,
): { backgroundColor: string; textColor: string } => {
  if (expected === null || atla === null) {
    return {
      backgroundColor: "#e5e7eb",
      textColor: "#6b7280",
    };
  }

  if (expected === atla) {
    return {
      backgroundColor: "#d1fae5",
      textColor: "#15803d",
    };
  }

  if (Math.abs(expected - atla) <= 1) {
    return {
      backgroundColor: "#fef08a",
      textColor: "#a16207",
    };
  }

  return {
    backgroundColor: "#fecaca",
    textColor: "#b91c1c",
  };
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
