import { ReactNode } from "react";
import classNames from "classnames";

const Button = ({
  children,
  onClick,
  selected,
}: {
  children: ReactNode;
  onClick: () => void;
  selected: boolean;
}) => {
  const classes = classNames(
    "inter-400 text-xs w-20 h-6 rounded",
    selected ? "text-white bg-text-secondary" : "text-text-secondary bg-white",
  );
  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

function BinaryToggle({
  value,
  onChange,
  className,
  allowNoValue = false,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  className?: string;
  allowNoValue?: boolean;
}) {
  const onClick = ({ newValue }: { newValue: number }) => {
    if (allowNoValue && value === newValue) {
      onChange(null);
      return;
    }
    onChange(newValue);
  };

  return (
    <div
      className={classNames(
        "bg-white p-0.5 flex items-center rounded",
        className,
      )}
    >
      <Button selected={value === 1} onClick={() => onClick({ newValue: 1 })}>
        1
      </Button>
      <div className="border-l border-border-primary h-4" />
      <Button selected={value === 0} onClick={() => onClick({ newValue: 0 })}>
        0
      </Button>
    </div>
  );
}

export { BinaryToggle };
