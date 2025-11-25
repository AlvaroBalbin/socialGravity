import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';
import SimulationModal from '@/components/simulation/SimulationModal';

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
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSimulationComplete = (data) => {
    setShowModal(false);
    sessionStorage.setItem('simulationData', JSON.stringify({
      audienceDescription: data.audienceDescription,
      videoFileName: data.videoFile?.name,
    }));
    navigate(createPageUrl('SimulationResults'));
  };

  return (
    <section ref={sectionRef} className="py-28 px-6 bg-white">
      <SimulationModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onComplete={handleSimulationComplete}
      />
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
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors mb-5"
          >
            Start Simulation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Subtext */}
        <p 
          className="text-xs text-gray-400 font-light"
          style={{
            opacity: isInView ? 1 : 0,
            transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          Try it free for now.
        </p>
      </div>
    </section>
  );
}