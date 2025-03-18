import { ReactNode } from "react";
import classNames from "classnames";

const GrayButton = ({
  children,
  className = "",
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  const classes = classNames(
    `btn btn-primary bg-gray border border-border-primary py-3 px-4 rounded-3xl inter-600 text-sm flex items-center justify-center ${className}`,
    { "text-text-disabled": disabled, "text-text-secondary": !disabled },
  );

  return (
    <button disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

export { GrayButton };
