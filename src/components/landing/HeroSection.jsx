import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';
import SimulationModal from '@/components/simulation/SimulationModal';

// Mini info card component
function MiniInfoCard({ name, score, attention, style }) {
  return (
    <div 
      className="absolute pointer-events-none"
      style={style}
    >
      {/* Card */}
      <div 
        className="bg-white/75 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-100/50"
        style={{
          animation: 'cardFloat 3s ease-in-out infinite',
        }}
      >
        <p className="text-[9px] font-medium text-gray-800 leading-tight">{name}</p>
        <p className="text-[8px] text-gray-500 leading-tight">Score: {score}</p>
        <p className="text-[8px] text-gray-400 leading-tight">{attention}</p>
      </div>
      {/* Connector stem */}
      <div className="w-px h-3 bg-gray-300/60 mx-auto" />
    </div>
  );
}

// Mini orbit visual for hero
function HeroOrbit() {
  // Dots with orbital properties: distance from center, initial angle, size class, orbit duration (slowed 50%)
  const dots = [
    { distance: 28, angle: 0, sizeClass: 'large', duration: 28, hasCard: true, cardInfo: { name: 'Trend-Seeker', score: 76, attention: 'Full' } },
    { distance: 38, angle: 40, sizeClass: 'medium', duration: 32 },
    { distance: 22, angle: 85, sizeClass: 'large', duration: 26, hasCard: true, cardInfo: { name: 'Cozy Explorer', score: 84, attention: 'Partial' } },
    { distance: 42, angle: 130, sizeClass: 'small', duration: 36 },
    { distance: 32, angle: 175, sizeClass: 'medium', duration: 30 },
    { distance: 45, angle: 220, sizeClass: 'small', duration: 38 },
    { distance: 25, angle: 265, sizeClass: 'large', duration: 25, hasCard: true, cardInfo: { name: 'Night Owl', score: 61, attention: 'Skim' } },
    { distance: 40, angle: 310, sizeClass: 'medium', duration: 34 },
    { distance: 35, angle: 355, sizeClass: 'small', duration: 33 },
  ];

  // Size classes (40-60% larger than before)
  const sizes = {
    small: 16,
    medium: 22,
    large: 28,
  };

  // Color based on distance (closer = darker)
  const getColor = (distance) => {
    const lightness = 35 + (distance - 20) * 1.2; // 35-65% lightness range
    return `hsl(220, 5%, ${lightness}%)`;
  };

  return (
    <div className="relative w-full max-w-[650px] aspect-[1.6/1] mx-auto">
      {/* Soft ambient glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.018) 0%, transparent 45%)',
        }}
      />
      
      {/* Subtle orbit rings - elliptical for wider spread */}
      <div className="absolute inset-x-[15%] inset-y-[20%] rounded-full border border-gray-100/50" />
      <div className="absolute inset-x-[25%] inset-y-[30%] rounded-full border border-gray-100/40" />
      <div className="absolute inset-x-[35%] inset-y-[38%] rounded-full border border-gray-100/30" />
      
      {/* Central Video Icon */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-xl flex items-center justify-center z-10"
        style={{
          border: '1px solid #DDE1E5',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06), 0 0 20px rgba(0,0,0,0.03)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path 
            d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" 
            fill="#9CA3AF"
          />
        </svg>
      </div>
      
      {/* Orbiting Dots */}
      {dots.map((dot, i) => {
        const size = sizes[dot.sizeClass];
        const color = getColor(dot.distance);

        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: `${dot.distance * 2}%`,
              height: `${dot.distance * 2}%`,
              marginLeft: `-${dot.distance}%`,
              marginTop: `-${dot.distance}%`,
              animation: `orbit ${dot.duration}s ease-in-out infinite`,
              animationDelay: `-${(dot.angle / 360) * dot.duration}s`,
            }}
          >
            {/* Mini info card if this dot has one */}
            {dot.hasCard && (
              <MiniInfoCard 
                name={dot.cardInfo.name}
                score={dot.cardInfo.score}
                attention={dot.cardInfo.attention}
                style={{
                  left: '100%',
                  top: '50%',
                  transform: 'translate(-50%, -100%) translateY(-${size/2}px)',
                  marginTop: `-${size/2 + 2}px`,
                }}
              />
            )}
            <div
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                left: '100%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset`,
                animation: `wobble-${i % 3} ${3 + (i * 0.3)}s ease-in-out infinite, pulse ${4 + (i * 0.2)}s ease-in-out infinite`,
              }}
            />
          </div>
        );
      })}
      
      <style>{`
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes wobble-0 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          25% { transform: translate(-50%, -50%) translate(2px, -1px); }
          50% { transform: translate(-50%, -50%) translate(-1px, 2px); }
          75% { transform: translate(-50%, -50%) translate(-2px, -1px); }
        }
        @keyframes wobble-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          33% { transform: translate(-50%, -50%) translate(-2px, 1px); }
          66% { transform: translate(-50%, -50%) translate(1px, -2px); }
        }
        @keyframes wobble-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          50% { transform: translate(-50%, -50%) translate(2px, 2px); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.02); opacity: 0.92; }
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}

export default function HeroSection({ onRunSimulation }) {
  const handleClick = () => {
    if (onRunSimulation) onRunSimulation();
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight mb-6"
          style={{
            animation: "heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            opacity: 0,
          }}
        >
          Predict Engagement.
          <br />
          <span className="text-gray-400">Before you post.</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="text-base md:text-lg text-gray-500 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{
            animation:
              "heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.08s forwards",
            opacity: 0,
          }}
        >
          AI simulates how different personas react to your content — so creators
          can predict performance with clarity, not guesswork.
        </p>

        {/* CTAs */}
        <div
          className="flex items-center justify-center gap-6 mb-16"
          style={{
            animation:
              "heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.16s forwards",
            opacity: 0,
          }}
        >
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Try Simulation
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#what-it-does"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Learn More
          </a>
        </div>

        <style>{`
          @keyframes heroFadeUp {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </section>
  );
}