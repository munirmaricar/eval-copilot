import { useMemo, useState } from "react";
import { PromptVersion, ScoringCriteria } from "@/app/lib/types";
import Image from "next/image";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { useVersionHistory } from "@/app/lib/hooks/useVersionHistory";
import { ScoreDistributionModal } from "./ScoreDistributionModal";

type ScoreDistributionPanelProps = {
  promptVersions: PromptVersion[] | null;
  metricId: string | undefined;
  currentPromptId: string | undefined;
  scoringCriteria: ScoringCriteria | undefined;
};

const ScoreDistributionPanel = ({
  promptVersions,
  metricId,
  currentPromptId,
  scoringCriteria = ScoringCriteria.OneToFive,
}: ScoreDistributionPanelProps) => {
  const [showModal, setShowModal] = useState(false);
  const { versionHistoryData, testCases, loading } = useVersionHistory({
    promptVersions,
    metricId,
    scoringCriteria,
  });

  const testCasesWithScores = testCases.filter(
    (tc) => tc.expected_score !== null && tc.atla_score !== null,
  ).length;

  const alignmentScore = useMemo(() => {
    if (loading || !versionHistoryData || versionHistoryData.length === 0)
      return -1;

    const currentVersionData = versionHistoryData.find(
      (v) => v.prompt.id === currentPromptId,
    );

    if (!currentVersionData || !currentVersionData.alignmentScore) return -1;

    return Math.round(currentVersionData.alignmentScore * 100);
  }, [versionHistoryData, currentPromptId, loading]);

  const improvementText = useMemo(() => {
    if (loading || !versionHistoryData || versionHistoryData.length < 2)
      return "";

    const currentVersionData = versionHistoryData.find(
      (v) => v.prompt.id === currentPromptId,
    );

    if (!currentVersionData || !currentVersionData.alignmentScore) return "";

    const sortedVersions = [...versionHistoryData].sort(
      (a, b) => b.prompt.version - a.prompt.version,
    );

    const currentVersionIndex = sortedVersions.findIndex(
      (v) => v.prompt.id === currentPromptId,
    );

    if (
      currentVersionIndex === -1 ||
      currentVersionIndex === sortedVersions.length - 1
    )
      return "";

    const previousVersion = sortedVersions[currentVersionIndex + 1];

    if (!previousVersion || !previousVersion.alignmentScore) return "";

    const currentAlignment = currentVersionData.alignmentScore;
    const previousAlignment = previousVersion.alignmentScore;

    const difference = Math.round(
      Math.abs((currentAlignment - previousAlignment) * 100),
    );

    if (difference < 1) return "";

    return difference > 0
      ? `+${difference}% vs v${previousVersion.prompt.version}`
      : `${difference}% vs v${previousVersion.prompt.version}`;
  }, [versionHistoryData, currentPromptId, loading]);

  const scoreColor = useMemo(() => {
    if (alignmentScore === -1) {
      return { color: "gray" };
    } else if (alignmentScore < 50) {
      return { color: "#b91c1c" };
    } else if (alignmentScore === 100) {
      return { color: "#15803d" };
    } else {
      return { color: "#a16207" };
    }
  }, [alignmentScore]);

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
          {loading ? "Calculating..." : `${alignmentScore}% alignment score`}
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
          scoringCriteria={scoringCriteria}
          versionHistory={versionHistoryData}
          versionHistoryLoading={loading}
          testCases={testCases}
          currentPromptId={currentPromptId}
        />
      )}
    </div>
  );
};

export { ScoreDistributionPanel };
