import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

// Mini orbit visual for hero
function HeroOrbit() {
  const dots = [
    { x: 50, y: 18, size: 8, opacity: 0.3 },
    { x: 22, y: 32, size: 12, opacity: 0.5 },
    { x: 78, y: 28, size: 10, opacity: 0.4 },
    { x: 35, y: 55, size: 18, opacity: 0.8 },
    { x: 68, y: 62, size: 14, opacity: 0.6 },
    { x: 50, y: 75, size: 16, opacity: 0.7 },
    { x: 28, y: 70, size: 9, opacity: 0.35 },
    { x: 72, y: 45, size: 11, opacity: 0.45 },
  ];

  return (
    <div className="relative w-full max-w-[380px] aspect-square mx-auto">
      {/* Soft glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.025) 0%, transparent 50%)',
        }}
      />
      
      {/* Orbit rings */}
      <div className="absolute inset-[20%] rounded-full border border-gray-100 opacity-40" />
      <div className="absolute inset-[35%] rounded-full border border-gray-100 opacity-30" />
      <div className="absolute inset-[48%] rounded-full border border-gray-100 opacity-20" />
      
      {/* Center node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm" />
      
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
            animation: `float-hero-${i % 3} ${7 + i}s ease-in-out infinite`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes float-hero-0 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-4px); }
        }
        @keyframes float-hero-1 {
          0%, 100% { transform: translate(-50%, -50%) translateX(0px); }
          50% { transform: translate(-50%, -50%) translateX(4px); }
        }
        @keyframes float-hero-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          50% { transform: translate(-50%, -50%) translate(3px, -3px); }
        }
      `}</style>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight mb-6">
          See your audience.<br />
          <span className="text-gray-400">Before you post.</span>
        </h1>
        
        {/* Sub-headline */}
        <p className="text-base md:text-lg text-gray-500 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          AI simulates how different personas react to your content — so creators can predict performance with clarity, not guesswork.
        </p>
        
        {/* CTAs */}
        <div className="flex items-center justify-center gap-6 mb-16">
          <Link 
            to={createPageUrl('SimulationResults')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Try Simulation
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a 
            href="#what-it-does"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Learn More
          </a>
        </div>
        
        {/* Hero Visual */}
        <HeroOrbit />
      </div>
    </section>
  );
}