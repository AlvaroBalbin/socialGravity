import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
      style={{
        padding: scrolled ? '12px 24px' : '20px 24px',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to={createPageUrl('Landing')}
          className="text-lg font-medium text-gray-900 tracking-tight transition-all duration-300"
          style={{
            fontSize: scrolled ? '16px' : '18px',
          }}
        >
          Social Gravity
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#resonance" 
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light"
          >
            About
          </a>
          <a 
            href="#intelligence" 
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light"
          >
            Intelligence
          </a>
          <a 
            href="#use-cases" 
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light"
          >
            Use Cases
          </a>
          <a 
            href="#faq" 
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light"
          >
            FAQ
          </a>
        </nav>

        {/* CTA */}
        <Link
          to={createPageUrl('SimulationResults')}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all duration-300"
          style={{
            padding: scrolled ? '8px 16px' : '10px 20px',
            fontSize: scrolled ? '13px' : '14px',
          }}
        >
          Try It Free
        </Link>
      </div>
    </header>
  );
}