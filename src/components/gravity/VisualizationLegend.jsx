import React from 'react';

const legendItems = [
  {
    id: 'depth',
    label: '3-Layer Depth',
    visual: (
      <div className="flex items-end gap-1 h-5">
        <div className="w-1.5 h-2 bg-gray-300 rounded-sm" />
        <div className="w-1.5 h-3.5 bg-gray-400 rounded-sm" />
        <div className="w-1.5 h-5 bg-gray-600 rounded-sm" />
      </div>
    ),
  },
  {
    id: 'tiers',
    label: 'Resonance Tiers',
    visual: (
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div className="w-3 h-3 rounded-full bg-gray-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
      </div>
    ),
  },
  {
    id: 'drift',
    label: 'Gravitational Drift',
    visual: (
      <div className="flex items-center gap-0.5">
        <div className="w-2 h-2 rounded-full bg-gray-700" />
        <div className="w-6 h-px bg-gradient-to-r from-gray-400 to-transparent" />
      </div>
    ),
  },
  {
    id: 'clusters',
    label: 'Micro-Clusters',
    visual: (
      <div className="relative w-6 h-5">
        <div className="absolute top-0 left-1 w-1.5 h-1.5 rounded-full bg-gray-500" />
        <div className="absolute top-1.5 left-0 w-2 h-2 rounded-full bg-gray-600" />
        <div className="absolute top-2 left-2.5 w-1.5 h-1.5 rounded-full bg-gray-400" />
        <div className="absolute top-0.5 left-3 w-1 h-1 rounded-full bg-gray-300" />
      </div>
    ),
  },
];

export default function VisualizationLegend() {
  return (
    <div className="flex items-center justify-center gap-8 py-4 border-t border-gray-100">
      {legendItems.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8">
            {item.visual}
          </div>
          <span className="text-xs text-gray-500 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}