export enum ScoringCriteria {
  OneToFive = "OneToFive",
  Binary = "Binary",
  FloatZeroToOne = "FloatZeroToOne",
}

export type Metric = {
  id: string;
  name: string;
  model: string;
  isDraft: boolean;
  updatedAt: string;
  scoringCriteria: ScoringCriteria;
  prompts: {
    version: number;
    isDeployed: boolean;
    id: string;
  }[];
  fewShots: {
    id: string;
    inUse: boolean;
  }[];
  testCases: {
    id: string;
  }[];
};

export type Prompt = {
  id: string;
  version: number;
  name: string;
  template: string;
  inputVariables: string[];
  isDeployed: boolean;
  updatedAt: string;
  criteria: string;
};

export type FewShot = {
  id: string;
  input: string;
  response: string;
  score: number;
  critique: string | null;
  context?: string | null;
  reference?: string | null;
  inUse: boolean;
};

export type TestCase = {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  expectedScore: number | null;
  atlaScore: number | null;
  critique: string | null;
};

export interface CollectionTestCase extends TestCase {
  expectedScore: null;
  atlaScore: null;
  critique: null;
}

export type TestCaseCollection = {
  id: string;
  name: string;
  description: string;
  testCases: { id: string }[];
};
