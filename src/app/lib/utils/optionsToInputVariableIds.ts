import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";

function optionsToInputVariableIds(
  options: InputVariablesMultiSelectOption[],
): string[] {
  return options.map((option) => option.value);
}

export { optionsToInputVariableIds };
