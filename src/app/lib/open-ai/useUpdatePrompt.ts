import { useEffect, useState } from "react";
import { useCompletion } from "ai/react";

function useUpdatePrompt({
  onChange,
  template,
}: {
  template: string | null;
  onChange: (newTemplate: string) => void;
}) {
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/update-prompt",
    body: {
      template,
    },
  });

  const updatePrompt = (prompt: string) => {
    complete(prompt);
  };

  useEffect(() => {
    if (!completion) {
      return;
    }

    onChange(completion);
  }, [completion, onChange]);

  return { updatePrompt, isLoading };
}

export { useUpdatePrompt };
