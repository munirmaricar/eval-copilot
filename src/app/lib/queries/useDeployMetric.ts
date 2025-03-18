import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { GET_METRICS_QUERY_KEY } from "@/app/lib/queries/useGetMetrics";
import { CreatePromptRequest } from "@/app/lib/api/prompts/create";
import { DeployMetricRequest } from "@/app/lib/api/metrics/deploy";
import { toast } from "react-toastify";

function useDeployMetric({ onSucess }: { onSucess?: () => void } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DeployMetricRequest) => {
      // Artificially delay the request to look like we are deploying
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("Promise has been resolved!");
        }, 1000);
      });

      return api.metrics.deploy(request);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [GET_METRICS_QUERY_KEY] });

      if (onSucess) {
        onSucess();
      }

      toast(
        `Deployed! You can now call ${data.metric.name} using the Atla API.`,
        {
          position: "top-center",
          type: "success",
          theme: "dark",
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          style: {
            backgroundColor: "#262626",
            fontSize: "18px",
            minWidth: "max-content",
          },
        },
      );
    },
  });
}

export { useDeployMetric };
