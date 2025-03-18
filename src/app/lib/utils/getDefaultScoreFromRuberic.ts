function getDefaultScoreFromRuberic(ruberic: string) {
  if (ruberic === "one-to-five") {
    return 1;
  }

  if (ruberic === "binary") {
    return 1;
  }

  return 0.0;
}

export { getDefaultScoreFromRuberic };
