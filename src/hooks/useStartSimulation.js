import { useMutation } from "@tanstack/react-query";
import { callEdge } from "../lib/api";

export function useStartSimulation() {
  return useMutation({
    mutationFn: (audiencePrompt) =>
      callEdge("start_simulation", {
        audience_prompt: audiencePrompt,
      }),
  });
}
