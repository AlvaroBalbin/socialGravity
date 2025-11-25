import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SimulationHeader from '@/components/gravity/SimulationHeader';
import GravityOrbit from '@/components/gravity/GravityOrbit';
import AnalyticsPanel from '@/components/gravity/AnalyticsPanel';
import TopPersonasRow from '@/components/gravity/TopPersonasRow';
import { HelpCircle } from 'lucide-react';

export default function SimulationResults() {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [simulationTitle, setSimulationTitle] = useState('');

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
  };

  const handleTitleChange = (newTitle) => {
    setSimulationTitle(newTitle);
  };

  const handleSave = (data) => {
    console.log('Simulation saved:', data);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simulation Header */}
      <SimulationHeader 
        onTitleChange={handleTitleChange}
        onSave={handleSave}
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
            />
          </div>
          
          {/* Top 4 Personas Row */}
          <div className="border-t border-gray-100">
            <TopPersonasRow 
              onPersonaSelect={handlePersonaSelect}
              selectedPersona={selectedPersona}
            />
          </div>
        </div>

        {/* Right: Analytics Panel */}
        <div className="p-5 border-l border-gray-100 bg-gray-50/40">
          <AnalyticsPanel selectedPersona={selectedPersona} />
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-5 right-5 w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <HelpCircle className="w-4 h-4 text-white" strokeWidth={1.5} />
      </button>
    </div>
  );
}