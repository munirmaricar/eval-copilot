import { createTestCase } from "../../db";

export interface CreateTestCaseRequest {
  id?: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  expected_score: number | null;
  atla_score: number | null;
  critique: string | null;
}

interface CreateTestCaseResponse {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  expected_score: number | null;
  atla_score: number | null;
  critique: string | null;
}

async function create(
  request: CreateTestCaseRequest,
): Promise<CreateTestCaseResponse> {
  const id = request.id || crypto.randomUUID();

  const { expected_score, atla_score, ...rest } = request;

  createTestCase({
    ...rest,
    id,
    expectedScore: request.expected_score,
    atlaScore: request.atla_score,
  });

  return {
    ...request,
    id,
  };
}

export { create };
