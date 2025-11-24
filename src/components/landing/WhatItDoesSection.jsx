import React from 'react';
import { Users, Play, Lightbulb } from 'lucide-react';

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
  return (
    <section id="what-it-does" className="py-28 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-16">
          Your audience, re-imagined as lifelike personas.
        </h2>
        
        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title} 
                className="flex flex-col items-center bg-[#FAFAFA] rounded-2xl border border-gray-100 p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
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
        <p className="text-xs text-gray-400 font-light">
          No metrics noise. No ambiguity. Just clarity.
        </p>
      </div>
    </section>
  );
}