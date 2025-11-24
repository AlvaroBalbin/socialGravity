import React, { useEffect, useRef, useState } from 'react';

const benefits = [
  'Avoid posting flops',
  'Test bold ideas safely',
  'Improve pacing and hooks',
  'Tailor content to persona clusters',
  'Build consistent performance',
  'De-risk brand deals',
];

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

export default function WhyItMattersSection() {
  const [headingRef, headingInView] = useInView();
  const [benefitsRef, benefitsInView] = useInView();

  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h2 
          ref={headingRef}
          className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-14"
          style={{
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Make creative decisions with confidence.
        </h2>
        
        {/* Benefits grid */}
        <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 max-w-xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3"
              style={{
                opacity: benefitsInView ? 1 : 0,
                transform: benefitsInView ? 'translateY(0)' : 'translateY(6px)',
                transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.07}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.07}s`,
              }}
            >
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="text-sm text-gray-600 font-light">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}