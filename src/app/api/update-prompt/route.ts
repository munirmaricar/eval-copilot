import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    prompt,
    template,
  }: {
    prompt: string;
    template: string;
  } = await req.json();

  const system = `
  You are an expert content editor. Your task is to modify and improve the provided text content according to the user's specific instructions while retaining the original structure of the text. The user will give you a prompt indicating what changes or enhancements they want. Your response should be the updated content only, without including any tags or additional explanations. Ensure the revised text maintains its original organization and format, while also aligning closely with the user's request.
  The content you are updating is a prompt intended for an LLM to evaluate the quality of other LLMs' responses. The changes made by applying the user's PROMPT should modify the TEXT in a way that affects how the LLM responds to the evaluation task. For example, if the user requests "Shorter feedback," you should update the prompt to encourage the LLM to generate shorter feedback, rather than just shortening the feedback section of the text itself.
  
  The changes made by applying the INSTRUCTION should result in changes to the text that will affect the resulting response from the LLM. For example "Longer feedback" should result in the prompt prompting longer feedback from the LLM, not specifically make the feedback section longer.
  Important Guidelines:
  - Retain the original structure of the text while adapting it to meet the PROMPT.

  INSTRUCTION: ${prompt}
  `;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    prompt: template,
    system,
  });

  return result.toDataStreamResponse();
}
