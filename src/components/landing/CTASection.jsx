import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-8">
          Simulate everything.
        </h2>
        
        {/* CTA Button */}
        <Link 
          to={createPageUrl('SimulationResults')}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors mb-5"
        >
          Start Simulation
          <ArrowRight className="w-4 h-4" />
        </Link>
        
        {/* Subtext */}
        <p className="text-xs text-gray-400 font-light">
          No credit card required.
        </p>
      </div>
    </section>
  );
}