import { z } from "zod";
import { rubericIdToText } from "@/app/lib/utils/rubericIdToText";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const baseSchema = z.object({
  input: z.string(),
  response: z.string(),
  score: z.number(),
  critique: z.string(),
});

export interface ExistingExample {
  input: string;
  response: string;
  score: number;
  critique: string | null;
  reference?: string | null;
  context?: string | null;
}

const mapExistingExample = (example: ExistingExample) => {
  const { reference, context, critique, ...rest } = example;
  return {
    ...rest,
    ...(example.reference ? { reference: example.reference } : {}),
    ...(example.context ? { context: example.context } : {}),
    ...(example.critique ? { critique: example.critique } : {}),
  };
};

const generatePrompts = ({
  criteria,
  inputVariables,
  scoringRuberic,
  existingExample,
  template,
}: {
  criteria: string;
  inputVariables: string[];
  scoringRuberic: string;
  existingExample: ExistingExample;
  template: string;
}) => {
  const systemPrompt = `You are an AI assistant tasked with generating an example for an evaluation metric.
    Based on the given criteria, scoring rubric, input variables, and an existing example, create a new, similar example.
    
    The example you create should take into account the users evaluation metric template: "${template}".
    `;

  let userPrompt = `
    Criteria: ${criteria}
    Scoring Rubric: ${scoringRuberic}
    Input Variables: ${inputVariables.join(", ")}
    Existing Example: ${JSON.stringify(mapExistingExample(existingExample))}

    Please generate a new example in JSON format with the following fields:
    - input    
    - response
    - score
    - critique
  `;

  if (inputVariables.includes("reference")) {
    userPrompt += "- reference\n";
  }

  if (inputVariables.includes("context")) {
    userPrompt += "- context\n";
  }

  userPrompt +=
    "\nEnsure the example is similar in style but different in content from the existing example.";

  return { systemPrompt, userPrompt };
};

const generateExample = async ({
  criteria,
  inputVariables,
  scoringRuberic,
  existingExample,
  template,
}: {
  criteria: string;
  inputVariables: string[];
  scoringRuberic: string;
  existingExample: ExistingExample;
  template: string;
}) => {
  const { userPrompt, systemPrompt } = generatePrompts({
    criteria,
    inputVariables,
    scoringRuberic: rubericIdToText(scoringRuberic),
    existingExample,
    template,
  });

  let schema = baseSchema;

  if (inputVariables.includes("reference")) {
    schema = schema.extend({
      reference: z.string(),
    });
  }

  if (inputVariables.includes("context")) {
    schema = schema.extend({
      context: z.string(),
    });
  }

  const openai = createOpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: schema,
    system: systemPrompt,
    prompt: userPrompt,
  });

  return { example: object };
};

export { generateExample };
