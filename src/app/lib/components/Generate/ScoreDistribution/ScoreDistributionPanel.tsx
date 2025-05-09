import { useMemo, useState } from "react";
import { ScoringCriteria, TestCase } from "@/app/lib/types";
import Image from "next/image";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { useVersionHistory } from "@/app/lib/hooks/useVersionHistory";
import { ScoreDistributionModal } from "./ScoreDistributionModal";

type ScoreDistributionPanelProps = {
  testCases: TestCase[];
  scoringCriteria: ScoringCriteria;
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
    scoringCriteria,
  });

  const testCasesWithScores = testCases.filter(
    (tc) => tc.expectedScore !== null && tc.atlaScore !== null,
  ).length;

  const perfectMatches = testCases.filter(
    (tc) =>
      tc.expectedScore !== null &&
      tc.atlaScore !== null &&
      tc.expectedScore === tc.atlaScore,
  ).length;

  const perfectMatchesPercent =
    testCasesWithScores > 0
      ? Math.round((perfectMatches / testCasesWithScores) * 100)
      : 0;

  const improvementText = useMemo(() => {
    if (loading || versionHistoryData.length === 0) return "";

    const currentVersionData = versionHistoryData.find(
      (v) => v.id === currentPromptId,
    );
    if (!currentVersionData) return "";

    const currentVersionNumber = currentVersionData.version;

    const previousVersions = versionHistoryData
      .filter((v) => v.version < currentVersionNumber)
      .sort((a, b) => b.version - a.version);

    if (previousVersions.length === 0) return "";

    const previousVersion = previousVersions[0];
    const currentAlignment = currentVersionData.alignmentScore || 0;
    const previousAlignment = previousVersion.alignmentScore || 0;

    const difference = Math.round((currentAlignment - previousAlignment) * 100);

    if (Math.abs(difference) < 1) return "";

    return difference > 0
      ? `+${difference}% vs v${previousVersion.version}`
      : `${difference}% vs v${previousVersion.version}`;
  }, [versionHistoryData, currentPromptId, loading]);

  const scoreColor = useMemo(() => {
    if (perfectMatchesPercent < 50) {
      return { color: "#b91c1c" };
    } else if (perfectMatchesPercent === 100) {
      return { color: "#15803d" };
    } else {
      return { color: "#a16207" };
    }
  }, [perfectMatchesPercent]);

  if (testCasesWithScores === 0) {
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
          <div className="text-sm text-gray-500">
            No scored test cases available
          </div>
        </div>
      </div>
    );
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
        <div className="text-sm" style={scoreColor}>
          <span className="font-semibold text-text-primary">
            {perfectMatchesPercent}%
          </span>
          <span className="text-text-primary ml-1" style={scoreColor}>
            perfect match
          </span>
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
