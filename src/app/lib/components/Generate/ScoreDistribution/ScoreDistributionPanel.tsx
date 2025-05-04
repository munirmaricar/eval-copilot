import { useState } from "react";
import { TestCase } from "@/app/lib/types";
import Image from "next/image";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { useVersionHistory } from "@/app/lib/hooks/useVersionHistory";
import { ScoreDistributionModal } from "./ScoreDistributionModal";

type ScoreDistributionPanelProps = {
  testCases: TestCase[];
  scoringCriteria: string;
  promptVersions: { id: string; version: number }[] | null;
  currentPromptId: string | undefined;
};

const ScoreDistributionPanel = ({
  testCases,
  scoringCriteria,
  promptVersions,
  currentPromptId,
}: ScoreDistributionPanelProps) => {
  const [showModal, setShowModal] = useState(false);
  const { versionHistoryData, loading } = useVersionHistory({
    promptVersions,
    currentPromptId,
    currentTestCases: testCases,
  });

  const totalTestCases = testCases.length;

  const perfectMatches = testCases.filter(
    (tc) =>
      tc.expectedScore !== null &&
      tc.atlaScore !== null &&
      tc.expectedScore === tc.atlaScore
  ).length;

  const perfectMatchesPercent =
    totalTestCases > 0
      ? Math.round((perfectMatches / totalTestCases) * 100)
      : 0;

  // Find improvement trend compared to previous version
  let improvementText = "";
  if (versionHistoryData.length > 1 && !loading) {
    const currentVersionData = versionHistoryData.find(
      (v) => v.id === currentPromptId
    );
    const sortedVersions = [...versionHistoryData].sort(
      (a, b) => b.version - a.version
    );
    const currentIndex = sortedVersions.findIndex(
      (v) => v.id === currentPromptId
    );

    if (currentIndex > 0 && currentIndex < sortedVersions.length) {
      const previousVersion = sortedVersions[currentIndex - 1];
      const currentAlignment = currentVersionData?.alignmentScore || 0;
      const previousAlignment = previousVersion.alignmentScore;

      const difference = (currentAlignment - previousAlignment) * 100;

      if (Math.abs(difference) >= 1) {
        improvementText =
          difference > 0
            ? `+${Math.round(difference)}% vs v${previousVersion.version}`
            : `${Math.round(difference)}% vs v${previousVersion.version}`;
      }
    }
  }

  return (
    <div className="flex items-center">
      <div className="bg-gray-50 px-3 py-2 rounded-md mr-2 flex items-center">
        <Image
          src="/chart-icon.svg"
          alt="Score distribution"
          width="16"
          height="16"
          className="mr-2"
        />
        <div className="text-sm">
          <span className="font-semibold text-text-secondary">
            {perfectMatchesPercent}%
          </span>
          <span className="text-text-primary ml-1">perfect match</span>
          {improvementText && (
            <span
              className={`ml-2 font-medium ${improvementText.startsWith("+") ? "text-green-500" : "text-red-500"}`}
            >
              {improvementText}
            </span>
          )}
        </div>
      </div>

      <SecondaryButton onClick={() => setShowModal(true)} className="text-sm">
        View score distribution
      </SecondaryButton>

      {showModal && (
        <ScoreDistributionModal
          onClose={() => setShowModal(false)}
          testCases={testCases}
          scoringCriteria={scoringCriteria}
          promptVersions={promptVersions}
          currentPromptId={currentPromptId}
        />
      )}
    </div>
  );
};

export { ScoreDistributionPanel };
