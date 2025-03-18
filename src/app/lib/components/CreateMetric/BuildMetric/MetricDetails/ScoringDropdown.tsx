import Select, { SingleValue, StylesConfig } from "react-select";
import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";

export interface Option {
  value: string;
  label: string;
}

const options: Option[] = [
  { value: "one-to-five", label: "Score of 1 - 5" },
  { value: "binary", label: "Binary 0 / 1" },
  { value: "float", label: "Float 0.0 - 1.0" },
];

const styles: StylesConfig<Option, false> = {
  container: (styles) => ({
    ...styles,
    flexGrow: 1,
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#262626",
    fontSize: 12,
    fontWeight: 500,
  }),
  menu: (styles) => ({
    ...styles,
    color: "#262626",
    fontSize: 12,
    fontWeight: 500,
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#262626",
    opacity: 0.7,
    fontSize: 12,
    fontWeight: 500,
  }),
};

const ScoringDropdown = ({
  value,
  onChange,
}: {
  value: Option["value"] | null;
  onChange: (newValue: string) => void;
}) => {
  const handleChange = (newValue: SingleValue<Option>) =>
    onChange(newValue!.value);

  return (
    <Select
      value={options.find((option) => option.value === value)}
      onChange={handleChange}
      options={options}
      placeholder="Select an option"
      styles={styles}
      menuPlacement="top"
    />
  );
};

export { ScoringDropdown };
