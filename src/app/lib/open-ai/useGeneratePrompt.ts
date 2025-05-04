import { useEffect } from "react";
import { useCompletion } from "ai/react";

function useGeneratePrompt({
  inputVariables,
  criteria,
  scoringRuberic,
  onChange,
  skip,
}: {
  inputVariables: string[];
  criteria: string;
  scoringRuberic: string;
  onChange: (prompt: string) => void;
  skip: boolean;
}) {
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/generate-prompt",
    body: {
      inputVariables,
      criteria,
      scoringRuberic,
    },
  });

  useEffect(() => {
    if (skip) {
      return;
    }
    if (!completion) {
      complete("");
    }
  }, [skip, completion, complete]);

  useEffect(() => {
    if (skip) {
      return;
    }
    onChange(completion);
  }, [completion, skip, onChange]);

  return { isLoading };
}

export { useGeneratePrompt };
