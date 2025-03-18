import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { GET_METRICS_QUERY_KEY } from "@/app/lib/queries/useGetMetrics";
import { UpdatePromptRequest } from "@/app/lib/api/prompts/update";

function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdatePromptRequest) =>
      api.prompts.update(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_METRICS_QUERY_KEY] });
    },
  });
}

export { useUpdatePrompt };
