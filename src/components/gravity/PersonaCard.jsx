import React from 'react';

export default function PersonaCard({ persona, position }) {
  // Calculate card position to avoid going off-screen
  const cardX = Math.min(Math.max(position.x, 120), 360);
  const cardY = position.y < 180 ? position.y + 40 : position.y - 200;
  
  return (
    <div 
      className="absolute z-30 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-56 pointer-events-none"
      style={{
        left: `${cardX}px`,
        top: `${cardY}px`,
        transform: 'translateX(-50%)',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <h3 className="font-semibold text-gray-900 text-sm mb-2.5">{persona.name}</h3>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {persona.tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index}
            className="px-2.5 py-0.5 bg-gray-50 border border-gray-150 rounded-full text-[11px] text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Stats */}
      <div className="space-y-0.5 mb-3">
        <p className="text-xs text-gray-500">
          Watch time: <span className="text-gray-800 font-medium">{persona.watchTime}</span>
        </p>
        <p className="text-xs text-gray-500">
          Engagement: <span className="text-gray-800 font-medium">{persona.engagement}%</span>
        </p>
      </div>
      
      {/* Insight */}
      <p className="text-[11px] text-gray-400 italic border-t border-gray-100 pt-2.5">
        {persona.insight}
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(5px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}