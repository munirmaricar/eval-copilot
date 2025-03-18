import { ReactNode } from "react";
import classNames from "classnames";

const SecondaryButtonToggle = ({
  children,
  toggled,
  className = "",
  onClick,
}: {
  children: ReactNode;
  toggled: boolean;
  className?: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={classNames(
      "btn btn-primary border border-text-secondary py-1.5 px-2 rounded-xl inter-500 text-xs flex items-center justify-center",
      className,
      {
        "bg-text-secondary text-white": toggled,
        "bg-white  text-text-secondary": !toggled,
      },
    )}
  >
    {children}
  </button>
);

export { SecondaryButtonToggle };
