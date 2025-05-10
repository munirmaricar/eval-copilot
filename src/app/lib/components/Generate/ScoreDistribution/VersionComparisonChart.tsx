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
import { VersionHistoryData } from "@/app/lib/types";
import { useMemo } from "react";

type VersionComparisonChartProps = {
  versionHistory: VersionHistoryData[];
  currentPromptId: string | undefined;
};

const VersionComparisonChart = ({
  versionHistory,
  currentPromptId,
}: VersionComparisonChartProps) => {
  const chartData = useMemo(
    () =>
      versionHistory
        .map((version) => ({
          version: version.prompt.version,
          alignment: version.alignmentScore,
          current: version.prompt.id === currentPromptId,
        }))
        .sort((a, b) => a.version - b.version),
    [currentPromptId, versionHistory],
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
