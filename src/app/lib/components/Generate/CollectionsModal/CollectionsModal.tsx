import Image from "next/image";
import { LoadCollection } from "@/app/lib/components/Generate/CollectionsModal/LoadCollection";
import { GetTestCaseCollectionsResponse } from "@/app/lib/api/testCaseCollections/get";
import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";
import { CreateTestCaseCollectionRequest } from "@/app/lib/api/testCaseCollections/create";
import { CreateCollection } from "@/app/lib/components/Generate/CollectionsModal/CreateCollection";
import { UpdateCollection } from "@/app/lib/components/Generate/CollectionsModal/UpdateCollection";
import { UpdateTestCaseCollectionRequest } from "@/app/lib/api/testCaseCollections/update";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function CollectionsModal({
  onClose,
  page,
  testCaseCollections,
  loadTestCases,
  createTestCaseCollection,
  testCases,
  setSelectedTestCaseCollectionId,
  selectedTestCaseCollectionId,
  updateTestCaseCollection,
}: {
  onClose: () => void;
  page: string | null;
  testCaseCollections: GetTestCaseCollectionsResponse;
  loadTestCases: (testCasesToLoad: GetTestCasesForMetricResponse) => void;
  createTestCaseCollection: (request: CreateTestCaseCollectionRequest) => void;
  testCases: GetTestCasesForMetricResponse | null;
  selectedTestCaseCollectionId: string | null;
  setSelectedTestCaseCollectionId: (id: string) => void;
  updateTestCaseCollection: (request: UpdateTestCaseCollectionRequest) => void;
}) {
  if (!page) {
    return null;
  }

  const isCreateCollectionPage = page === "create-collection";

  return (
    <div
      className={twMerge(
        classNames(
          "fixed max-h-96 border bottom-8 right-8 w-[550px] bg-gray border-border-primary rounded-xl shadow-2xl p-4 flex flex-col z-[9999]",
          { "h-auto": isCreateCollectionPage },
        ),
      )}
    >
      <button onClick={onClose} className="absolute top-3.5 right-5 z-10">
        <Image
          src="/close-icon-grey.svg"
          alt="Close prompt modal"
          width="16"
          height="16"
        />
      </button>
      {page === "load-collection" && (
        <LoadCollection
          onClose={onClose}
          testCaseCollections={testCaseCollections}
          loadTestCases={loadTestCases}
          setSelectedTestCaseCollectionId={setSelectedTestCaseCollectionId}
        />
      )}
      {isCreateCollectionPage && (
        <CreateCollection
          onClose={onClose}
          createTestCaseCollection={createTestCaseCollection}
          testCases={testCases}
        />
      )}
      {page === "update-collection" && (
        <UpdateCollection
          onClose={onClose}
          testCases={testCases}
          testCaseCollections={testCaseCollections}
          selectedTestCaseCollectionId={selectedTestCaseCollectionId}
          setSelectedTestCaseCollectionId={setSelectedTestCaseCollectionId}
          updateTestCaseCollection={updateTestCaseCollection}
        />
      )}
    </div>
  );
}

export { CollectionsModal };
