import React from 'react';
import { Users, Play, Lightbulb } from 'lucide-react';
import { useScrollReveal } from './useScrollReveal';

const features = [
  {
    icon: Users,
    title: 'Recreate',
    description: 'AI generates realistic personas based on behaviour, taste, and viewing patterns.',
  },
  {
    icon: Play,
    title: 'Simulate',
    description: 'Upload a clip. Watch personas respond in real time.',
  },
  {
    icon: Lightbulb,
    title: 'Understand',
    description: 'See what resonates — and why.',
  },
];

export default function WhatItDoesSection() {
  const [headerRef, headerVisible] = useScrollReveal(0.2);
  const [cardsRef, cardsVisible] = useScrollReveal(0.1);

  return (
    <section id="what-it-does" className="py-28 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 
          ref={headerRef}
          className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Your audience, re-imagined as lifelike personas.
        </h2>
        
        {/* Three columns */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title} 
                className="flex flex-col items-center bg-[#FAFAFA] rounded-2xl border border-gray-100 p-6 transition-all duration-150 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md"
                style={{
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, box-shadow 0.15s ease-out, scale 0.15s ease-out`,
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-4"
                  style={{
                    opacity: cardsVisible ? 1 : 0,
                    transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1 + 0.1}s`,
                  }}
                >
                  <Icon className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[240px]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Subtext */}
        <p 
          className="text-xs text-gray-400 font-light"
          style={{
            opacity: cardsVisible ? 1 : 0,
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          No metrics noise. No ambiguity. Just clarity.
        </p>
      </div>
    </section>
  );
}