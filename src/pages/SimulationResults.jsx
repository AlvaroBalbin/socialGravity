// src/pages/SimulationResults.jsx

import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";

import { createPageUrl } from "@/utils";
import { callEdge } from "@/lib/api";
import { mapSimulationToUI } from "@/lib/mappers";

import SimulationHeader from "@/components/gravity/SimulationHeader";
import GravityOrbit from "@/components/gravity/GravityOrbit";
import TopPersonasRow from "@/components/gravity/TopPersonasRow";
import AnalyticsPanel from "@/components/gravity/AnalyticsPanel";

import { useAuth } from "@/lib/AuthContext";

export default function SimulationResults() {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [simulationTitle, setSimulationTitle] = useState("");

  // width of the right-hand analytics panel (draggable)
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const minSidebarWidth = 320;
  const maxSidebarWidth = 720;

  const { isAuthenticated, user } = useAuth(); // ⬅️ need user too

  // Read simulation ID from query params
  const urlParams = new URLSearchParams(window.location.search);
  const simulationId = urlParams.get("id");

  // Load Supabase simulation via edge function
  const {
    data: simulation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["simulation_results", simulationId],
    queryFn: () => callEdge("get_simulation", { simulation_id: simulationId }),
    enabled: !!simulationId,
    select: mapSimulationToUI,
  });

  // Save button logic
  const handleSave = () => {
    console.log(
      "[SimulationResults] Save clicked. isAuthenticated:",
      isAuthenticated,
      "simulationId:",
      simulationId
    );

    if (!simulationId) {
      console.error("No simulationId found when trying to save");
      return;
    }

    // Guest → send to /login with info about this simulation
    if (!isAuthenticated) {
      // after login, we want to land on /profile (where the sim will appear)
      const redirectTarget = "/profile";
      const redirectParam = encodeURIComponent(redirectTarget);

      window.location.href = `/login?redirect=${redirectParam}&claim_simulation=${simulationId}`;
      return;
    }

    // Already logged in → in future you might do extra save logic here
    console.log("User already authenticated; simulation should be claimed.");
  };

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
  };

  const handleTitleChange = (newTitle) => {
    setSimulationTitle(newTitle);
  };

  // Drag-to-resize handler for analytics panel
  const handleResizeMouseDown = useCallback(
    (e) => {
      e.preventDefault();

      const startX = e.clientX;
      const startWidth = sidebarWidth;

      const handleMouseMove = (moveEvent) => {
        const deltaX = startX - moveEvent.clientX; // drag left => grow sidebar
        let nextWidth = startWidth + deltaX;

        if (nextWidth < minSidebarWidth) nextWidth = minSidebarWidth;
        if (nextWidth > maxSidebarWidth) nextWidth = maxSidebarWidth;

        setSidebarWidth(nextWidth);
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [sidebarWidth]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  // No simulation found / error
  if (isError || !simulation) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500 mb-4">Simulation not found</p>
        <a
          href={createPageUrl("Profile")}
          className="text-sm text-gray-900 underline"
        >
          Back to Profile
        </a>
      </div>
    );
  }

  // Personas for orbit + top row (supports both new + old field names)
  const personas = simulation.personas ?? simulation.personas_data ?? [];

  // Determine if this simulation is already owned by the logged-in user
  // Use a safe "any" read so TS doesn't complain about user_id not being in UISimulation
// Determine if this simulation is already owned by the logged-in user
// Use a safe "any-style" read so TS doesn't complain about user_id / userId
const ownerId = simulation
  ? simulation["user_id"] ?? simulation["userId"] ?? null
  : null;

  const isOwnedByUser =
    isAuthenticated && !!user?.id && ownerId === user.id;

  return (
    <div className="h-screen bg-white flex flex-col">
      <SimulationHeader
        simulationData={simulation}
        onTitleChange={handleTitleChange}
        onSave={handleSave}
        isOwnedByUser={isOwnedByUser} // ✅ passed down
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Gravity Visualization */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Orbit Area – shows ALL personas */}
          <div className="flex-1 min-h-0 p-6">
            <GravityOrbit
              onPersonaSelect={handlePersonaSelect}
              selectedPersona={selectedPersona}
              savedPersonas={personas}
              savedMetrics={simulation.metrics}
            />
          </div>

          {/* Top Personas */}
          <div className="border-t border-gray-100">
            <TopPersonasRow
              onPersonaSelect={handlePersonaSelect}
              selectedPersona={selectedPersona}
              savedPersonas={personas}
            />
          </div>
        </div>

        {/* Drag handle between orbit and analytics */}
        <div
          onMouseDown={handleResizeMouseDown}
          className="w-[6px] cursor-col-resize bg-transparent hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
        >
          <div className="absolute inset-y-3 left-1 right-1 rounded-full bg-gray-300 opacity-60 pointer-events-none" />
        </div>

        {/* Right: Analytics Panel (resizable) */}
        <div
          className="shrink-0 h-full bg-gray-50/40 border-l border-gray-100"
          style={{ width: sidebarWidth }}
        >
          <div className="h-full p-5 overflow-y-auto">
            <AnalyticsPanel
              simulation={simulation}
              selectedPersona={selectedPersona}
            />
          </div>
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-5 right-5 w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <HelpCircle className="w-4 h-4 text-white" strokeWidth={1.5} />
      </button>
    </div>
  );
}
