import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TestCase } from "@/app/lib/types";
import { getThreshold } from "./utils";

type VersionData = {
  id: string;
  version: number;
  testCases?: TestCase[];
  alignment?: number;
};

type VersionComparisonChartProps = {
  promptVersions: VersionData[];
  currentPromptId: string | undefined;
  scoringCriteria: string;
};

const calculateAlignmentScore = (
  testCases: TestCase[] | undefined,
  scoringCriteria: string,
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
      Math.abs(tc.expectedScore! - tc.atlaScore!) <=
        getThreshold(scoringCriteria),
  ).length;

  const alignmentScore =
    (perfectMatches + closeMatches * 0.5) / testCasesWithBothScores.length;

  return parseFloat(alignmentScore.toFixed(2));
};

const VersionComparisonChart = ({
  promptVersions,
  currentPromptId,
  scoringCriteria,
}: VersionComparisonChartProps) => {
  const chartData = promptVersions
    .filter((version) => version.testCases && version.testCases.length > 0)
    .map((version) => ({
      version: version.version,
      alignment:
        version.alignment ||
        calculateAlignmentScore(version.testCases, scoringCriteria),
      current: version.id === currentPromptId,
    }))
    .sort((a, b) => a.version - b.version);

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No version comparison data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="version"
          label={{
            value: "Version",
            position: "insideBottomRight",
            offset: -10,
          }}
        />
        <YAxis
          domain={[0, 1]}
          label={{
            value: "Alignment Score",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip
          formatter={(value: number) => [
            `${(value * 100).toFixed(0)}%`,
            "Alignment",
          ]}
          labelFormatter={(value) => `Version ${value}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="alignment"
          stroke="#8884d8"
          name="Score Alignment"
          strokeWidth={2}
          dot={{ r: 6, strokeWidth: 2, fill: "white" }}
          activeDot={{ r: 8, stroke: "#8884d8", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { VersionComparisonChart };
