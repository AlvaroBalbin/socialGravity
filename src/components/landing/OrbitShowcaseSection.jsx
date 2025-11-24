import React from 'react';

function ShowcaseOrbit() {
  const dots = [
    { x: 15, y: 35, size: 10, opacity: 0.35 },
    { x: 25, y: 20, size: 8, opacity: 0.3 },
    { x: 35, y: 45, size: 16, opacity: 0.7 },
    { x: 42, y: 28, size: 12, opacity: 0.5 },
    { x: 50, y: 60, size: 22, opacity: 0.9 },
    { x: 58, y: 38, size: 14, opacity: 0.6 },
    { x: 65, y: 55, size: 18, opacity: 0.75 },
    { x: 72, y: 25, size: 9, opacity: 0.4 },
    { x: 78, y: 48, size: 11, opacity: 0.45 },
    { x: 85, y: 35, size: 7, opacity: 0.28 },
  ];

  return (
    <div className="relative w-full max-w-3xl aspect-[2/1] mx-auto">
      {/* Soft glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 60%)',
        }}
      />
      
      {/* Orbit rings - elliptical */}
      <div className="absolute inset-x-[10%] inset-y-[15%] rounded-full border border-gray-100 opacity-30" />
      <div className="absolute inset-x-[25%] inset-y-[25%] rounded-full border border-gray-100 opacity-25" />
      <div className="absolute inset-x-[38%] inset-y-[35%] rounded-full border border-gray-100 opacity-20" />
      
      {/* Center node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-sm" />
      
      {/* Dots */}
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gray-800"
          style={{
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            opacity: dot.opacity,
            transform: 'translate(-50%, -50%)',
            animation: `float-showcase-${i % 3} ${8 + (i * 0.5)}s ease-in-out infinite`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes float-showcase-0 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-5px); }
        }
        @keyframes float-showcase-1 {
          0%, 100% { transform: translate(-50%, -50%) translateX(0px); }
          50% { transform: translate(-50%, -50%) translateX(5px); }
        }
        @keyframes float-showcase-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          50% { transform: translate(-50%, -50%) translate(3px, -3px); }
        }
      `}</style>
    </div>
  );
}

export default function OrbitShowcaseSection() {
  return (
    <section className="py-28 px-6 bg-gray-50/50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-5">
            A new way to "see" resonance.
          </h2>
          <p className="text-sm text-gray-500 font-light max-w-md mx-auto leading-relaxed">
            Each dot represents a persona.<br />
            Closer means higher engagement.<br />
            Darker means stronger pull.<br />
            The orbit becomes your creative compass.
          </p>
        </div>
        
        {/* Visual */}
        <ShowcaseOrbit />
      </div>
    </section>
  );
}