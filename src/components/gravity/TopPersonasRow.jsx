import React from 'react';
import { personasWithPositions } from './GravityOrbit';

// Get dot color based on engagement
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
    <div className="flex items-center justify-center gap-6 py-5">
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Top Personas</span>
      
      <div className="flex items-center gap-4">
        {topPersonas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onPersonaSelect(selectedPersona?.id === persona.id ? null : persona)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
              selectedPersona?.id === persona.id ? 'bg-gray-50 ring-1 ring-gray-200' : ''
            }`}
          >
            {/* Mini dot */}
            <div 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: getDotColor(persona.engagement) }}
            />
            
            {/* Name and score */}
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-700 font-medium leading-tight">
                {persona.name}
              </span>
              <span className="text-[10px] text-gray-400">
                {persona.engagement}%
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}