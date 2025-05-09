import { useState } from "react";
import { TestCase } from "@/app/lib/types";
import Image from "next/image";
import { ScoreDistributionChart } from "./ScoreDistributionChart";
import { getScoreColor, getScoreDifferenceDescription } from "./utils";
import classNames from "classnames";
import { VersionComparisonChart } from "./VersionComparisonChart";
import { useVersionHistory } from "@/app/lib/hooks/useVersionHistory";

type ScoreDistributionModalProps = {
  onClose: () => void;
  testCases: TestCase[];
  scoringCriteria: string;
  promptVersions: { id: string; version: number }[] | null;
  currentPromptId: string | undefined;
};

type TabType = "distribution" | "comparison" | "details";

const ScoreDistributionModal = ({
  onClose,
  testCases,
  scoringCriteria,
  promptVersions,
  currentPromptId,
}: ScoreDistributionModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("distribution");
  const { versionHistoryData, loading } = useVersionHistory({
    promptVersions,
    currentPromptId,
    currentTestCases: testCases,
  });

  const hasMultipleVersions = promptVersions && promptVersions.length > 1;

  const renderTabContent = () => {
    switch (activeTab) {
      case "distribution":
        return (
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Score Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">
              This chart shows the distribution of expected vs. Atla scores
              across all test cases.
            </p>
            <ScoreDistributionChart
              testCases={testCases}
              scoringCriteria={scoringCriteria}
            />
          </div>
        );
      case "comparison":
        if (!hasMultipleVersions) {
          return (
            <div className="p-4 text-center">
              <p>
                Only one prompt version is available. Create more versions to
                compare.
              </p>
            </div>
          );
        }

        if (loading) {
          return (
            <div className="p-4 text-center">
              <p>Loading version history data...</p>
            </div>
          );
        }

        return (
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Version Comparison</h3>
            <p className="text-sm text-gray-600 mb-4">
              This chart shows how score alignment changes across different
              prompt versions.
            </p>
            <VersionComparisonChart
              promptVersions={versionHistoryData.map((version) => ({
                id: version.id,
                version: version.version,
                alignment: version.alignmentScore,
                testCases: version.testCases,
              }))}
              currentPromptId={currentPromptId}
            />
          </div>
        );
      case "details":
        return (
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Test Case Details</h3>
            <p className="text-sm text-gray-600 mb-4">
              Detailed comparison of expected vs. Atla scores for each test
              case.
            </p>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Input
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atla
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testCases.map((testCase) => (
                    <tr key={testCase.id}>
                      <td className="px-4 py-2 text-sm text-gray-800 max-w-[200px] truncate">
                        {testCase.input ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {testCase.expectedScore ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {testCase.atlaScore ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={classNames(
                            "px-2 py-1 rounded-full text-xs",
                            getScoreColor(
                              testCase.expectedScore,
                              testCase.atlaScore,
                            ),
                          )}
                        >
                          {getScoreDifferenceDescription(
                            testCase.expectedScore,
                            testCase.atlaScore,
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg w-5/6 max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="text-xl font-bold">Score Analysis</h2>
          <button onClick={onClose} className="p-1">
            <Image
              src="/close-icon-black.svg"
              alt="Close"
              width="24"
              height="24"
            />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={classNames(
              "px-4 py-2 text-sm font-medium",
              activeTab === "distribution"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700",
            )}
            onClick={() => setActiveTab("distribution")}
          >
            Score Distribution
          </button>
          <button
            className={classNames(
              "px-4 py-2 text-sm font-medium",
              activeTab === "comparison"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700",
            )}
            onClick={() => setActiveTab("comparison")}
          >
            Version Comparison
          </button>
          <button
            className={classNames(
              "px-4 py-2 text-sm font-medium",
              activeTab === "details"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700",
            )}
            onClick={() => setActiveTab("details")}
          >
            Test Case Details
          </button>
        </div>

        <div className="flex-grow overflow-auto">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export { ScoreDistributionModal };
