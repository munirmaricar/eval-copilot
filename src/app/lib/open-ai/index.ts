import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

const model = openai("gpt-4o-mini");

export { model };
