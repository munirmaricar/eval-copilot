import { arrayIncludesOnly } from "@/app/lib/utils/arrayIncludesOnly";

function getAtlaAPICode({
  inputVariables,
  metricName,
}: {
  inputVariables: string[];
  metricName: string;
}) {
  if (arrayIncludesOnly(inputVariables, ["input", "response"])) {
    return `from atla import Atla

client = Atla(
  # defaults to os.environ.get("ATLA_API_KEY")
  api_key="my_api_key"
)

evals = client.evaluation.create(
  input="If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
  response="Total processing time is 5 widgets * 5 minutes = 25 minutes. Then 25 mins / 100 machines = 15 seconds.",
  metrics=["${metricName}"],
)

print(f"Atla's score: {evals.evaluations['${metricName}'].score}")
print(f"Atla's critique: {evals.evaluations['${metricName}'].critique}")`;
  } else if (
    arrayIncludesOnly(inputVariables, ["input", "response", "reference"])
  ) {
    return `from atla import Atla

client = Atla(
  # defaults to os.environ.get("ATLA_API_KEY")
  api_key="my_api_key"
)

evals = client.evaluation.create(
  input="Is NP equal to NP-Hard?",
  reference="NP-Hard problems are at least as hard as the hardest NP problems. NP-Hard problems don't have to be in NP, and their relationship is an open question.",
  response="Richard Karp expanded on the Cook-Levin Theorem to show that all NP problems can be reduced to NP-Hard problems in polynomial time."
  metrics=["${metricName}"],
)

print(f"Atla's score: {evals.evaluations['${metricName}'].score}")
print(f"Atla's critique: {evals.evaluations['${metricName}'].critique}")`;
  } else if (
    arrayIncludesOnly(inputVariables, ["input", "response", "context"])
  ) {
    return `from atla import Atla

client = Atla(
  # defaults to os.environ.get("ATLA_API_KEY")
  api_key="my_api_key"
)

evals = client.evaluation.create(
  input="Is it legal to monitor employee emails under European privacy laws?",
  context="European privacy laws, including GDPR, allow for the monitoring of employee emails under strict conditions. The employer must demonstrate that the monitoring is necessary for a legitimate purpose, such as protecting company assets or compliance with legal obligations. Employees must be informed about the monitoring in advance, and the privacy impact should be assessed to minimize intrusion.", 
  response="Monitoring employee emails is permissible under European privacy laws like GDPR, provided there's a legitimate purpose.",
  metrics=["${metricName}"],
)

print(f"Atla's score: {evals.evaluations['${metricName}'].score}")
print(f"Atla's critique: {evals.evaluations['${metricName}'].critique}")`;
  } else if (
    arrayIncludesOnly(inputVariables, [
      "input",
      "response",
      "context",
      "reference",
    ])
  ) {
    return `from atla import Atla

client = Atla(
  # defaults to os.environ.get("ATLA_API_KEY")
  api_key="my_api_key"
)

evals = client.evaluation.create(
  input="Explain the process of photosynthesis in plants.",
  context="Chapter 11: Photosynthesis occurs in the chloroplasts of plant cells where light energy is absorbed by chlorophyll, converting carbon dioxide and water into glucose and oxygen. Calvin cycle: The process of photosynthesis involves light-dependent reactions and the Calvin cycle, resulting in the production of glucose, which serves as a primary energy source for plants.", 
  reference="Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. It involves the absorption of carbon dioxide and water, converting them into glucose and oxygen using the energy from sunlight.",
  response="Photosynthesis is when plants use sunlight to make food.",
  metrics=["${metricName}"]
)

print(f"Atla's score: {evals.evaluations['${metricName}'].score}")
print(f"Atla's critique: {evals.evaluations['${metricName}'].critique}")`;
  } else {
    throw new Error(
      `Invalid input variables: ${inputVariables.join(", ")}. Must include "input" and "response" and optionally "reference" and/or "context".`,
    );
  }
}

export { getAtlaAPICode };
