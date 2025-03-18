import Select, { ActionMeta, OnChangeValue, StylesConfig } from "react-select";

export interface InputVariablesMultiSelectOption {
  value: string;
  label: string;
  isFixed: boolean;
}

const options: InputVariablesMultiSelectOption[] = [
  { value: "input", label: "Input", isFixed: true },
  { value: "response", label: "Response", isFixed: true },
  { value: "context", label: "Context", isFixed: false },
  { value: "reference", label: "Ground truth response", isFixed: false },
];

const styles: StylesConfig<InputVariablesMultiSelectOption, true> = {
  multiValue: (base, state) => {
    return { ...base, backgroundColor: "#e4e4e4", borderRadius: 20 };
  },
  multiValueLabel: (base, state) => {
    return { ...base, color: "black", paddingRight: 6, fontSize: 12 };
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed
      ? { ...base, display: "none" }
      : { ...base, borderRadius: 20 };
  },
  menu: (styles) => ({
    ...styles,
    color: "#262626",
    fontSize: 12,
    fontWeight: 500,
  }),
};

const InputVariablesMultiSelect = ({
  value,
  onChange,
}: {
  value: InputVariablesMultiSelectOption[];
  onChange: (newValue: InputVariablesMultiSelectOption[]) => void;
}) => {
  const handleChange = (
    newValue: OnChangeValue<InputVariablesMultiSelectOption, true>,
    actionMeta: ActionMeta<InputVariablesMultiSelectOption>,
  ) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
    }
    onChange(newValue as InputVariablesMultiSelectOption[]);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      closeMenuOnSelect={false}
      isMulti
      options={options}
      isClearable={false}
      styles={styles}
      menuPlacement="top"
    />
  );
};

export { InputVariablesMultiSelect };
