import { ReactNode } from "react";
import classNames from "classnames";

const SecondaryButtonToggleLarge = ({
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
      "btn btn-primary border border-text-secondary py-3 px-4 rounded-xl inter-600 text-sm flex items-center justify-center",
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

export { SecondaryButtonToggleLarge };
