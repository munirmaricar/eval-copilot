import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { generatePrompt } from "@/app/lib/open-ai/generatePrompt";
import { rubericIdToText } from "@/app/lib/utils/rubericIdToText";

export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    inputVariables,
    scoringRuberic,
    criteria,
  }: {
    prompt: string;
    inputVariables: string[];
    criteria: string;
    scoringRuberic: string;
  } = await req.json();

  const { systemPrompt, userPrompt } = await generatePrompt({
    inputVariables,
    criteria,
    scoringRuberic: rubericIdToText(scoringRuberic),
  });

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    prompt: userPrompt,
  });

  return result.toDataStreamResponse();
}
