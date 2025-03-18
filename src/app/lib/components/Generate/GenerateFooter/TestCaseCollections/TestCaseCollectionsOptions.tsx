import { useRef } from "react";
import { useOnClickOutside } from "@/app/lib/hooks/useOnClickOutside";

function TestCaseCollectionsOptions({
  onSelect,
  onClose,
}: {
  onSelect: (option: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, onClose);

  const options = [
    { value: "load-collection", text: "Load test set" },
    { value: "create-collection", text: "Save as new test set" },
    { value: "update-collection", text: "Update test set" },
  ];
  return (
    <div
      ref={ref}
      className="absolute bottom-14 bg-white border border-border-primary rounded w-full py-2"
    >
      {options.map((option) => (
        <button
          key={option.value}
          className="inter-400 text-xs text-text-secondary flex px-2 py-1 hover:bg-gray w-full"
          onClick={() => onSelect(option.value)}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
}

export { TestCaseCollectionsOptions };
