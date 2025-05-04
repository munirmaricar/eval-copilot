import { ReactNode } from "react";
import classNames from "classnames";

const VariableWidthCell = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={classNames("flex-1", className)}>{children}</div>;
};

export { VariableWidthCell };
