import Image from "next/image";
import { TertiaryButton } from "../Buttons/TertiaryButton";
import { useRouter } from "next/navigation";

const BlankSlate = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <Image
        src="/right-arrow.svg"
        alt="Right Arrow Image"
        width="168"
        height="64"
        className="mb-10"
      />
      <p className="mb-10 inter-600 opacity-70 text-sm text-text-secondary">
        Select a prompt to view its details
      </p>
      <TertiaryButton onClick={() => router.push("/metric/create")}>
        <Image
          src="/plus-icon-black.svg"
          alt="Generate new eval prompt"
          width="20"
          height="20"
          className="pr-1"
        />
        Generate new eval prompt
      </TertiaryButton>
    </div>
  );
};

export { BlankSlate };
