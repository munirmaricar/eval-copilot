import { create } from "@/app/lib/api/testCases/create";
import { getTestCasesForMetric } from "@/app/lib/api/testCases/getTestCasesForMetric";
import { update } from "@/app/lib/api/testCases/update";
import { deleteTestCase } from "@/app/lib/api/testCases/deleteTestCase";

const testCases = {
  create,
  getTestCasesForMetric,
  update,
  delete: deleteTestCase,
};

export { testCases };
