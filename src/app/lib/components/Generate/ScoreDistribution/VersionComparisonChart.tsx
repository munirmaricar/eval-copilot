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
import { ScoringCriteria, TestCase } from "@/app/lib/types";
import { calculateAlignmentScore, getThreshold } from "./utils";
import { useMemo } from "react";

type VersionData = {
  id: string;
  version: number;
  testCases?: TestCase[];
  alignment?: number;
};

type VersionComparisonChartProps = {
  promptVersions: VersionData[];
  currentPromptId: string | undefined;
  scoringCriteria: ScoringCriteria;
};

const VersionComparisonChart = ({
  promptVersions,
  currentPromptId,
  scoringCriteria,
}: VersionComparisonChartProps) => {
  const threshold = useMemo(
    () => getThreshold(scoringCriteria),
    [scoringCriteria],
  );
  const chartData = useMemo(
    () =>
      promptVersions
        .filter((version) => version.testCases && version.testCases.length > 0)
        .map((version) => ({
          version: version.version,
          alignment: calculateAlignmentScore(version.testCases, threshold),
          current: version.id === currentPromptId,
        }))
        .sort((a, b) => a.version - b.version),
    [currentPromptId, promptVersions, threshold],
  );

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
