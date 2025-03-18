import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { GET_METRICS_QUERY_KEY } from "@/app/lib/queries/useGetMetrics";
import {CreatePromptRequest} from "@/app/lib/api/prompts/create";

function useCreatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreatePromptRequest) => api.prompts.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_METRICS_QUERY_KEY] });
    },
  });
}

export { useCreatePrompt };
