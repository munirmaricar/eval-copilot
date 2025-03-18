import { ReactNode } from "react";
import classNames from "classnames";

const FixedWidthCell = ({
  children = null,
  className = "",
  width = "w-36",
}: {
  children?: ReactNode;
  className?: string;
  width?: string;
}) => {
  return <div className={classNames(width, className)}>{children}</div>;
};

export { FixedWidthCell };
