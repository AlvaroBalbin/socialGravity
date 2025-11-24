import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
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

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
      >
        <span className="text-sm text-gray-900 font-normal pr-4">{question}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <p className="text-sm text-gray-500 font-light leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* FAQ Badge */}
        <div className="flex justify-center mb-16">
          <span className="px-5 py-2 border border-gray-700 rounded-full text-xs text-gray-300 tracking-wide">
            FAQ
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Title & Subtitle */}
          <div className="lg:pr-8">
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-6 leading-tight">
              This is the future of content and creativity.
            </h2>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              We're answering your big questions.<br />
              Still have questions? Feel free to reach out.
            </p>
          </div>

          {/* Right Column - Accordion */}
          <div className="bg-white rounded-2xl p-6 md:p-8">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}