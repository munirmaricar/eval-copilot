import Select, { SingleValue, StylesConfig } from "react-select";
import { MetricResponse } from "@/app/lib/api/metrics/get";

interface Option {
  value: string;
  label: string;
}

const styles: StylesConfig<Option, false> = {
  control: (styles) => ({
    ...styles,
    width: 100,
    height: 30,
    borderRadius: 8,
    borderColor: "#EBE9F1",
  }),
  singleValue: (styles) => ({
    ...styles,
    textAlign: "center",
    color: "#262626",
    fontSize: 14,
    fontWeight: 600,
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    height: "100%",
    margin: 0,
    backgroundColor: "#EBE9F1",
  }),
  menu: (styles) => ({
    ...styles,
    width: 78,
    marginTop: 5,
  }),
};

const VersionDropdown = ({
  selectedPrompt,
  onChange,
  prompts,
  className = "",
}: {
  selectedPrompt: MetricResponse["prompts"][number] | null;
  onChange: (newValue: SingleValue<Option>) => void;
  prompts: MetricResponse["prompts"] | null;
  className?: string;
}) => {
  if (!prompts) {
    return null;
  }

  const options = prompts
    .map((prompt) => ({
      value: prompt.id,
      label: `v${prompt.version}`,
    }))
    .reverse();

  if (!selectedPrompt) {
    return null;
  }

  return (
    <Select
      value={{ value: selectedPrompt.id, label: `v${selectedPrompt.version}` }}
      onChange={onChange}
      options={options}
      styles={styles}
      className={className}
    />
  );
};

export { VersionDropdown };
