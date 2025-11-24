import React, { useState } from 'react';
import { Play } from 'lucide-react';
import PersonaCard from './PersonaCard';

const mockPersonas = [
  { 
    id: 1, 
    name: 'Fashion Student', 
    tags: ['fashion', 'trendy', 'bold'], 
    watchTime: '2.9s', 
    engagement: 48, 
    insight: 'Low engagement, likely early swipe',
    like: 45, comment: 12, share: 18, save: 22, follow: 8
  },
  { 
    id: 2, 
    name: 'Tech Enthusiast', 
    tags: ['tech', 'gadgets', 'reviews'], 
    watchTime: '8.2s', 
    engagement: 82, 
    insight: 'High retention, likely to comment',
    like: 85, comment: 62, share: 48, save: 71, follow: 45
  },
  { 
    id: 3, 
    name: 'Fitness Coach', 
    tags: ['fitness', 'health', 'motivation'], 
    watchTime: '5.4s', 
    engagement: 67, 
    insight: 'Moderate engagement, may share',
    like: 68, comment: 34, share: 55, save: 42, follow: 28
  },
  { 
    id: 4, 
    name: 'Creative Director', 
    tags: ['design', 'aesthetic', 'minimal'], 
    watchTime: '12.1s', 
    engagement: 94, 
    insight: 'Very high retention, core audience',
    like: 92, comment: 78, share: 65, save: 88, follow: 72
  },
  { 
    id: 5, 
    name: 'College Student', 
    tags: ['lifestyle', 'budget', 'fun'], 
    watchTime: '3.8s', 
    engagement: 52, 
    insight: 'Average engagement, passive viewer',
    like: 55, comment: 18, share: 32, save: 28, follow: 12
  },
  { 
    id: 6, 
    name: 'Young Professional', 
    tags: ['career', 'growth', 'hustle'], 
    watchTime: '6.7s', 
    engagement: 74, 
    insight: 'Good retention, may follow',
    like: 76, comment: 42, share: 51, save: 58, follow: 35
  },
  { 
    id: 7, 
    name: 'Stay-at-home Parent', 
    tags: ['family', 'tips', 'relatable'], 
    watchTime: '4.2s', 
    engagement: 58, 
    insight: 'Moderate interest, occasional like',
    like: 62, comment: 25, share: 38, save: 35, follow: 18
  },
  { 
    id: 8, 
    name: 'Gen Z Trendsetter', 
    tags: ['viral', 'memes', 'culture'], 
    watchTime: '7.5s', 
    engagement: 79, 
    insight: 'High engagement, likely to share',
    like: 82, comment: 55, share: 72, save: 48, follow: 42
  },
  { 
    id: 9, 
    name: 'Small Business Owner', 
    tags: ['entrepreneur', 'marketing', 'tips'], 
    watchTime: '9.3s', 
    engagement: 88, 
    insight: 'Very engaged, likely to save',
    like: 88, comment: 68, share: 58, save: 82, follow: 55
  },
  { 
    id: 10, 
    name: 'Art Student', 
    tags: ['art', 'creative', 'visual'], 
    watchTime: '2.1s', 
    engagement: 35, 
    insight: 'Quick scroll, not target audience',
    like: 32, comment: 8, share: 12, save: 15, follow: 5
  },
  { 
    id: 11, 
    name: 'Music Producer', 
    tags: ['audio', 'beats', 'creative'], 
    watchTime: '5.8s', 
    engagement: 63, 
    insight: 'Niche interest, moderate retention',
    like: 65, comment: 28, share: 42, save: 48, follow: 22
  },
  { 
    id: 12, 
    name: 'Travel Blogger', 
    tags: ['travel', 'adventure', 'lifestyle'], 
    watchTime: '4.5s', 
    engagement: 56, 
    insight: 'Interested but not core audience',
    like: 58, comment: 22, share: 45, save: 38, follow: 15
  },
];

// Calculate position based on engagement (higher = closer to center)
const calculatePosition = (engagement, index, total) => {
  // Distance from center: high engagement = small distance, low engagement = large distance
  const maxDistance = 42; // percentage from center
  const minDistance = 12; // percentage from center
  const distance = maxDistance - ((engagement / 100) * (maxDistance - minDistance));
  
  // Spread personas around the circle with some randomness
  const baseAngle = (index / total) * 2 * Math.PI;
  const angleOffset = (Math.random() - 0.5) * 0.5; // slight random offset
  const angle = baseAngle + angleOffset;
  
  // Convert polar to cartesian (centered at 50%, 50%)
  const x = 50 + distance * Math.cos(angle);
  const y = 50 + distance * Math.sin(angle);
  
  return { x, y, distance };
};

// Pre-calculate positions with seeded randomness for consistency
const personasWithPositions = mockPersonas.map((persona, index) => {
  const maxDistance = 42;
  const minDistance = 12;
  const distance = maxDistance - ((persona.engagement / 100) * (maxDistance - minDistance));
  
  // Deterministic angle based on index with slight variation based on engagement
  const baseAngle = (index / mockPersonas.length) * 2 * Math.PI;
  const angleOffset = ((persona.engagement % 20) - 10) / 50;
  const angle = baseAngle + angleOffset;
  
  const x = 50 + distance * Math.cos(angle);
  const y = 50 + distance * Math.sin(angle);
  
  return { ...persona, x, y, distance };
});

// Get dot color based on engagement (higher = darker)
const getDotColor = (engagement) => {
  // Map engagement (0-100) to grayscale (lighter to darker)
  // Low engagement = light gray, High engagement = near black
  const lightness = 85 - (engagement * 0.7); // Range from ~85 (light) to ~15 (dark)
  return `hsl(0, 0%, ${lightness}%)`;
};

// Get dot size based on engagement
const getDotSize = (engagement) => {
  const minSize = 8;
  const maxSize = 28;
  return minSize + ((engagement / 100) * (maxSize - minSize));
};

export default function GravityOrbit({ onPersonaSelect, selectedPersona }) {
  const [hoveredPersona, setHoveredPersona] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  const activePersona = hoveredPersona || selectedPersona;

  const handlePersonaHover = (persona, e) => {
    if (!persona) {
      setHoveredPersona(null);
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = e.currentTarget.closest('.orbit-container').getBoundingClientRect();
    
    setCardPosition({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top
    });
    setHoveredPersona(persona);
  };

  const handlePersonaClick = (persona) => {
    onPersonaSelect(persona);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center orbit-container">
      {/* Radial glow background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 30%, transparent 60%)',
        }}
      />
      
      {/* Orbit visualization container */}
      <div className="relative w-full max-w-[480px] aspect-square">
        
        {/* Subtle orbit rings */}
        <div className="absolute inset-[15%] rounded-full border border-gray-100 opacity-40" />
        <div className="absolute inset-[30%] rounded-full border border-gray-100 opacity-30" />
        <div className="absolute inset-[42%] rounded-full border border-gray-100 opacity-20" />
        
        {/* Central play button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm z-10">
          <Play className="w-5 h-5 text-gray-500 ml-0.5" fill="currentColor" />
        </div>

        {/* Persona dots */}
        {personasWithPositions.map((persona) => {
          const size = getDotSize(persona.engagement);
          const color = getDotColor(persona.engagement);
          const isSelected = selectedPersona?.id === persona.id;
          
          return (
            <button
              key={persona.id}
              onMouseEnter={(e) => handlePersonaHover(persona, e)}
              onMouseLeave={() => handlePersonaHover(null)}
              onClick={() => handlePersonaClick(persona)}
              className={`absolute rounded-full transition-all duration-500 cursor-pointer hover:scale-110 ${
                isSelected ? 'ring-2 ring-gray-400 ring-offset-2' : ''
              }`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${persona.x}%`,
                top: `${persona.y}%`,
                backgroundColor: color,
                transform: 'translate(-50%, -50%)',
                animation: `float-${persona.id % 3} ${8 + (persona.id % 4)}s ease-in-out infinite`,
              }}
            />
          );
        })}

        {/* Floating persona card */}
        {activePersona && (
          <PersonaCard 
            persona={activePersona} 
            position={cardPosition}
          />
        )}
      </div>

      {/* Subtle floating animation keyframes */}
      <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-3px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(-50%, -50%) translateX(0px); }
          50% { transform: translate(-50%, -50%) translateX(3px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          50% { transform: translate(-50%, -50%) translate(2px, -2px); }
        }
      `}</style>
    </div>
  );
}

export { mockPersonas, personasWithPositions };