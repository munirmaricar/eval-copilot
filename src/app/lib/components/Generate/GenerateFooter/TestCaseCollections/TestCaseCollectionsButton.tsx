import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import Image from "next/image";
import { useState } from "react";
import { TestCaseCollectionsOptions } from "@/app/lib/components/Generate/GenerateFooter/TestCaseCollections/TestCaseCollectionsOptions";

function TestCaseCollectionsButton({
  setCollectionsModalPage,
  setShowPrompt,
}: {
  setCollectionsModalPage: (page: string | null) => void;
  setShowPrompt: (value: boolean) => void;
}) {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  return (
    <div className="relative">
      {showOptions && (
        <TestCaseCollectionsOptions
          onSelect={(option) => {
            setShowOptions(false);
            setShowPrompt(false);
            setCollectionsModalPage(option);
          }}
          onClose={() => setShowOptions(false)}
        />
      )}
      <SecondaryButton
        className="px-20"
        onClick={() => setShowOptions(true)}
        disabled={showOptions}
      >
        <Image
          src={
            showOptions
              ? "/library-books-icon-disabled.svg"
              : "/library-books-icon-black.svg"
          }
          alt="Open collections options"
          width="20"
          height="20"
          className="mr-2"
        />
        Test set library
      </SecondaryButton>
    </div>
  );
}

export { TestCaseCollectionsButton };
