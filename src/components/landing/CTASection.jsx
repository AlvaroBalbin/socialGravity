import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';
import SimulationModal from '@/components/simulation/SimulationModal';

export default function CTASection({ onRunSimulation }) {
  const handleClick = () => {
    if (onRunSimulation) onRunSimulation();
  };

  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-8">
          Simulate everything.
        </h2>

        {/* CTA Button */}
        <div>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors mb-5"
          >
            Start Simulation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subtext */}
        <p className="text-xs text-gray-400 font-light">
          Try it free for now.
        </p>
      </div>
    </section>
  );
}