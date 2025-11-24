import React from 'react';

// Persona info box component
function PersonaInfoBox({ name, score, attention, style }) {
  return (
    <div className="absolute pointer-events-none" style={style}>
      {/* Card */}
      <div 
        className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-100/50"
        style={{
          width: '140px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
        }}
      >
        <p className="text-[11px] font-medium text-gray-800 leading-tight mb-0.5">{name}</p>
        <p className="text-[10px] text-gray-500 leading-tight">Score: {score}</p>
        <p className="text-[10px] text-gray-400 leading-tight">{attention}</p>
      </div>
      {/* Connector stem */}
      <div className="w-px h-8 mx-auto" style={{ backgroundColor: '#D3D6DB' }} />
    </div>
  );
}

function ShowcaseOrbit() {
  // 12 persona dots with orbital properties
  const dots = [
    { distance: 32, angle: 30, size: 'large', color: '#3E4248', duration: 32, hasCard: true, cardInfo: { name: 'Trend-Seeker', score: 74, attention: 'Full' } },
    { distance: 42, angle: 70, size: 'medium', color: '#7C8288', duration: 30 },
    { distance: 24, angle: 110, size: 'large', color: '#3E4248', duration: 34 },
    { distance: 44, angle: 150, size: 'small', color: '#B3B9BF', duration: 28, hasCard: true, cardInfo: { name: 'Nature Lover', score: 37, attention: 'Weak' } },
    { distance: 28, angle: 190, size: 'medium', color: '#7C8288', duration: 32 },
    { distance: 38, angle: 230, size: 'large', color: '#3E4248', duration: 30 },
    { distance: 46, angle: 270, size: 'small', color: '#B3B9BF', duration: 36 },
    { distance: 36, angle: 310, size: 'medium', color: '#7C8288', duration: 28, hasCard: true, cardInfo: { name: 'Night Owl', score: 68, attention: 'Partial' } },
    { distance: 22, angle: 350, size: 'large', color: '#3E4248', duration: 34 },
    { distance: 48, angle: 50, size: 'small', color: '#B3B9BF', duration: 32 },
    { distance: 26, angle: 170, size: 'medium', color: '#7C8288', duration: 30 },
    { distance: 45, angle: 250, size: 'small', color: '#B3B9BF', duration: 28 },
  ];

  // Size classes (35-45% larger)
  const sizes = {
    small: 14,
    medium: 20,
    large: 26,
  };

  return (
    <div className="relative w-full max-w-xl aspect-square mx-auto">
      {/* Soft ambient glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.015) 0%, transparent 50%)',
        }}
      />
      
      {/* Concentric orbit rings (5-8% opacity) */}
      <div className="absolute inset-[12%] rounded-full border border-gray-300" style={{ opacity: 0.08 }} />
      <div className="absolute inset-[22%] rounded-full border border-gray-300" style={{ opacity: 0.07 }} />
      <div className="absolute inset-[32%] rounded-full border border-gray-300" style={{ opacity: 0.06 }} />
      <div className="absolute inset-[42%] rounded-full border border-gray-300" style={{ opacity: 0.05 }} />
      
      {/* Central Video Icon - fixed and still */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-xl flex items-center justify-center z-10"
        style={{
          border: '1px solid #DDE1E5',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06), 0 0 24px rgba(0,0,0,0.04)',
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
        const size = sizes[dot.size];
        
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: `${dot.distance * 2}%`,
              height: `${dot.distance * 2}%`,
              marginLeft: `-${dot.distance}%`,
              marginTop: `-${dot.distance}%`,
              animation: `orbitShowcase ${dot.duration}s linear infinite`,
              animationDelay: `-${(dot.angle / 360) * dot.duration}s`,
            }}
          >
            {/* Persona info card - stays upright */}
            {dot.hasCard && (
              <div
                className="absolute"
                style={{
                  left: '100%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: `counterOrbitShowcase ${dot.duration}s linear infinite`,
                  animationDelay: `-${(dot.angle / 360) * dot.duration}s`,
                }}
              >
                <PersonaInfoBox 
                  name={dot.cardInfo.name}
                  score={dot.cardInfo.score}
                  attention={dot.cardInfo.attention}
                  style={{
                    left: '50%',
                    bottom: `${size / 2 + 4}px`,
                    transform: 'translateX(-50%)',
                  }}
                />
              </div>
            )}
            
            {/* The dot itself */}
            <div
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: dot.color,
                left: '100%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                animation: `wobbleShowcase ${6 + i * 0.3}s ease-in-out infinite, breatheShowcase ${5 + i * 0.2}s ease-in-out infinite`,
              }}
            />
          </div>
        );
      })}
      
      <style>{`
        @keyframes orbitShowcase {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes counterOrbitShowcase {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        
        @keyframes wobbleShowcase {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          25% { transform: translate(-50%, -50%) translate(1px, -0.5px); }
          50% { transform: translate(-50%, -50%) translate(-0.5px, 1px); }
          75% { transform: translate(-50%, -50%) translate(-1px, -0.5px); }
        }
        
        @keyframes breatheShowcase {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.02); }
        }
      `}</style>
    </div>
  );
}

export default function OrbitShowcaseSection() {
  return (
    <section className="py-20 px-6 pb-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-5">
            A new way to "see" resonance.
          </h2>
          <p className="text-sm text-gray-500 font-light max-w-md mx-auto leading-relaxed">
            Each dot represents a persona.<br />
            Closer means higher engagement.<br />
            Darker means stronger pull.<br />
            The orbit becomes your creative compass.
          </p>
        </div>
        
        {/* Visual */}
        <ShowcaseOrbit />
      </div>
    </section>
  );
}