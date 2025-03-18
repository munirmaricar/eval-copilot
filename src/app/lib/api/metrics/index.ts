import { get } from "@/app/lib/api/metrics/get";
import { deploy } from "@/app/lib/api/metrics/deploy";
import { deleteMetric } from "@/app/lib/api/metrics/delete";

const metrics = {
  get: get,
  deploy: deploy,
  delete: deleteMetric,
};

export { metrics };
