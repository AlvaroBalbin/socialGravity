import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does the simulation actually work?',
    answer: 'Our system generates AI personas trained on diverse behavioural, emotional, and cultural patterns. When you upload content, the personas "react" to it — scoring attention, resonance, sentiment, and predicted engagement. You get a realistic preview of how different audience types might respond before you post.',
  },
  {
    question: 'What makes these personas accurate?',
    answer: 'Each persona blends demographic signals, behavioural traits, and psychographic tendencies drawn from large-scale data patterns. They aren\'t copies of real people, but they\'re designed to behave like real segments — capturing trends in taste, attention, and emotional pull.',
  },
  {
    question: 'What does the resonance orbit represent?',
    answer: 'The orbit visual shows how strongly your content connects with each persona. Closer dots represent higher engagement; darker dots show deeper emotional pull. It\'s a simple, visual way to understand performance at a glance.',
  },
  {
    question: 'Can I choose which personas to simulate against?',
    answer: 'Yes. You can run your video across your full Artificial Society or select specific persona groups that match your target audience — such as trend-seekers, skeptics, analysts, creators, early adopters, or niche clusters.',
  },
  {
    question: 'How reliable are the performance predictions?',
    answer: 'While no model can guarantee real-world outcomes, our simulations capture the core patterns: attention likelihood, emotional resonance, shareability, and potential pitfalls. Creators use this to remove guesswork, avoid weak posts, and make clearer, more confident creative decisions.',
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

function AccordionItem({ question, answer, isOpen, onClick, delay, isInView }) {
  return (
    <div 
      className="border-b border-gray-100 last:border-b-0"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div 
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isOpen ? '400px' : '0px',
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out',
        }}
      >
        <p className="text-sm text-gray-500 font-light leading-relaxed pr-8 pb-5">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [titleRef, titleInView] = useInView();
  const [accordionRef, accordionInView] = useInView();

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Left Column - Title & Subtitle */}
          <div ref={titleRef}>
            <h2 
              className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-4"
              style={{
                opacity: titleInView ? 1 : 0,
                transform: titleInView ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Welcome to the future of content and creativity.
            </h2>
            <p 
              className="text-sm text-gray-500 font-light leading-relaxed mb-10"
              style={{
                opacity: titleInView ? 1 : 0,
                transform: titleInView ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s',
              }}
            >
              Still have questions? Feel free to contact our team.
            </p>

            {/* Orbit Visual */}
            <div 
              className="relative w-full h-56 mt-4"
              style={{
                opacity: titleInView ? 1 : 0,
                transform: titleInView ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.16s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.16s',
              }}
            >
              {/* Central icon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm z-10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" fill="#9CA3AF"/>
                </svg>
              </div>
              
              {/* Orbiting dots */}
              {[
                { distance: 42, angle: 20, size: 14, color: '#4B5563', duration: 22 },
                { distance: 35, angle: 90, size: 11, color: '#6B7280', duration: 18 },
                { distance: 48, angle: 150, size: 8, color: '#9CA3AF', duration: 26 },
                { distance: 30, angle: 220, size: 12, color: '#4B5563', duration: 16 },
                { distance: 44, angle: 280, size: 9, color: '#6B7280', duration: 24 },
                { distance: 38, angle: 340, size: 10, color: '#9CA3AF', duration: 20 },
                { distance: 26, angle: 60, size: 7, color: '#6B7280', duration: 14 },
              ].map((dot, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 pointer-events-none"
                  style={{
                    width: `${dot.distance * 2.5}%`,
                    height: `${dot.distance * 2}%`,
                    marginLeft: `-${dot.distance * 1.25}%`,
                    marginTop: `-${dot.distance}%`,
                    animation: `faqOrbit ${dot.duration}s linear infinite`,
                    animationDelay: `-${(dot.angle / 360) * dot.duration}s`,
                  }}
                >
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: `${dot.size}px`,
                      height: `${dot.size}px`,
                      backgroundColor: dot.color,
                      left: '100%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    }}
                  />
                </div>
              ))}
              
              <style>{`
                @keyframes faqOrbit {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div ref={accordionRef} className="bg-white rounded-2xl border border-gray-100 p-6">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
                delay={index * 0.07}
                isInView={accordionInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}