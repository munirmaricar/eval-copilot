function FloatInput({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  max: number;
  min: number;
  step: number;
}) {
  const handleChange = (value: string) => {
    if (value === "") {
      onChange(null);
      return;
    }
    const newValue = parseFloat(value);
    onChange(parseFloat(Math.max(min, Math.min(max, newValue)).toFixed(2)));
  };

  return (
    <input
      type="number"
      value={value === null ? "" : value}
      onChange={(e) => handleChange(e.target.value)}
      className="inter-400 text-sm text-text-secondary p-4 border border-border-primary rounded-2xl w-24 placeholder:text-text-secondary placeholder:text-sm placeholder:inter-400"
      min={min}
      max={max}
      step={step}
      placeholder="-"
    />
  );
}

export { FloatInput };
