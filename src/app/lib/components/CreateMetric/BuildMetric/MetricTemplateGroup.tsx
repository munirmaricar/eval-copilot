import Image from "next/image";
import { SecondaryButtonToggle } from "@/app/lib/components/Buttons/SecondaryButtonToggle";
import classNames from "classnames";
import { Tooltip } from "@/app/lib/components/Tooltips/Tooltip";
import { MetricTemplateToggle } from "@/app/lib/components/CreateMetric/BuildMetric/MetricTemplateToggle";

const MetricTemplateGroup = ({
  templates,
  width,
}: {
  width: string;
  templates: {
    name: string;
    description: string;
    onClick: () => void;
    selected: boolean;
  }[];
}) => {
  return (
    <div className="flex flex-col mb-1.5">
      <div className="flex">
        {templates.map((template, index) => (
          <MetricTemplateToggle
            key={template.name}
            template={template}
            index={index}
            width={width}
          />
        ))}
      </div>
    </div>
  );
};

export { MetricTemplateGroup };
