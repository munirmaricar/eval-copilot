import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import { capitalizeFirstLetter } from "@/app/lib/utils/captiliseFirstLetter";

function inputVariableIdToOptions(
  inputVariables: string[],
): InputVariablesMultiSelectOption[] {
  return inputVariables.map((variable) => {
    return {
      value: variable,
      label: capitalizeFirstLetter(variable),
      isFixed: variable === "input" || variable === "response",
    };
  });
}

export { inputVariableIdToOptions };
