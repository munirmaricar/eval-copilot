import { MetricExample } from "@/app/metric/create/useMetricData";

const isExampleComplete = (example: MetricExample) => {
  return (
    example.input !== null &&
    example.response !== null &&
    example.score !== null
  );
};

export { isExampleComplete };
