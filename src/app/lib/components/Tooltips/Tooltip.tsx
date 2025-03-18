import { Tooltip as TT, ITooltip } from "react-tooltip";

function Tooltip({
  children,
  id,
  html,
  place = "top",
  hidden = false,
  width,
  containerClassName,
}: {
  children: React.ReactNode;
  id: string;
  html: string;
  place?: ITooltip["place"];
  hidden?: boolean;
  width?: number;
  containerClassName?: string;
}) {
  if (hidden) {
    return children;
  }

  return (
    <>
      <TT
        id={id}
        style={{
          borderRadius: "8px",
          backgroundColor: "#262626",
          padding: "8px",
          fontSize: "12px",
          ...(width ? { width: `${width}px` } : {}),
          zIndex: 100,
        }}
        opacity={1}
      />
      <div
        className={containerClassName}
        data-tooltip-id={id}
        data-tooltip-html={html}
        data-tooltip-place={place}
      >
        {children}
      </div>
    </>
  );
}

export { Tooltip };
