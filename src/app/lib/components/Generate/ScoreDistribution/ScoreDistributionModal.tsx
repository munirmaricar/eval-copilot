import { useState, useCallback } from "react";
import {
  ScoringCriteria,
  ScoreDistributionTab,
  VersionHistoryData,
  TestCase,
} from "@/app/lib/types";
import Image from "next/image";
import { ScoreDistributionChart } from "./ScoreDistributionChart";
import { getScoreDetails } from "./utils";
import classNames from "classnames";
import { VersionComparisonChart } from "./VersionComparisonChart";

type ScoreDistributionModalProps = {
  onClose: () => void;
  scoringCriteria: ScoringCriteria;
  versionHistory: VersionHistoryData[];
  versionHistoryLoading: boolean;
  testCases: TestCase[];
  currentPromptId: string | undefined;
};

const ScoreDistributionModal = ({
  onClose,
  scoringCriteria,
  versionHistory,
  versionHistoryLoading,
  testCases,
  currentPromptId,
}: ScoreDistributionModalProps) => {
  const [activeTab, setActiveTab] = useState<ScoreDistributionTab>(
    ScoreDistributionTab.Distribution,
  );

  const hasMultipleVersions = versionHistory.length > 1;
  const handleTabChange = useCallback((tab: ScoreDistributionTab) => {
    setActiveTab(tab);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case ScoreDistributionTab.Distribution:
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

      case ScoreDistributionTab.Comparison:
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

        if (versionHistoryLoading) {
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
              versionHistory={versionHistory}
              currentPromptId={currentPromptId}
            />
          </div>
        );

      case ScoreDistributionTab.Details:
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
                  {testCases.map((testCase) => {
                    const { text, color, backgroundColor } = getScoreDetails(
                      testCase.expectedScore,
                      testCase.atlaScore,
                      scoringCriteria,
                    );

                    return (
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
                            className={"px-2 py-1 rounded-full text-xs"}
                            style={{
                              color,
                              backgroundColor,
                            }}
                          >
                            {text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
              activeTab === ScoreDistributionTab.Distribution
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700",
            )}
            onClick={() => handleTabChange(ScoreDistributionTab.Distribution)}
          >
            Score Distribution
          </button>
          <button
            className={classNames(
              "px-4 py-2 text-sm font-medium",
              activeTab === ScoreDistributionTab.Comparison
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700",
            )}
            onClick={() => handleTabChange(ScoreDistributionTab.Comparison)}
          >
            Version Comparison
          </button>
          <button
            className={classNames(
              "px-4 py-2 text-sm font-medium",
              activeTab === ScoreDistributionTab.Details
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700",
            )}
            onClick={() => handleTabChange(ScoreDistributionTab.Details)}
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
