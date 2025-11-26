// src/lib/freeSimulationGate.ts
const FREE_SIM_KEY = "fg_free_sim_used";

export function hasUsedFreeSim() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(FREE_SIM_KEY) === "true";
}

export function markFreeSimUsed() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FREE_SIM_KEY, "true");
}
