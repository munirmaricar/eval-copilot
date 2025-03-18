import Select, { SingleValue, StylesConfig } from "react-select";

interface Option {
  value: number | null;
  label: string;
}

const options: Option[] = [
  { value: null, label: "-" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];

const styles: StylesConfig<Option, false> = {
  control: (styles) => ({
    ...styles,
    width: 78,
    height: 42,
    borderRadius: 20,
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
  placeholder: (styles) => ({
    ...styles,
    color: "#262626",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  }),
};

const OneToFiveDropdown = ({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (newValue: number | null) => void;
}) => {
  const handleChange = (newValue: SingleValue<Option>) => {
    onChange(newValue?.value!);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Select
      value={selectedOption}
      placeholder="-"
      onChange={handleChange}
      options={options}
      styles={styles}
    />
  );
};

export { OneToFiveDropdown };
