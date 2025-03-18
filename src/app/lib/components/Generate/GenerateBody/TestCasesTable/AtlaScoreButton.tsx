import classNames from "classnames";
import Image from "next/image";

function AtlaScoreButton({
  score,
  colour,
  onClick,
  disabled,
}: {
  score: number;
  colour: "red" | "amber" | "green" | "none";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={["green", "none"].includes(colour) || disabled}
      className={classNames(
        "py-3 px-4 border inter-500 text-sm rounded-2xl flex items-center justify-between",
        {
          "border-error-primary bg-error-primary-20 text-error-primary-80":
            colour === "red",
          "border-warning-primary bg-warning-primary-20 text-warning-primary-50":
            colour === "amber",
          "border-success-primary bg-success-primary-0 text-success-primary px-5":
            colour === "green",
          "border-border-primary bg-white text-text-secondary px-5":
            colour === "none",
        },
      )}
    >
      {score}
      {colour === "red" && (
        <Image
          src={"/info-icon-error.svg"}
          alt="Info on score"
          width="18"
          height="18"
          className="ml-3"
        />
      )}
      {colour === "amber" && (
        <Image
          src={"/icon-info-warning.svg"}
          alt="Info on score"
          width="18"
          height="18"
          className="ml-3"
        />
      )}
    </button>
  );
}

export { AtlaScoreButton };
