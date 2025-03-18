function checkIsInitialMetric(metricName: string | undefined) {
  if (metricName === undefined) {
    return false;
  }

  const intialMetricNames = [
    "hallucination",
    "recall",
    "precision",
    "logical_coherence",
    "context_relevance",
    "faithfulness",
  ];

  return intialMetricNames.includes(metricName);
}

export { checkIsInitialMetric };
