import Image from "next/image";

export function GeneratedPromptHeader(props: {
    onClose: () => void;
    onBack: () => void;
}) {
    return (
        <div className="flex flex-col items-center">
            <button onClick={props.onClose}>
                <Image
                    src="/close-icon-grey.svg"
                    alt="Close metric builder"
                    width="24"
                    height="24"
                    className="absolute top-4 right-6"
                />
            </button>
            <button onClick={props.onBack}>
                <Image
                    src="/icon-arrow-left-black.svg"
                    alt="Back to build metric"
                    width="24"
                    height="24"
                    className="absolute top-4 left-6"
                />
            </button>
            <Image
                src="/metric-icon-black.svg"
                alt="Build Metric Icon"
                width="60"
                height="60"
            />
            <h1 className="mt-6 inter-600 text-2xl text-text-secondary mb-6">
                Generated prompt
            </h1>
        </div>
    );
}