import Image from "next/image";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { getAtlaAPICode } from "@/app/lib/components/CodeModal/getAtlaAPICode";
import { useOnClickOutside } from "@/app/lib/hooks/useOnClickOutside";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeModal({
  inputVariables,
  metricName,
  onClose,
}: {
  inputVariables: string[] | undefined;
  metricName: string | undefined;
  onClose: () => void;
}) {
  const containerRef = useRef(null);

  useOnClickOutside(containerRef, onClose);

  if (inputVariables === undefined || metricName === undefined) {
    return null;
  }

  const atlaAPICode = getAtlaAPICode({
    inputVariables,
    metricName,
  });
  return (
    <div className="absolute w-full h-full [backdrop-filter:blur(3px)] top-0 flex flex-col items-center justify-center z-50">
      <div
        ref={containerRef}
        className="bg-white w-2/3 shadow-lg rounded-xl p-6 border border-border-primary"
      >
        <div className="relative mb-1">
          <h2 className="inter-600 text-text-secondary text-lg">
            Code for Atla API
          </h2>
          <button onClick={onClose} className="absolute top-0 right-0 z-20">
            <Image
              src="/close-icon-grey.svg"
              alt="Close prompt modal"
              width="24"
              height="24"
            />
          </button>
        </div>
        <div className="flex justify-between mb-4">
          <p className="text-sm inter-500 text-text-secondary">
            Use this example to start running evaluations with your new metric
          </p>
          <div className="flex">
            <SecondaryButton
              onClick={() =>
                window.open(
                  "https://docs.atla-ai.com/introduction",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="mr-3"
            >
              <Image
                src="/arrow-up-right-icon-black.svg"
                alt="Open Atla Docs"
                width="16"
                height="16"
                className="mr-2"
              />
              Docs
            </SecondaryButton>
            <SecondaryButton
              onClick={() => {
                navigator.clipboard.writeText(atlaAPICode);
                toast("Code copied to clipboard", {
                  theme: "dark",
                  position: "top-center",
                  hideProgressBar: true,
                  autoClose: 2000,
                  style: { width: "fit-content" },
                  closeButton: false,
                  pauseOnHover: false,
                  pauseOnFocusLoss: false,
                });
              }}
            >
              <Image
                src="/copy-icon-black.svg"
                alt="Copy code to clipboard"
                width="16"
                height="16"
                className="mr-2"
              />
              Copy
            </SecondaryButton>
          </div>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          wrapLongLines
          customStyle={{
            fontSize: "12px",
            borderRadius: "16px",
            padding: "10px",
          }}
          language="python"
        >
          {atlaAPICode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export { CodeModal };
