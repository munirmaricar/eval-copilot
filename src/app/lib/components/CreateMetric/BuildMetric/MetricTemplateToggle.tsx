import { Tooltip } from "@/app/lib/components/Tooltips/Tooltip";
import { SecondaryButtonToggle } from "@/app/lib/components/Buttons/SecondaryButtonToggle";
import classNames from "classnames";

function MetricTemplateToggle({
  template,
  index,
  width,
}: {
  template: {
    name: string;
    description: string;
    onClick: () => void;
    selected: boolean;
  };
  index: number;
  width: string;
}) {
  const tooltipHtml = `
  <p style="font-size: 14px;margin-bottom: 8px;">${template.name}</p>
  <p style="font-size: 12px;">${template.description}</p>
`;
  return (
    <Tooltip
      id={"template-description-" + template.name}
      html={tooltipHtml}
      width={208}
    >
      <SecondaryButtonToggle
        key={template.name}
        toggled={template.selected}
        onClick={template.onClick}
        className={classNames(width, {
          "ml-2": index !== 0,
        })}
      >
        {template.name}
      </SecondaryButtonToggle>
    </Tooltip>
  );
}

export { MetricTemplateToggle };
