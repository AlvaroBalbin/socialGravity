import React from 'react';
import { personasWithPositions } from './GravityOrbit';

// Get dot color based on engagement (same logic as GravityOrbit)
const getDotColor = (engagement) => {
  const lightness = 85 - (engagement * 0.7);
  return `hsl(0, 0%, ${lightness}%)`;
};

export default function TopPersonasRow({ onPersonaSelect, selectedPersona }) {
  // Sort by engagement and take top 4
  const topPersonas = [...personasWithPositions]
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 4);

  return (
    <div className="flex items-center justify-center gap-8 py-5">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Top Personas</span>
      
      <div className="flex items-center gap-6">
        {topPersonas.map((persona, index) => (
          <button
            key={persona.id}
            onClick={() => onPersonaSelect(persona)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gray-50 ${
              selectedPersona?.id === persona.id ? 'bg-gray-50 ring-1 ring-gray-200' : ''
            }`}
          >
            {/* Mini dot */}
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: getDotColor(persona.engagement) }}
            />
            
            {/* Name and score */}
            <div className="flex flex-col items-start">
              <span className="text-sm text-gray-700 font-medium leading-tight">
                {persona.name}
              </span>
              <span className="text-xs text-gray-400">
                {persona.engagement}% engagement
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}