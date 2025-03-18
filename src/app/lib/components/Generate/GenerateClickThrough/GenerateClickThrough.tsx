import { useContext } from "react";
import { GenerateClickThroughContext } from "@/app/lib/components/Generate/GenerateClickThrough/GenerateClickThroughContext";
import { GenerateClickThroughModal } from "@/app/lib/components/Generate/GenerateClickThrough/GenerateClickThroughModal/GenerateClickThroughModal";

function GenerateClickThrough() {
  const { showClickThrough } = useContext(GenerateClickThroughContext);
  return showClickThrough ? (
    <>
      <GenerateClickThroughModal />
      <div className="absolute w-full h-full top-0 left-0 bg-text-secondary opacity-50 z-40" />
    </>
  ) : null;
}

export { GenerateClickThrough };
