// src/pages/SimulationDetail.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, HelpCircle } from 'lucide-react';

import GravityOrbit from '@/components/gravity/GravityOrbit';
import AnalyticsPanel from '@/components/gravity/AnalyticsPanel';
import TopPersonasRow from '@/components/gravity/TopPersonasRow';

import { callEdge } from '@/lib/api';
import { mapSimulationToUI } from '@/lib/mappers';

export default function SimulationDetail() {
  const [selectedPersona, setSelectedPersona] = useState(null);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  // No simulation found
  if (!simulation) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
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

  return (
    <div className="min-h-screen bg-white flex flex-col">

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
      <div className="flex-1 flex">

        {/* Left: Gravity Visualization */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Orbit Area */}
          <div className="flex-1 p-6">
            <GravityOrbit
              onPersonaSelect={handlePersonaSelect}
              selectedPersona={selectedPersona}
              savedPersonas={simulation.personas_data}
            />
          </div>

          {/* Top 4 Personas */}
          <div className="border-t border-gray-100">
            <TopPersonasRow
              onPersonaSelect={handlePersonaSelect}
              selectedPersona={selectedPersona}
              savedPersonas={simulation.personas_data}
            />
          </div>
        </div>

        {/* Right: Analytics Panel */}
        <div className="p-5 border-l border-gray-100 bg-gray-50/40">
          <AnalyticsPanel
            selectedPersona={selectedPersona}
            savedMetrics={simulation.metrics}
          />
        </div>

      </div>

      {/* Help Button */}
      <button className="fixed bottom-5 right-5 w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <HelpCircle className="w-4 h-4 text-white" strokeWidth={1.5} />
      </button>
    </div>
  );
}
