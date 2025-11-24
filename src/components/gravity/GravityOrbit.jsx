import React, { useState } from 'react';
import { Play } from 'lucide-react';
import PersonaCard from './PersonaCard';

const mockPersonas = [
  { id: 1, name: 'Fashion Student', tags: ['fashion', 'trendy', 'bold'], watchTime: '2.9s', engagement: '48%', insight: 'Low engagement, likely early swipe', x: 58, y: 18, size: 12, opacity: 0.4 },
  { id: 2, name: 'Tech Enthusiast', tags: ['tech', 'gadgets', 'reviews'], watchTime: '8.2s', engagement: '82%', insight: 'High retention, likely to comment', x: 38, y: 12, size: 14, opacity: 0.5 },
  { id: 3, name: 'Fitness Coach', tags: ['fitness', 'health', 'motivation'], watchTime: '5.4s', engagement: '67%', insight: 'Moderate engagement, may share', x: 18, y: 28, size: 10, opacity: 0.35 },
  { id: 4, name: 'Creative Director', tags: ['design', 'aesthetic', 'minimal'], watchTime: '12.1s', engagement: '91%', insight: 'Very high retention, core audience', x: 28, y: 38, size: 20, opacity: 0.9 },
  { id: 5, name: 'College Student', tags: ['lifestyle', 'budget', 'fun'], watchTime: '3.8s', engagement: '52%', insight: 'Average engagement, passive viewer', x: 22, y: 52, size: 16, opacity: 0.6 },
  { id: 6, name: 'Young Professional', tags: ['career', 'growth', 'hustle'], watchTime: '6.7s', engagement: '74%', insight: 'Good retention, may follow', x: 35, y: 62, size: 28, opacity: 1 },
  { id: 7, name: 'Stay-at-home Parent', tags: ['family', 'tips', 'relatable'], watchTime: '4.2s', engagement: '58%', insight: 'Moderate interest, occasional like', x: 55, y: 58, size: 22, opacity: 0.85 },
  { id: 8, name: 'Gen Z Trendsetter', tags: ['viral', 'memes', 'culture'], watchTime: '7.5s', engagement: '79%', insight: 'High engagement, likely to share', x: 68, y: 42, size: 18, opacity: 0.75 },
  { id: 9, name: 'Small Business Owner', tags: ['entrepreneur', 'marketing', 'tips'], watchTime: '9.3s', engagement: '85%', insight: 'Very engaged, likely to save', x: 62, y: 28, size: 14, opacity: 0.55 },
  { id: 10, name: 'Art Student', tags: ['art', 'creative', 'visual'], watchTime: '2.1s', engagement: '35%', insight: 'Quick scroll, not target audience', x: 75, y: 55, size: 8, opacity: 0.3 },
];

export default function GravityOrbit() {
  const [activePersona, setActivePersona] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  const handlePersonaClick = (persona, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = e.currentTarget.parentElement.getBoundingClientRect();
    
    setCardPosition({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top
    });
    setActivePersona(activePersona?.id === persona.id ? null : persona);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
      {/* Orbit visualization container */}
      <div className="relative w-full max-w-[500px] aspect-square">
        
        {/* Central play button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center shadow-sm z-10">
          <Play className="w-6 h-6 text-gray-600 ml-1" fill="currentColor" />
        </div>

        {/* Persona dots */}
        {mockPersonas.map((persona) => (
          <button
            key={persona.id}
            onClick={(e) => handlePersonaClick(persona, e)}
            className="absolute rounded-full bg-gray-900 transition-all duration-300 hover:scale-125 cursor-pointer"
            style={{
              width: `${persona.size}px`,
              height: `${persona.size}px`,
              left: `${persona.x}%`,
              top: `${persona.y}%`,
              opacity: persona.opacity,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Floating persona card */}
        {activePersona && (
          <PersonaCard 
            persona={activePersona} 
            position={cardPosition}
            onClose={() => setActivePersona(null)}
          />
        )}
      </div>
    </div>
  );
}