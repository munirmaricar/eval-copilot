import { ScoringCriteria, TestCase } from "@/app/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatScoreLabel } from "@/app/lib/components/Generate/ScoreDistribution/utils";
import { useMemo } from "react";
import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";

type ScoreDistributionChartProps = {
  testCases: GetTestCasesForMetricResponse;
  scoringCriteria: ScoringCriteria;
};

const ScoreDistributionChart = ({
  testCases,
  scoringCriteria,
}: ScoreDistributionChartProps) => {
  const chartData = useMemo(() => {
    const scoreCountMap = new Map<string, { expected: number; atla: number }>();

    if (scoringCriteria === ScoringCriteria.Binary) {
      scoreCountMap.set("0", { expected: 0, atla: 0 });
      scoreCountMap.set("1", { expected: 0, atla: 0 });
    } else if (scoringCriteria === ScoringCriteria.OneToFive) {
      for (let i = 1; i <= 5; i++) {
        scoreCountMap.set(i.toString(), { expected: 0, atla: 0 });
      }
    } else if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
      for (let i = 0; i <= 10; i++) {
        const score = (i / 10).toFixed(1);
        scoreCountMap.set(score, { expected: 0, atla: 0 });
      }
    }

    testCases.forEach((testCase) => {
      if (testCase.expected_score !== null) {
        let expectedScoreKey = testCase.expected_score.toString();
        if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
          const roundedValue = Math.round(testCase.expected_score * 10) / 10;
          expectedScoreKey = roundedValue.toFixed(1);
        }

        if (scoreCountMap.has(expectedScoreKey)) {
          const current = scoreCountMap.get(expectedScoreKey)!;
          scoreCountMap.set(expectedScoreKey, {
            ...current,
            expected: current.expected + 1,
          });
        }
      }

      if (testCase.atla_score !== null) {
        let atlaScoreKey = testCase.atla_score.toString();
        if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
          const roundedValue = Math.round(testCase.atla_score * 10) / 10;
          atlaScoreKey = roundedValue.toFixed(1);
        }

        if (scoreCountMap.has(atlaScoreKey)) {
          const current = scoreCountMap.get(atlaScoreKey)!;
          scoreCountMap.set(atlaScoreKey, {
            ...current,
            atla: current.atla + 1,
          });
        }
      }
    });

    return Array.from(scoreCountMap.entries())
      .map(([score, counts]) => ({
        score: formatScoreLabel(score, scoringCriteria),
        expected: counts.expected,
        atla: counts.atla,
        originalScore: score,
      }))
      .sort((a, b) => {
        return parseFloat(a.originalScore) - parseFloat(b.originalScore);
      });
  }, [testCases, scoringCriteria]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="score" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="expected" fill="#8884d8" name="Expected" />
        <Bar dataKey="atla" fill="#82ca9d" name="Atla" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export { ScoreDistributionChart };
