import { useMutation } from "@tanstack/react-query";
import { callEdge } from "../lib/api";

export function useTranscribeVideo() {
  return useMutation({
    mutationFn: (simulationId) =>
      callEdge("transcribe_video", {
        simulation_id: simulationId,
      }),
  });
}
