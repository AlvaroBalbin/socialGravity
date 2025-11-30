import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is Social Gravity?',
    answer:
      'Social Gravity lets you test your content before you post it. Your audience is recreated as thousands of lifelike personas, and your video is run through them to show how people are likely to watch, react and drop off. You get clarity on performance long before it hits a feed.',
  },
  {
    question: 'How are the personas created?',
    answer:
      'Each persona draws from patterns found in real audience behaviour. They have different interests, attention styles and emotional tendencies. They respond uniquely to pacing, hooks, framing and energy. When you test a video, you see how a full digital crowd of distinct personalities responds to your idea.',
  },
  {
    question: 'What does the orbit visual mean?',
    answer:
      'Every dot represents a persona in your simulated audience. Dots that drift toward the centre are drawn in by your content. Dots that darken care more deeply. The whole orbit shows how your audience moves, clusters and shifts as your video unfolds, turning engagement and emotion into a living visual that is instantly readable.',
  },
  {
    question: 'How reliable are the predictions?',
    answer:
      'Each persona follows internal behavioural patterns that guide attention, interest and pacing. Because these patterns stay consistent, your simulations feel stable and believable. When you tweak your content, the changes in audience behaviour follow naturally, giving you a trustworthy sense of how real people might respond.',
  },
];

function useInView() {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

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
        <span className="text-sm font-medium text-gray-900 pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isOpen ? '400px' : '0px',
          opacity: isOpen ? 1 : 0,
          transition:
            'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out',
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
                transition:
                  'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Welcome to the future of content and creativity.
            </h2>
            <p
              className="text-sm text-gray-500 font-light leading-relaxed"
              style={{
                opacity: titleInView ? 1 : 0,
                transform: titleInView ? 'translateY(0)' : 'translateY(10px)',
                transition:
                  'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s',
              }}
            >
              Still have questions? Feel free to contact our team.
            </p>

            {/* Arrow and Contact Button */}
            <div
              className="flex flex-col items-start mt-8"
              style={{
                opacity: titleInView ? 1 : 0,
                transform: titleInView ? 'translateY(0)' : 'translateY(10px)',
                transition:
                  'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.16s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.16s',
              }}
            >
              <ChevronDown className="w-5 h-5 text-gray-300 mb-3 animate-bounce" />
              <button
                onClick={() => {
                  document
                    .getElementById('footer')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
              >
                Reach out to the Founders
              </button>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div
            ref={accordionRef}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
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
