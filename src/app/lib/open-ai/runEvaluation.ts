import { z } from "zod";
import { rubericIdToText } from "@/app/lib/utils/rubericIdToText";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { ScoringCriteria } from "../types";

interface Example {
  input: string;
  response: string;
  score: number;
  critique: string | null;
  reference?: string | null;
  context?: string | null;
}

const createExampleString = (example: Example) => {
  return Object.entries(example).reduce((acc, [key, value]) => {
    if (["id", "in_use"].includes(key)) {
      return acc;
    }

    if (value === null) {
      return acc;
    }

    return `${acc}${key}: ${value}, `;
  }, "");
};

const generatePrompts = ({
  template,
  input,
  response,
  context,
  reference,
  examples,
}: {
  template: string;
  input: string;
  response: string;
  context?: string | null;
  reference?: string | null;
  examples?: Example[];
}) => {
  const systemPrompt =
    "Please act as an impartial judge and evaluate the " +
    "assistant response given the user input, user context (optional)," +
    " and reference response (optional).";

  let userPrompt = `Evaluation Criteria: ${template}\n\n`;

  if (examples && examples.length > 0) {
    userPrompt +=
      "**Examples for guidance:**\n[Few-shot examples given by the user]\n";

    examples.forEach((example, index) => {
      userPrompt += `Few shot example ${index + 1}: ${createExampleString(example)}\n`;
    });
  }

  userPrompt += `\nUser input: ${input}\n`;

  if (context) {
    userPrompt += `User context: ${context}\n`;
  }

  if (reference) {
    userPrompt += `Reference response: ${reference}\n`;
  }

  userPrompt += `Assistant response: "${response}"\n\n`;

  userPrompt += `Your output should follow the format '<score> your score </score> <feedback> your feedback </feedback>'`;

  return { userPrompt, systemPrompt };
};

const binarySchema = z.object({
  score: z.union([z.literal(0), z.literal(1)]),
  critique: z.string(),
});
const floatSchema = z.object({
  score: z.number().min(0).max(1),
  critique: z.string(),
});
const oneToFiveSchema = z.object({
  score: z.number().int().min(1).max(5),
  critique: z.string(),
});

const getSchema = (scoringCriteria: ScoringCriteria) => {
  if (scoringCriteria === ScoringCriteria.Binary) {
    return binarySchema;
  }

  if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
    return floatSchema;
  }

  if (scoringCriteria === ScoringCriteria.OneToFive) {
    return oneToFiveSchema;
  }

  throw new Error("Invalid scoring criteria");
};

const runEvaluation = async ({
  scoringCriteria,
  template,
  input,
  response,
  context,
  reference,
  examples,
}: {
  scoringCriteria: ScoringCriteria;
  template: string;
  input: string;
  response: string;
  context?: string | null;
  reference?: string | null;
  examples?: Example[];
}) => {
  const { userPrompt, systemPrompt } = generatePrompts({
    template,
    input,
    response,
    context,
    reference,
    examples,
  });

  console.log(userPrompt);

  const openai = createOpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: getSchema(scoringCriteria),
    system: systemPrompt,
    prompt: userPrompt,
  });

  return { evaluation: object };
};

export { runEvaluation };
