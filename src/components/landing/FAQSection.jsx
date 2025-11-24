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
              className="text-sm text-gray-500 font-light leading-relaxed"
              style={{
                opacity: titleInView ? 1 : 0,
                transform: titleInView ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s',
              }}
            >
              Still have questions? Feel free to contact our team.
            </p>

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
          {/* Arrow and Contact Button - Bottom Left, aligned with accordion bottom */}
          <div 
            className="flex flex-col items-start justify-end"
            style={{
              opacity: titleInView ? 1 : 0,
              transform: titleInView ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.24s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.24s',
            }}
          >
            <ChevronDown className="w-5 h-5 text-gray-300 mb-3 animate-bounce" />
            <button
              onClick={() => {
                document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
            >
              Reach out to the Founders
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}