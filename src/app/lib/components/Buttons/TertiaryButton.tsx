import { ReactNode } from "react";

const TertiaryButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="btn btn-primary bg-white text-text-secondary py-3 px-6 inter-600 text-sm flex items-center justify-center"
  >
    {children}
  </button>
);

export { TertiaryButton };
