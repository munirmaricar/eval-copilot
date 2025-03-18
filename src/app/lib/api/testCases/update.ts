import { createTestCase, getTestCaseById } from "../../db";
import { TestCase } from "../../types";

export interface UpdateTestCaseRequest {
  id: string;
  testCase: {
    input?: string | null;
    response?: string | null;
    context?: string | null;
    reference?: string | null;
    expected_score?: number | null;
    atla_score?: number | null;
    critique?: string | null;
  };
}

interface UpdateTestCaseResponse {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  expected_score: number | null;
  atla_score: number | null;
  critique: string | null;
}

async function update(
  request: UpdateTestCaseRequest,
): Promise<UpdateTestCaseResponse> {
  const testCase = getTestCaseById(request.id);

  if (!testCase) {
    throw new Error("Test case not found");
  }

  const { atla_score, expected_score, ...rest } = request.testCase;

  const updatedTestCase = {
    ...testCase,
    ...rest,
    ...(expected_score !== undefined
      ? { expectedScore: request.testCase.expected_score }
      : {}),
    ...(atla_score !== undefined
      ? { atlaScore: request.testCase.atla_score }
      : {}),
  };

  createTestCase(updatedTestCase);

  return {
    ...updatedTestCase,
    expected_score: updatedTestCase.expectedScore,
    atla_score: updatedTestCase.atlaScore,
  };
}

export { update };
