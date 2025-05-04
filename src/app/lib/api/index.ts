import { prompts } from "@/app/lib/api/prompts";
import { metrics } from "@/app/lib/api/metrics";
import { testCases } from "@/app/lib/api/testCases";
import { testCaseCollections } from "@/app/lib/api/testCaseCollections";

const api = {
  prompts,
  metrics,
  testCases,
  testCaseCollections,
};

export { api };
