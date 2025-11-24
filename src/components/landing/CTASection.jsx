import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

function useInView() {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
}

export default function CTASection() {
  const [sectionRef, isInView] = useInView();

  return (
    <section ref={sectionRef} className="py-28 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        {/* Headline */}
        <h2 
          className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-8"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Simulate everything.
        </h2>
        
        {/* CTA Button */}
        <div
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          <Link 
            to={createPageUrl('SimulationResults')}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors mb-5"
          >
            Start Simulation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Subtext */}
        <p 
          className="text-xs text-gray-400 font-light"
          style={{
            opacity: isInView ? 1 : 0,
            transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          No credit card required.
        </p>
      </div>
    </section>
  );
}