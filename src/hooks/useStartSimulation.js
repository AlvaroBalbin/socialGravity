import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabaseClient"; // <- relative import, JS-safe

// export function hook
export function useStartSimulation() {
  return useMutation({
    // audiencePrompt is just a string
    mutationFn: async (audiencePrompt) => {
      const { data, error } = await supabase.functions.invoke(
        "start_simulation",
        {
          body: { audience_prompt: audiencePrompt },
        }
      );

      if (error) {
        console.error("start_simulation error", error);
        throw error;
      }

      // edge function returns { simulation_id: "..." }
      return data;
    },
  });
}
