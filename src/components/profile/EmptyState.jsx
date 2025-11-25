import React from 'react';

export default function EmptyState({ onRunSimulation }) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-20"
      style={{
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      {/* Empty orbit icon */}
      <div className="w-20 h-20 relative mb-6">
        <div className="absolute inset-0 rounded-full border border-gray-200" />
        <div className="absolute inset-[25%] rounded-full border border-gray-200/60" />
        <div className="absolute inset-[50%] rounded-full border border-gray-200/40" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-200 rounded-sm" />
      </div>

      <p className="text-sm font-medium text-gray-900 mb-1">Nothing here yet.</p>
      <p className="text-xs text-gray-400 font-light text-center max-w-xs mb-6">
        Run a simulation to start building your audience universe.
      </p>

      <button
        onClick={onRunSimulation}
        className="px-5 py-2.5 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
      >
        Run Simulation
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}