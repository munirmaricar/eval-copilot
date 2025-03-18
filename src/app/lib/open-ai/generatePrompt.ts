import { arrayIncludesOnly } from "@/app/lib/utils/arrayIncludesOnly";

const INPUT_RESPONSE_PROMPT = `Please create an evaluation prompt based on the user specified Evaluation criteria and Scoring rubric. Please create an evaluation prompt based on the user specified Evaluation criteria. You should always use the following format:

'### **{Evaluation Name} Evaluation:**

**Objective:** Rate the responses of an AI model...

**Scoring:**
- **Lowest score:**
- **Low score:**
- **Medium score:**
- **High score:**
- **Highest score:**

**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.'

Do not add any numbers to the score tiers above. e.g., Lowest score "(1)".

You can use the below template as a guide for how the prompts should be set up:
/// E.g.,
User Evaluation Criteria: 'Assess the relevance of all the information in the response'

Evaluation prompt:

'### **Precision Evaluation:**

**Objective:** Rate the responses of an AI model, focusing on the relevance, accuracy, and conciseness of the response. Assess the AI response against the user instruction, ensuring it addresses the question directly and succinctly. Do not evaluate generally or based on the breadth of the response.

**Scoring:**
- **Lowest score** The response is highly inaccurate, irrelevant, verbose, or strays significantly from the user's question or the requested response format.
- **Low score** The response contains some correct and relevant details but is overshadowed by inaccuracies, irrelevancies, or unnecessary verbosity. It only partially adheres to the requested directness and conciseness.
- **Medium score** The response is mostly accurate, relevant, direct, and concise, but any error or deviation in these areas results in a downgrade.
- **High score** The response is highly precise, relevant, direct, and concise, with only minor deviations being exceptionally rare.
- **Highest score** The response fully and succinctly addresses the user's question without any deviations in precision, relevance, directness, and conciseness.

**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.'`;

const INPUT_RESPONSE_REFERENCE_PROMPT = `Please create an evaluation prompt based on the user specified Evaluation criteria and Scoring rubric. You should always use the following format:
'### **{Evaluation Name} Evaluation:**

**Objective:** Rate the responses of an AI model...

**Scoring:**
- **Lowest score:**
- **Low score:**
- **Medium score:**
- **High score:**
- **Highest score:**

**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.'

Do not add any numbers to the score tiers above. e.g., Lowest score "(1)".

You can use the below template as a guide for how the prompts should be set up:

/// E.g.,
User Evaluation Criteria: 'Assess the relevance of all the information in the response'

Evaluation prompt:

'### **Precision Evaluation:**

**Objective:** Rate the responses of an AI model, focusing on the relevance, accuracy, and conciseness of the response. Assess the AI response against the reference response to ensure that it includes relevant and accurate information. Do not evaluate generally or based on the breadth of the response.

**Scoring:**
- **Lowest score:** The response directly contradicts the reference or is entirely unrelated.
- **Low score** The response includes some accurate information from the reference, but contains significant inaccuracies or irrelevant details.
- **Medium score** The response is mostly accurate and relevant compared to the reference, with only minor inaccuracies or irrelevant details.
- **High score** The response closely matches the reference in accuracy and relevance, with only rare and minor deviations.
- **Highest score** The response fully and succinctly addresses the user's question without any deviations in accuracy or relevance compared to the reference.

**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.'`;

const INPUT_RESPONSE_CONTEXT_PROMPT = `Please create an evaluation prompt based on the user specified Evaluation criteria and Scoring rubric. You should always use the following format:

'### **{Evaluation Name} Evaluation:**

**Objective:** Rate...

**Scoring:**
- **Lowest score:**
- **Low score:**
- **Medium score:**
- **High score:**
- **Highest score:**

**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.'

Do not add any numbers to the score tiers above. e.g., Lowest score "(1)".

If the user aims to evaluate the AI response, you can use the below template as a guide for how the prompt should be set up.
/// E.g.,
User Evaluation Criteria: 'Determine if the response is factually based on the provided context.'

Evaluation prompt:

'### **Groundedness Evaluation:**

**Objective:** Rate the responses of an AI model based on how well the statements are grounded in the provided context. Do not evaluate based on your internal knowledge. Assess the AI response to ensure it includes information that is supported by the given context. Do not evaluate generally or based on the breadth of the response.

**Scoring:**
- **Lowest score:** The response contains statements that directly contradict the context or are entirely unsupported by it.
- **Low score** The response includes some information from the context, but contains significant ungrounded claims or misinterpretations.
- **Medium score** The response is mostly grounded in the context, with only minor unsupported claims or misinterpretations.
- **High score** The response closely aligns with the context, with only rare and minor deviations.
- **Highest score** The response is fully grounded in the context, with all statements accurately reflecting the provided information.
**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.'
If the user aims to evaluate the context that has been retrieved, you can use the below template as a guide for how it should be set up:

/// E.g.,
User Evaluation Criteria: 'Measures how on-point the retrieved context is.'

'### **Context Relevance Evaluation:**

**Objective:** Rate the relevance of the retrieved context in relation to the user query. Examine the retrieved context to ensure it relevantly covers the user query. Focus on appropriateness of the context, not on style or comprehensiveness. Evaluate only the retrieved context, not the AI's response.

**Scoring:**
- **Lowest score:** The context is completely irrelevant to the query or topic.
- **Low score** The context is only tangentially related to the query, with minimal relevant information.
- **Medium score** The context is somewhat relevant, addressing parts of the query but missing key aspects.
- **High score** The context is highly relevant, addressing most aspects of the query directly.
- **Highest score** The context is perfectly on-point, directly and comprehensively addressing the query.

**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.'`;

const INPUT_RESPONSE_CONTEXT_REFERENCE_PROMPT = `Please create an evaluation prompt based on the user specified Evaluation criteria and Scoring rubric. You should always use the following format:

'### **{Evaluation Name} Evaluation:**

**Objective:** Rate...

**Scoring:**
- **Lowest score:**
- **Low score:**
- **Medium score:**
- **High score:**
- **Highest score:**

**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.'

Do not add any numbers to the score tiers above. e.g., Lowest score "(1)".

If the user aims to evaluate the AI response, you can use the below template as a guide for how the prompt should be set up.

/// E.g.,
User Evaluation Criteria: 'Assess the relevance of all the information in the response against the context and the reference response.'

'**Consistency Evaluation:**

**Objective:** Rate the responses of an AI model on consistency with both the provided context and the reference response. Examine the AI's response to ensure it accurately reflects the context while aligning with the key points and conciseness of the reference response.

**Scoring:**
- **Lowest score:** The response is highly inconsistent, with major inaccuracies or contradictions relative to the context and reference response.
- **Low score** The response shows some consistency but includes noticeable inaccuracies or misalignments.
- **Medium score** The response is generally consistent, with some inaccuracies or deviations.
- **High score** The response is mostly consistent, with only minor inaccuracies or deviations.
- **Highest score** The response is perfectly consistent, accurately reflecting the context and closely aligning with the reference response.

**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.'

If the user wishes to evaluate the context that has been retrieved, you can use the below template as a guide for how it should be set up:

/// E.g.,
User Evaluation Criteria: 'Measures how on-point the retrieved context is in relation to the reference response.
'**Context Relevance Evaluation:**

**Objective:** Rate the relevance of the retrieved context in relation to the reference response (ground-truth). Focus on how well the context supports the content of the reference response, disregarding other aspects like style. Evaluate only the retrieved context, not the AI's response.

**Scoring:**
- **Lowest score:** The context is completely irrelevant to the reference response.
- **Low score** The context is only tangentially related to the reference response, with minimal alignment.
- **Medium score** The context is somewhat relevant, supporting some key points but missing others.
- **High score** The context is highly relevant, supporting most key points of the reference response.
- **Highest score** The context perfectly aligns with and supports all key points of the reference response.

**Feedback:** Provide a brief justification for your score, focusing solely on the relevance of the retrieved context to the reference response. Keep your feedback concise and directly related to the evaluation criteria.'`;

const generatePrompt = async ({
  inputVariables,
  criteria,
  scoringRuberic,
  examples,
}: {
  inputVariables: string[];
  criteria: string;
  scoringRuberic: string;
  examples?: string;
}) => {
  let systemPrompt = null;

  if (arrayIncludesOnly(inputVariables, ["input", "response"])) {
    systemPrompt = INPUT_RESPONSE_PROMPT;
  } else if (
    arrayIncludesOnly(inputVariables, ["input", "response", "reference"])
  ) {
    systemPrompt = INPUT_RESPONSE_REFERENCE_PROMPT;
  } else if (
    arrayIncludesOnly(inputVariables, ["input", "response", "context"])
  ) {
    systemPrompt = INPUT_RESPONSE_CONTEXT_PROMPT;
  } else if (
    arrayIncludesOnly(inputVariables, [
      "input",
      "response",
      "context",
      "reference",
    ])
  ) {
    systemPrompt = INPUT_RESPONSE_CONTEXT_REFERENCE_PROMPT;
  } else {
    throw new Error(
      `Invalid input variables: ${inputVariables.join(", ")}. Must include "input" and "response" and optionally "reference" and/or "context".`,
    );
  }

  const userPrompt = `EVALUATION CRITERIA: ${criteria}\n\nSCORING RUBRIC: ${scoringRuberic}`;

  return { systemPrompt, userPrompt };
};

export { generatePrompt };
