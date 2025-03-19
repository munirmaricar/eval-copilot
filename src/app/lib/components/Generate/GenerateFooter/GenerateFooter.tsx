import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import Image from "next/image";
import { TestCaseCollectionsButton } from "@/app/lib/components/Generate/GenerateFooter/TestCaseCollections/TestCaseCollectionsButton";
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
  return (
    <div className="flex items-start mt-6 px-6">
      <div className={classNames("flex bg-white")}>
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
