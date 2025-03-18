import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";
import { useEffect } from "react";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import { useUpdateTestCase } from "@/app/lib/queries/useUpdateTestCase";
import { useUpdatePrompt } from "@/app/lib/queries/useUpdatePrompt";
import { useCreateTestCase } from "@/app/lib/queries/useCreateTestCase";
import { MetricResponse } from "@/app/lib/api/metrics/get";
import { useDeleteTestCase } from "@/app/lib/queries/useDeleteTestCase";

function useSyncTestCasesData({
  testCases,
  dbTestCases,
  selectedMetric,
}: {
  testCases: GetTestCasesForMetricResponse | null;
  dbTestCases: GetTestCasesForMetricResponse | null;
  selectedMetric: MetricResponse | null;
}) {
  const { mutate: updateTestCase } = useUpdateTestCase();
  const { mutate: createTestCase } = useCreateTestCase();
  const { mutate: updatePrompt } = useUpdatePrompt();
  const { mutate: deleteTestCase } = useDeleteTestCase();

  const getNewTestCases = () => {
    if (testCases === null || dbTestCases === null) {
      return;
    }

    if (selectedMetric === null) {
      throw new Error("Selected metric is not loaded yet");
    }

    const newTestCases = testCases.filter((testCase) => {
      return !dbTestCases.find((tc) => tc.id === testCase.id);
    });

    newTestCases.forEach((testCase) => {
      createTestCase(testCase);
    });

    if (newTestCases.length === 0) {
      return;
    }

    const newMetric = {
      ...selectedMetric,
      test_cases: [
        ...selectedMetric.test_cases,
        ...newTestCases.map((tc) => ({ id: tc.id })),
      ],
    };

    updatePrompt({ id: selectedMetric.id, metric: newMetric });
  };

  const getUpdatedTestCases = () => {
    if (testCases === null || dbTestCases === null) {
      return;
    }

    const existingTestCases = testCases
      .map((testCase) => {
        const dbTestCase = dbTestCases.find((tc) => tc.id === testCase.id);

        return dbTestCase ? { testCase, dbTestCase } : null;
      })
      .filter((pair) => pair !== null);

    const updatedTestCases = existingTestCases
      .filter(({ testCase, dbTestCase }) => !isEqual(testCase, dbTestCase))
      .map(({ testCase }) => testCase);

    updatedTestCases.forEach((testCase) => {
      updateTestCase({ id: testCase.id, testCase });
    });
  };

  const getDeletedTestCases = () => {
    if (testCases === null || dbTestCases === null) {
      return;
    }

    const deletedTestCases = dbTestCases.filter((dbTestCase) => {
      return !testCases.find((testCase) => testCase.id === dbTestCase.id);
    });

    deletedTestCases.forEach((testCase) => {
      deleteTestCase({ id: testCase.id });
    });
  };

  const syncData = () => {
    if (testCases === null || dbTestCases === null) {
      return;
    }

    if (isEqual(testCases, dbTestCases)) {
      return;
    }

    getNewTestCases();
    getUpdatedTestCases();
    getDeletedTestCases();
  };

  useEffect(() => {
    const debounced = debounce(() => {
      syncData();
    }, 1000);

    debounced();

    return () => debounced.cancel();
  }, [testCases, dbTestCases]);
}

export { useSyncTestCasesData };
