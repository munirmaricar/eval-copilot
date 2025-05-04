import { ReactNode } from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { Tooltip } from "@/app/lib/components/Tooltips/Tooltip";

const SecondaryButton = ({
  children,
  className = "",
  onClick,
  disabled = false,
  disabledTooltip,
}: {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  disabledTooltip?: string;
}) => (
  <Tooltip
    id={disabledTooltip || ""}
    html={disabledTooltip || ""}
    hidden={disabledTooltip === undefined || !disabled}
  >
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        twMerge(
          "btn btn-primary bg-white border py-3 px-4 rounded-full inter-600 text-sm flex items-center justify-center relative",
          className,
        ),
        {
          "cursor-not-allowed text-text-disabled border-text-disabled":
            disabled,
          "border-text-secondary text-text-secondary": !disabled,
        },
      )}
    >
      {children}
    </button>
  </Tooltip>
);

export { SecondaryButton };
