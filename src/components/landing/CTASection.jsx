import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from './useScrollReveal';

export default function CTASection() {
  const [sectionRef, isVisible] = useScrollReveal(0.2);

  return (
    <section className="py-28 px-6 bg-white">
      <div ref={sectionRef} className="max-w-2xl mx-auto text-center">
        {/* Headline */}
        <h2 
          className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Simulate everything.
        </h2>
        
        {/* CTA Button */}
        <Link 
          to={createPageUrl('SimulationResults')}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all duration-150 ease-out hover:scale-[1.02] hover:-translate-y-0.5 mb-5"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, scale 0.15s ease-out',
          }}
        >
          Start Simulation
          <ArrowRight className="w-4 h-4" />
        </Link>
        
        {/* Subtext */}
        <p 
          className="text-xs text-gray-400 font-light"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          No credit card required.
        </p>
      </div>
    </section>
  );
}