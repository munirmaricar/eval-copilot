import Markdown from "react-markdown";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/app/lib/hooks/useOnClickOutside";

function Prompt({
  template,
  onChange,
  disabled,
  templateChanged,
  allowEdit,
}: {
  template: string | null;
  onChange: (value: string) => void;
  disabled: boolean;
  templateChanged: boolean;
  allowEdit: boolean;
}) {
  const [promptFocused, setPromptFocused] = useState<boolean>(false);

  const showTextArea = (promptFocused || templateChanged) && allowEdit;

  const textAreaRef = useRef(null);

  useOnClickOutside(textAreaRef, () => setPromptFocused(false));

  return (
    <div className="flex-grow flex flex-col mb-4 min-h-0">
      <p className="inter-500 text-xs text-text-secondary opacity-70 mb-2">
        Prompt
      </p>
      {showTextArea ? (
        <textarea
          ref={textAreaRef}
          value={template || ""}
          onChange={(event) => onChange(event.target.value)}
          className="border border-border-primary flex-grow rounded min-h-0 overflow-auto inter-400 text-black text-xs p-4 resize-none disabled:bg-white"
          disabled={disabled}
          autoFocus
        />
      ) : (
        <div
          className="cursor-text flex flex-grow min-h-0"
          onClick={() => setPromptFocused(true)}
        >
          <Markdown className={"markdown"}>{template}</Markdown>
        </div>
      )}
    </div>
  );
}

export { Prompt };
