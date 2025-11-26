import { useQuery } from "@tanstack/react-query";
import { callEdge } from "../lib/api";

export function useSimulation(simulationId) {
  return useQuery({
    queryKey: ["simulation", simulationId],
    queryFn: () =>
      callEdge("get_simulation", { simulation_id: simulationId }),
    enabled: !!simulationId,
    refetchInterval: 3000, // poll until complete
  });
}
