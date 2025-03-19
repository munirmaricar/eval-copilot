import { VariableWidthCell } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/VariableWidthCell";
import { FixedWidthCell } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/FixedWidthCell";
import classNames from "classnames";

function TestCasesTableHeader({
  displayContext,
  displayReference,
}: {
  displayContext: boolean;
  displayReference: boolean;
}) {
  const sharedCellClasses =
    "bg-gray inter-400 text-xs text-text-secondary py-2 px-4 border-r border-border-primary";

  return (
    <div className="flex flex-grow">
      <VariableWidthCell
        className={classNames(sharedCellClasses + " rounded-tl-lg")}
      >
        <p>Input</p>
      </VariableWidthCell>
      {displayContext && (
        <VariableWidthCell className={classNames(sharedCellClasses)}>
          <p>Context</p>
        </VariableWidthCell>
      )}
      {displayReference && (
        <VariableWidthCell className={classNames(sharedCellClasses)}>
          <p>Ground truth response</p>
        </VariableWidthCell>
      )}
      <VariableWidthCell className={classNames(sharedCellClasses)}>
        <p>Response</p>
      </VariableWidthCell>
      <FixedWidthCell className={classNames(sharedCellClasses)}>
        <p>Expected Score</p>
      </FixedWidthCell>
      <FixedWidthCell
        className={classNames(sharedCellClasses, "flex justify-center")}
      >
        <p>Atla Score</p>
      </FixedWidthCell>
      <VariableWidthCell className={classNames(sharedCellClasses)}>
        <p>Atla Critique</p>
      </VariableWidthCell>
      <FixedWidthCell
        width="w-10"
        className={classNames(sharedCellClasses + " rounded-tr-lg border-none")}
      />
    </div>
  );
}

export { TestCasesTableHeader };
