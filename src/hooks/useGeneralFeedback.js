import { useQuery } from "@tanstack/react-query";
import { callEdge } from "../lib/api";

export function useGeneralFeedback(simulationId) {
  return useQuery({
    queryKey: ["general-feedback", simulationId],
    queryFn: () =>
      callEdge("summarize_simulation_feedback", {
        simulation_id: simulationId,
      }),
    enabled: !!simulationId,
  });
}
