import { MetricExample } from "@/app/metric/create/useMetricData";
import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Slider } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { BinaryToggle } from "@/app/lib/components/CreateMetric/AddExamples/Example/BinaryToggle";

const ExampleField = ({
  title,
  propertyKey,
  value,
  onExampleChange,
  example,
  placeholder,
}: {
  title: string;
  propertyKey: string;
  value: string | null | undefined;
  onExampleChange: (example: MetricExample) => void;
  example: MetricExample;
  placeholder: string;
}) => {
  return (
    <>
      <p className="inter-500 text-xs text-text-secondary opacity-70 mb-2">
        {title}
      </p>
      <textarea
        placeholder={placeholder}
        value={value || ""}
        className="border border-border-primary w-full rounded inter-400 text-text-secondary text-xs py-1.5 px-2 resize-none mb-4 flex-grow min-h-14"
        onChange={(event) => {
          onExampleChange({
            ...example,
            [propertyKey]: event.target.value || null,
          });
        }}
      />
    </>
  );
};

function Example({
  index,
  example,
  inputVariables,
  scoringRuberic,
  onExampleChange,
  removeExample,
  isOnlyExample,
  resetExample,
}: {
  example: MetricExample;
  inputVariables: InputVariablesMultiSelectOption[];
  scoringRuberic: string | null;
  index: number;
  onExampleChange: (example: MetricExample) => void;
  removeExample: () => void;
  isOnlyExample: boolean;
  resetExample: () => void;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const variables = inputVariables.map((variable) => variable.value);

  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const isEmpty =
    !example.input &&
    !example.context &&
    !example.reference &&
    !example.response &&
    !example.critique;
  const deleteDisabled = isOnlyExample && isEmpty;

  const handleDelete = () => {
    if (isOnlyExample) {
      resetExample();
      return;
    }

    removeExample();
  };

  return (
    <div
      ref={elementRef}
      className={classNames(
        "bg-gray rounded-2xl p-5 mt-6 flex flex-col relative min-h-0",
      )}
    >
      <button onClick={() => setOpen(!open)}>
        <Image
          src="/chevron-down-icon-black.svg"
          alt="Close metric builder"
          width="20"
          height="20"
          className={classNames("absolute top-5 right-6 transition-transform", {
            "transform rotate-180": open,
          })}
        />
      </button>
      <h2
        className={classNames("inter-600 text-text-secondary text-sm", {
          "mb-6": open,
        })}
      >{`Example #${index + 1}`}</h2>
      {open && (
        <>
          <ExampleField
            title={"Input"}
            propertyKey={"input"}
            placeholder={"What your AI receives as an input..."}
            value={example.input}
            onExampleChange={onExampleChange}
            example={example}
          />
          {variables.includes("context") && (
            <ExampleField
              title={"Context (optional)"}
              propertyKey={"context"}
              placeholder={"The context retrieved and passed to your AI..."}
              value={example.context}
              onExampleChange={onExampleChange}
              example={example}
            />
          )}
          {variables.includes("reference") && (
            <ExampleField
              title={"Ground truth response (optional)"}
              propertyKey={"reference"}
              placeholder={"A 'ground-truth' or gold-standard answer..."}
              value={example.reference}
              onExampleChange={onExampleChange}
              example={example}
            />
          )}
          <ExampleField
            title={"Response"}
            propertyKey={"response"}
            placeholder={"Your AI's response..."}
            value={example.response}
            onExampleChange={onExampleChange}
            example={example}
          />
          {scoringRuberic === "one-to-five" && (
            <>
              <div className="mb-2 flex items-center justify-between ">
                <p className="inter-500 text-xs text-text-secondary">Score</p>
                <p className="inter-500 text-xs text-text-secondary opacity-70">
                  {example.score} / 5
                </p>
              </div>
              <Slider
                min={1}
                max={5}
                value={example.score || 0}
                onChange={(value) => {
                  onExampleChange({ ...example, score: value });
                }}
                className="mt-1 mb-6"
                barClassName="!bg-border-primary"
                handleClassName="before:!bg-info-primary before:!border-white before:!w-4 before:!h-4"
                handleStyle={{ top: "-80%" }}
                tooltip={false}
                progress
              />
            </>
          )}
          {scoringRuberic === "float" && (
            <>
              <div className="mb-2 flex items-center justify-between ">
                <p className="inter-500 text-xs text-text-secondary">Score</p>
                <p className="inter-500 text-xs text-text-secondary opacity-70">
                  {example.score}
                </p>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={example.score || 0}
                onChange={(value) => {
                  onExampleChange({ ...example, score: value });
                }}
                className="mt-1 mb-6"
                barClassName="!bg-border-primary"
                handleClassName="before:!bg-info-primary before:!border-white before:!w-4 before:!h-4"
                handleStyle={{ top: "-80%" }}
                tooltip={false}
                progress
              />
            </>
          )}
          {scoringRuberic === "binary" && (
            <>
              <div className="mb-2 flex items-center justify-between ">
                <p className="inter-500 text-xs text-text-secondary">Score</p>
              </div>
              <div className="flex">
                <BinaryToggle
                  className="mb-4"
                  value={example.score || 0}
                  onChange={(value) =>
                    onExampleChange({ ...example, score: value })
                  }
                />
              </div>
            </>
          )}
          <ExampleField
            title={"Critique (optional)"}
            propertyKey={"critique"}
            placeholder={"Brief reasoning for your score..."}
            value={example.critique}
            onExampleChange={onExampleChange}
            example={example}
          />
          <div className="flex items-end justify-end mt-4">
            <button onClick={handleDelete} disabled={deleteDisabled}>
              <Image
                src={
                  deleteDisabled
                    ? "/delete-icon-disabled.svg"
                    : "/delete-icon-red.svg"
                }
                alt="Close metric builder"
                width="18"
                height="18"
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export { Example };
