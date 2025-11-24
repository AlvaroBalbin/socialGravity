import React from 'react';
import StickyHeader from '@/components/landing/StickyHeader';
import HeroSection from '@/components/landing/HeroSection';
import WhatItDoesSection from '@/components/landing/WhatItDoesSection';
import OrbitShowcaseSection from '@/components/landing/OrbitShowcaseSection';
import InsightPreviewSection from '@/components/landing/InsightPreviewSection';
import WhyItMattersSection from '@/components/landing/WhyItMattersSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <StickyHeader />
      <HeroSection />
              <OrbitShowcaseSection />
              <WhatItDoesSection />
              <InsightPreviewSection />
      <WhyItMattersSection />
              <FAQSection />
              <CTASection />
      <Footer />
    </div>
  );
}