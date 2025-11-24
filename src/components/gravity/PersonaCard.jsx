import React from 'react';
import { X } from 'lucide-react';

export default function PersonaCard({ persona, position, onClose }) {
  return (
    <div 
      className="absolute z-20 bg-white rounded-2xl shadow-lg border border-gray-100 p-5 w-64 animate-in fade-in duration-200"
      style={{
        left: `${Math.min(Math.max(position.x, 140), 360)}px`,
        top: `${Math.max(position.y - 20, 10)}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      <h3 className="font-semibold text-gray-900 text-base mb-3">{persona.name}</h3>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {persona.tags.map((tag, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Stats */}
      <div className="space-y-1 mb-4">
        <p className="text-sm text-gray-600">
          Watch time: <span className="text-gray-900 font-medium">{persona.watchTime}</span>
        </p>
        <p className="text-sm text-gray-600">
          Engagement: <span className="text-gray-900 font-medium">{persona.engagement}</span>
        </p>
      </div>
      
      {/* Insight */}
      <p className="text-sm text-gray-500 italic border-t border-gray-100 pt-3">
        {persona.insight}
      </p>
    </div>
  );
}