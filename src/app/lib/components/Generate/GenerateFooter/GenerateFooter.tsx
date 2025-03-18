import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import Image from "next/image";
import { TestCaseCollectionsButton } from "@/app/lib/components/Generate/GenerateFooter/TestCaseCollections/TestCaseCollectionsButton";
import { useContext } from "react";
import {
  GenerateClickThroughContext,
  GenerateClickThroughStepID,
} from "@/app/lib/components/Generate/GenerateClickThrough/GenerateClickThroughContext";
import classNames from "classnames";

function GenerateFooter({
  onAddTestCase,
  setCollectionsModalPage,
  setShowPrompt,
}: {
  onAddTestCase: () => void;
  setCollectionsModalPage: (page: string | null) => void;
  setShowPrompt: (value: boolean) => void;
}) {
  const { isStep } = useContext(GenerateClickThroughContext);
  const isFirstClickThroughStep = isStep(GenerateClickThroughStepID.STEP_1);

  return (
    <div className="flex items-start mt-6 px-6">
      <div
        className={classNames("flex bg-white", {
          "z-50 rounded-lg shadow-[0_0_0_10px_white]": isFirstClickThroughStep,
        })}
      >
        <SecondaryButton onClick={onAddTestCase} className="mr-4">
          <Image
            src={"/plus-icon-black.svg"}
            alt="Add examples"
            width="20"
            height="20"
            className="pr-1"
          />
          Add another test case
        </SecondaryButton>
        <TestCaseCollectionsButton
          setShowPrompt={setShowPrompt}
          setCollectionsModalPage={setCollectionsModalPage}
        />
      </div>
    </div>
  );
}

export { GenerateFooter };
