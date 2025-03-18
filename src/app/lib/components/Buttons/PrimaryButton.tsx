import { ReactNode } from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { Tooltip } from "@/app/lib/components/Tooltips/Tooltip";
import { PlacesType } from "react-tooltip";

const PrimaryButton = ({
  children,
  disabled = false,
  onClick,
  className = "",
  fullWidth = true,
  disabledTooltip,
  disabledTooltipPosition = "top",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  fullWidth?: boolean;
  disabledTooltip?: string | null;
  disabledTooltipPosition?: PlacesType;
}) => (
  <Tooltip
    id={disabledTooltip || ""}
    html={disabledTooltip || ""}
    hidden={!disabledTooltip || !disabled}
    place={disabledTooltipPosition}
  >
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        classNames(
          "btn btn-primary py-3 px-6 rounded-full inter-600 text-sm flex items-center justify-center",
          className,
          {
            "cursor-not-allowed bg-background-disabled text-text-disabled":
              disabled,
            "bg-text-secondary text-white": !disabled,
            "w-full": fullWidth,
          },
        ),
      )}
    >
      {children}
    </button>
  </Tooltip>
);

export { PrimaryButton };
