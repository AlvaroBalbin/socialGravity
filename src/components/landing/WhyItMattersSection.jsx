import React from 'react';

const benefits = [
  'Avoid posting flops',
  'Test bold ideas safely',
  'Improve pacing and hooks',
  'Tailor content to persona clusters',
  'Build consistent performance',
  'De-risk brand deals',
];

export default function WhyItMattersSection() {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-14">
          Make creative decisions with confidence.
        </h2>
        
        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 max-w-xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="text-sm text-gray-600 font-light">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}