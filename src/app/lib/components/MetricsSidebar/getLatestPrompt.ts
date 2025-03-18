import {MetricResponse} from "@/app/lib/api/metrics/get";

const getLatestPrompt = (prompts: MetricResponse["prompts"]) => {
    return prompts.reduce((latest, prompt) => {
        return prompt.version > latest.version ? prompt : latest;
    });
};

export { getLatestPrompt }
