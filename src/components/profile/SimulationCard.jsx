import React from 'react';
import { format } from 'date-fns';
import MiniOrbit from './MiniOrbit';

export default function SimulationCard({ simulation, onClick, delay = 0 }) {
  const createdDate = simulation?.created_date 
    ? format(new Date(simulation.created_date), 'MMM d, yyyy')
    : 'Unknown';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer group"
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        animation: `cardFadeIn 0.4s ease-out ${delay}s both`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
      }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
            {simulation.title || 'Untitled Simulation'}
          </h3>
          <p className="text-xs text-gray-400 font-light mb-3">{createdDate}</p>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Fit: {simulation.audience_fit_score || 0}%
            </span>
            {simulation.top_persona && (
              <span className="text-xs text-gray-400 font-light truncate">
                Top: {simulation.top_persona}
              </span>
            )}
          </div>
        </div>

        {/* Mini Orbit */}
        <MiniOrbit score={simulation.audience_fit_score} />
      </div>

      <style>{`
        @keyframes cardFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(4px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}