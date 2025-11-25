import React from 'react';

export default function MiniOrbit({ score = 50 }) {
  // Generate dot positions based on score
  const dots = [
    { x: 30, y: 20, size: 4, opacity: 0.9 },
    { x: 70, y: 25, size: 3, opacity: 0.6 },
    { x: 20, y: 50, size: 5, opacity: 0.8 },
    { x: 75, y: 60, size: 3, opacity: 0.5 },
    { x: 35, y: 75, size: 4, opacity: 0.7 },
    { x: 60, y: 80, size: 3, opacity: 0.4 },
  ];

  return (
    <div className="w-16 h-16 relative flex-shrink-0">
      {/* Orbit rings */}
      <div className="absolute inset-[10%] rounded-full border border-gray-200/50" />
      <div className="absolute inset-[25%] rounded-full border border-gray-200/40" />
      <div className="absolute inset-[40%] rounded-full border border-gray-200/30" />
      
      {/* Center dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-sm" />
      
      {/* Persona dots */}
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gray-900"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}