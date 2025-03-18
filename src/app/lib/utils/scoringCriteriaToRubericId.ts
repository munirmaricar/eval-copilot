import { ScoringCriteria } from "../types";

function scoringCriteriaToRubericId(scoringCriteria: ScoringCriteria) {
  if (scoringCriteria === ScoringCriteria.OneToFive) {
    return "one-to-five";
  }

  if (scoringCriteria === ScoringCriteria.Binary) {
    return "binary";
  }

  return "float";
}

export { scoringCriteriaToRubericId };
