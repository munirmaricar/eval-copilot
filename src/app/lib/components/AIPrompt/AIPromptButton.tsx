import { AIPrompt } from "@/app/lib/components/AIPrompt/AIPrompt";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import Image from "next/image";
import { useState } from "react";

function AIPromptButton({
  options,
  onSubmit,
  text,
  disabled,
  buttonClasses = "",
  promptPlaceholder,
}: {
  options: { text: string; value: string }[];
  onSubmit: (prompt: string) => void;
  text: string;
  disabled: boolean;
  buttonClasses?: string;
  promptPlaceholder: string;
}) {
  const [showAIPrompt, setShowAIPrompt] = useState(false);

  const buttonDisabled = showAIPrompt || disabled;

  return (
    <div className="relative overflow-visible">
      {showAIPrompt && (
        <AIPrompt
          onClose={() => setShowAIPrompt(false)}
          onSubmit={onSubmit}
          options={options}
          placeholder={promptPlaceholder}
        />
      )}
      <SecondaryButton
        disabled={buttonDisabled}
        onClick={() => setShowAIPrompt(true)}
        className={buttonClasses}
      >
        <Image
          src={
            buttonDisabled
              ? "/sparkle-icon-disabled.svg"
              : "/sparkle-icon-black.svg"
          }
          alt={text}
          width="20"
          height="20"
          className="pr-1"
        />
        {text}
      </SecondaryButton>
    </div>
  );
}

export { AIPromptButton };
