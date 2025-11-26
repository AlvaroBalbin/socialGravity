import { useMutation } from "@tanstack/react-query";
import { callEdge } from "../lib/api";

export function useSetVideoUrl() {
  return useMutation({
    mutationFn: ({ simulationId, videoUrl, duration }) =>
      callEdge("set_video_url", {
        simulation_id: simulationId,
        video_url: videoUrl,
        video_duration_seconds: duration,
      }),
  });
}
