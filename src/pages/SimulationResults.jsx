// src/pages/SimulationResults.jsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HelpCircle } from 'lucide-react';

import { createPageUrl } from '@/utils';
import { callEdge } from '@/lib/api';
import { mapSimulationToUI } from '@/lib/mappers';

import SimulationHeader from '@/components/gravity/SimulationHeader';
import GravityOrbit from '@/components/gravity/GravityOrbit';
import TopPersonasRow from '@/components/gravity/TopPersonasRow';
import AnalyticsPanel from '@/components/gravity/AnalyticsPanel';

export default function SimulationResults() {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [simulationTitle, setSimulationTitle] = useState('');

  // Read simulation ID from query params
  const urlParams = new URLSearchParams(window.location.search);
  const simulationId = urlParams.get('id');

  // Load Supabase simulation
  const { data: simulation, isLoading } = useQuery({
    queryKey: ['simulation_results', simulationId],
    queryFn: () =>
      callEdge('get_simulation', { simulation_id: simulationId }),
    enabled: !!simulationId,
    select: mapSimulationToUI,
  });

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
  };

  const handleTitleChange = (newTitle) => {
    setSimulationTitle(newTitle);
  };

  const handleSave = (data) => {
    console.log('Simulation saved:', data);
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
        <a
          href={createPageUrl('Profile')}
          className="text-sm text-gray-900 underline"
        >
          Back to Profile
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Simulation Header */}
      <SimulationHeader
        onTitleChange={handleTitleChange}
        onSave={handleSave}
        defaultTitle={simulation.title}
      />

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

          {/* Top 4 Personas Row */}
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
        <HelpCircle className="w-4 h-4 text-white" strokeWidth={1.5}/>
      </button>
    </div>
  );
}
