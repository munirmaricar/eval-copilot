import { useRef, useState } from "react";
import Image from "next/image";
import { useOnClickOutside } from "@/app/lib/hooks/useOnClickOutside";

function AIPrompt({
  onClose,
  onSubmit,
  options,
  placeholder = "Describe changes here...",
}: {
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  options: { text: string; value: string }[];
  placeholder?: string;
}) {
  const [value, setValue] = useState<null | string>(null);

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, onClose);

  return (
    <div
      ref={ref}
      className="flex flex-col h-36 fixed border border-border-primary rounded bottom-14 w-full bg-white z-[9999]"
    >
      <div className="flex-grow min-h-0 overflow-auto flex flex-col items-stretch pt-2 border-b border-border-primary">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onSubmit(option.value);
              onClose();
            }}
            className="inter-400 text-xs text-text-secondary flex px-2 py-1 hover:bg-gray"
          >
            {option.text}
          </button>
        ))}
      </div>
      <div className="flex">
        <input
          className="placeholder-text-secondary placeholder-opacity-70 text-xs p-2 flex-grow italic"
          value={value || ""}
          onChange={(event) => setValue(event.target.value || null)}
          type="text"
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Enter" && value) {
              onSubmit(value);
              onClose();
            }
          }}
        />
        <button
          onClick={() => {
            if (value) {
              onSubmit(value);
            }
          }}
          disabled={value === null}
          className="ml-2"
        >
          <Image
            src={
              value === null
                ? "/check-icon-disabled.svg"
                : "/check-icon-black.svg"
            }
            alt="Run AI prompt edit"
            width="15"
            height="15"
          />
        </button>
        <button className="mx-2" onClick={onClose}>
          <Image
            src="/cross-icon-black.svg"
            alt="Close AI prompt edit"
            width="15"
            height="15"
          />
        </button>
      </div>
    </div>
  );
}

export { AIPrompt };
