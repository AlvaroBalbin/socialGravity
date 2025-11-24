import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Clock, MessageSquare } from 'lucide-react';

const cards = [
  {
    icon: TrendingUp,
    title: 'Overall Match',
    description: 'A clean score that shows how well the video fits each persona.',
    visual: (
      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-[72%] bg-gray-800 rounded-full" />
        </div>
        <span className="text-xs font-medium text-gray-700">72%</span>
      </div>
    ),
  },
  {
    icon: Clock,
    title: 'Attention Metrics',
    description: 'Predicted watch time, swipe probability, retention curve — simplified preview.',
    visual: (
      <div className="flex items-end gap-0.5 mt-4 h-6">
        {[85, 78, 70, 62, 55, 48, 42, 35].map((v, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-700 rounded-sm"
            style={{ height: `${v}%`, opacity: 0.4 + (v / 100) * 0.5 }}
          />
        ))}
      </div>
    ),
  },
  {
    icon: MessageSquare,
    title: 'Qualitative Insights',
    description: 'Clear, human-like explanations of what worked and what didn\'t.',
    visual: (
      <div className="mt-4 space-y-1.5">
        <div className="h-1.5 bg-gray-100 rounded-full w-full" />
        <div className="h-1.5 bg-gray-100 rounded-full w-4/5" />
        <div className="h-1.5 bg-gray-100 rounded-full w-3/5" />
      </div>
    ),
  },
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

export default function InsightPreviewSection() {
  const [headingRef, headingInView] = useInView();
  const [cardsRef, cardsInView] = useInView();

  return (
    <section id="intelligence" className="py-20 px-6 bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto">
        <h2 
          ref={headingRef}
          className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight text-center mb-12"
          style={{
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          See How Your Content Performs at a Glance
        </h2>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.title}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm transition-all duration-150 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg"
                style={{
                  opacity: cardsInView ? 1 : 0,
                  transform: cardsInView ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, box-shadow 0.15s ease-out`,
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4"
                  style={{
                    opacity: cardsInView ? 1 : 0,
                    transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1 + 0.1}s`,
                  }}
                >
                  <Icon className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">{card.title}</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {card.description}
                </p>
                {card.visual}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}