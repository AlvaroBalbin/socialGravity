// src/pages/SimulationDetail.jsx

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, HelpCircle } from 'lucide-react';

import { createPageUrl } from '@/utils';
import { callEdge } from '@/lib/api';
import { mapSimulationToUI } from '@/lib/mappers';

import GravityOrbit from '@/components/gravity/GravityOrbit';
import AnalyticsPanel from '@/components/gravity/AnalyticsPanel';
import TopPersonasRow from '@/components/gravity/TopPersonasRow';

export default function SimulationDetail() {
  const [selectedPersona, setSelectedPersona] = useState(null);

  // width of the right-hand analytics panel (resizable)
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const minSidebarWidth = 320;
  const maxSidebarWidth = 720;

  const urlParams = new URLSearchParams(window.location.search);
  const simulationId = urlParams.get('id');

  // Fetch simulation from Supabase via edge function
  const { data: simulation, isLoading } = useQuery({
    queryKey: ['simulation', simulationId],
    queryFn: () =>
      callEdge('get_simulation', { simulation_id: simulationId }),
    enabled: !!simulationId,
    select: mapSimulationToUI,
  });

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
  };

  // Drag handle for resizing analytics panel
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
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
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

  // No simulation found
  if (!simulation) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500 mb-4">Simulation not found</p>
        <Link
          to={createPageUrl('Profile')}
          className="text-sm text-gray-900 underline"
        >
          Back to Profile
        </Link>
      </div>
    );
  }

  const personas =
    simulation.personas ??
    simulation.personas_data ??
    [];

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={createPageUrl('Profile')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-sm font-medium text-gray-900">
              {simulation.title}
            </h1>
            <p className="text-xs text-gray-400">
              Audience Fit: {simulation.audienceFitScore}%
            </p>
          </div>
        </div>

        <Link
          to={createPageUrl('Landing')}
          className="text-lg font-medium text-gray-900 tracking-tight hover:text-gray-600 transition-colors"
        >
          Social Gravity
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Gravity Visualization + Top Personas */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Orbit Area */}
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
