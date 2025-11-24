import React, { useState } from 'react';
import { Play } from 'lucide-react';
import PersonaCard from './PersonaCard';

const mockPersonas = [
  { 
    id: 1, 
    name: 'Fashion Student', 
    personaId: 'Persona 01',
    tags: ['fashion', 'trendy', 'bold'], 
    watchTime: '2.9s', 
    watchTimePercent: 32,
    engagement: 48, 
    insight: 'Low engagement, likely early swipe',
    like: 45, comment: 12, share: 18, save: 22, follow: 8,
    swipeProb: 62,
    predictedWatchTime: '3.2s',
    retentionCurve: [90, 75, 60, 45, 35, 28, 22, 18, 15, 12],
    qualitativeInsights: [
      'Fashion-focused personas show initial interest but drop off quickly.',
      'Visual aesthetic resonates but pacing feels slow for this segment.',
      'Consider faster cuts in the first 2 seconds to retain attention.',
      'Low follow probability suggests content isn\'t building long-term interest.'
    ]
  },
  { 
    id: 2, 
    name: 'Tech Enthusiast', 
    personaId: 'Persona 02',
    tags: ['tech', 'gadgets', 'reviews'], 
    watchTime: '8.2s', 
    watchTimePercent: 78,
    engagement: 82, 
    insight: 'High retention, likely to comment',
    like: 85, comment: 62, share: 48, save: 71, follow: 45,
    swipeProb: 15,
    predictedWatchTime: '9.1s',
    retentionCurve: [95, 92, 88, 85, 80, 75, 70, 65, 60, 55],
    qualitativeInsights: [
      'Strong resonance with technical content presentation style.',
      'High comment probability indicates engaged, discussion-oriented viewers.',
      'Save rate suggests content is reference-worthy for this segment.',
      'Consider adding more technical depth to maximize engagement.',
      'This persona cluster shows potential for community building.'
    ]
  },
  { 
    id: 3, 
    name: 'Fitness Coach', 
    personaId: 'Persona 03',
    tags: ['fitness', 'health', 'motivation'], 
    watchTime: '5.4s', 
    watchTimePercent: 58,
    engagement: 67, 
    insight: 'Moderate engagement, may share',
    like: 68, comment: 34, share: 55, save: 42, follow: 28,
    swipeProb: 35,
    predictedWatchTime: '5.8s',
    retentionCurve: [92, 85, 75, 68, 60, 55, 50, 45, 40, 35],
    qualitativeInsights: [
      'Moderate interest with good share potential for motivational content.',
      'Retention drops around the 4-second mark — consider a mid-video hook.',
      'Health-conscious messaging resonates well with this segment.',
      'Follow rate could improve with clearer value proposition.'
    ]
  },
  { 
    id: 4, 
    name: 'Creative Director', 
    personaId: 'Persona 04',
    tags: ['design', 'aesthetic', 'minimal'], 
    watchTime: '12.1s', 
    watchTimePercent: 95,
    engagement: 94, 
    insight: 'Very high retention, core audience',
    like: 92, comment: 78, share: 65, save: 88, follow: 72,
    swipeProb: 8,
    predictedWatchTime: '12.5s',
    retentionCurve: [98, 96, 94, 92, 90, 88, 85, 82, 78, 75],
    qualitativeInsights: [
      'Core audience segment with exceptional retention and engagement.',
      'Aesthetic presentation strongly aligns with this persona\'s preferences.',
      'Very high save rate indicates content is being bookmarked for reference.',
      'Consider creating more content specifically targeting this segment.',
      'High follow rate suggests strong potential for audience growth.',
      'This persona shows ideal content-audience fit.'
    ]
  },
  { 
    id: 5, 
    name: 'College Student', 
    personaId: 'Persona 05',
    tags: ['lifestyle', 'budget', 'fun'], 
    watchTime: '3.8s', 
    watchTimePercent: 42,
    engagement: 52, 
    insight: 'Average engagement, passive viewer',
    like: 55, comment: 18, share: 32, save: 28, follow: 12,
    swipeProb: 52,
    predictedWatchTime: '4.2s',
    retentionCurve: [88, 72, 58, 48, 42, 38, 34, 30, 26, 22],
    qualitativeInsights: [
      'Passive viewing behavior with moderate like probability.',
      'Content pacing may be too slow for this attention span.',
      'Budget-friendly messaging could improve resonance.',
      'Low follow rate suggests need for stronger call-to-action.'
    ]
  },
  { 
    id: 6, 
    name: 'Young Professional', 
    personaId: 'Persona 06',
    tags: ['career', 'growth', 'hustle'], 
    watchTime: '6.7s', 
    watchTimePercent: 68,
    engagement: 74, 
    insight: 'Good retention, may follow',
    like: 76, comment: 42, share: 51, save: 58, follow: 35,
    swipeProb: 28,
    predictedWatchTime: '7.2s',
    retentionCurve: [94, 88, 80, 74, 68, 62, 56, 50, 45, 40],
    qualitativeInsights: [
      'Professional growth content resonates with career-focused viewers.',
      'Good save rate indicates valuable, reference-worthy content.',
      'Consider emphasizing productivity or efficiency angles.',
      'Mid-tier follow rate could improve with consistent posting schedule.',
      'This segment responds well to actionable insights.'
    ]
  },
  { 
    id: 7, 
    name: 'Stay-at-home Parent', 
    personaId: 'Persona 07',
    tags: ['family', 'tips', 'relatable'], 
    watchTime: '4.2s', 
    watchTimePercent: 45,
    engagement: 58, 
    insight: 'Moderate interest, occasional like',
    like: 62, comment: 25, share: 38, save: 35, follow: 18,
    swipeProb: 45,
    predictedWatchTime: '4.8s',
    retentionCurve: [90, 78, 65, 55, 48, 42, 38, 34, 30, 26],
    qualitativeInsights: [
      'Relatable content performs moderately with this segment.',
      'Share rate indicates willingness to spread helpful content.',
      'Consider adding family-oriented themes to improve resonance.',
      'Attention drops quickly — front-load key information.'
    ]
  },
  { 
    id: 8, 
    name: 'Gen Z Trendsetter', 
    personaId: 'Persona 08',
    tags: ['viral', 'memes', 'culture'], 
    watchTime: '7.5s', 
    watchTimePercent: 75,
    engagement: 79, 
    insight: 'High engagement, likely to share',
    like: 82, comment: 55, share: 72, save: 48, follow: 42,
    swipeProb: 18,
    predictedWatchTime: '8.2s',
    retentionCurve: [95, 90, 85, 80, 75, 70, 65, 58, 52, 45],
    qualitativeInsights: [
      'Strong viral potential with high share probability.',
      'Cultural references resonate well with this trend-aware segment.',
      'Consider incorporating current meme formats for maximum reach.',
      'Comment rate suggests high engagement with interactive content.',
      'This persona is key for organic reach and discovery.'
    ]
  },
  { 
    id: 9, 
    name: 'Small Business Owner', 
    personaId: 'Persona 09',
    tags: ['entrepreneur', 'marketing', 'tips'], 
    watchTime: '9.3s', 
    watchTimePercent: 85,
    engagement: 88, 
    insight: 'Very engaged, likely to save',
    like: 88, comment: 68, share: 58, save: 82, follow: 55,
    swipeProb: 12,
    predictedWatchTime: '9.8s',
    retentionCurve: [96, 92, 88, 85, 82, 78, 74, 70, 65, 60],
    qualitativeInsights: [
      'Highly engaged segment seeking actionable business insights.',
      'Exceptional save rate indicates content is being used as reference.',
      'Marketing and growth tips resonate strongly with entrepreneurs.',
      'High follow rate suggests loyalty-building potential.',
      'Consider creating series content for this dedicated segment.',
      'Testimonial or case study formats may perform exceptionally well.'
    ]
  },
  { 
    id: 10, 
    name: 'Art Student', 
    personaId: 'Persona 10',
    tags: ['art', 'creative', 'visual'], 
    watchTime: '2.1s', 
    watchTimePercent: 22,
    engagement: 35, 
    insight: 'Quick scroll, not target audience',
    like: 32, comment: 8, share: 12, save: 15, follow: 5,
    swipeProb: 72,
    predictedWatchTime: '2.5s',
    retentionCurve: [80, 55, 38, 28, 22, 18, 15, 12, 10, 8],
    qualitativeInsights: [
      'Low resonance — content style doesn\'t match artistic preferences.',
      'Very high swipe probability indicates immediate disinterest.',
      'Visual presentation may need adjustment for creative audiences.',
      'Not recommended as a target segment for this content type.'
    ]
  },
  { 
    id: 11, 
    name: 'Music Producer', 
    personaId: 'Persona 11',
    tags: ['audio', 'beats', 'creative'], 
    watchTime: '5.8s', 
    watchTimePercent: 62,
    engagement: 63, 
    insight: 'Niche interest, moderate retention',
    like: 65, comment: 28, share: 42, save: 48, follow: 22,
    swipeProb: 38,
    predictedWatchTime: '6.2s',
    retentionCurve: [92, 82, 72, 65, 58, 52, 46, 40, 35, 30],
    qualitativeInsights: [
      'Moderate interest from audio-focused creative segment.',
      'Sound design and music choices may influence retention.',
      'Consider audio-first approach for this niche audience.',
      'Save rate suggests content has reference value for creators.'
    ]
  },
  { 
    id: 12, 
    name: 'Travel Blogger', 
    personaId: 'Persona 12',
    tags: ['travel', 'adventure', 'lifestyle'], 
    watchTime: '4.5s', 
    watchTimePercent: 48,
    engagement: 56, 
    insight: 'Interested but not core audience',
    like: 58, comment: 22, share: 45, save: 38, follow: 15,
    swipeProb: 48,
    predictedWatchTime: '5.0s',
    retentionCurve: [90, 76, 64, 55, 48, 42, 36, 30, 25, 20],
    qualitativeInsights: [
      'Peripheral interest — content touches on adjacent themes.',
      'Share rate indicates potential for travel-adjacent content.',
      'Location or destination elements could boost engagement.',
      'Not a primary target but may contribute to reach.'
    ]
  },
];

// Pre-calculate positions with engagement-based distance
const personasWithPositions = mockPersonas.map((persona, index) => {
  const maxDistance = 42;
  const minDistance = 12;
  const distance = maxDistance - ((persona.engagement / 100) * (maxDistance - minDistance));
  
  const baseAngle = (index / mockPersonas.length) * 2 * Math.PI;
  const angleOffset = ((persona.engagement % 20) - 10) / 50;
  const angle = baseAngle + angleOffset;
  
  const x = 50 + distance * Math.cos(angle);
  const y = 50 + distance * Math.sin(angle);
  
  return { ...persona, x, y, distance };
});

// Get dot color based on engagement
const getDotColor = (engagement) => {
  const lightness = 85 - (engagement * 0.7);
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

  const activePersona = hoveredPersona;

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
    if (selectedPersona?.id === persona.id) {
      onPersonaSelect(null);
    } else {
      onPersonaSelect(persona);
    }
  };

  const handleBackgroundClick = (e) => {
    // Only deselect if clicking directly on the background, not on a persona dot
    if (e.target === e.currentTarget || e.target.classList.contains('orbit-bg')) {
      onPersonaSelect(null);
    }
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center orbit-container cursor-default"
      onClick={handleBackgroundClick}
    >
      {/* Radial glow background */}
      <div 
        className="absolute inset-0 orbit-bg"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 30%, transparent 55%)',
        }}
      />
      
      {/* Orbit visualization container */}
      <div className="relative w-full max-w-[460px] aspect-square orbit-bg">
        
        {/* Subtle orbit rings */}
        <div className="absolute inset-[15%] rounded-full border border-gray-100 opacity-30 pointer-events-none" />
        <div className="absolute inset-[30%] rounded-full border border-gray-100 opacity-20 pointer-events-none" />
        <div className="absolute inset-[42%] rounded-full border border-gray-100 opacity-15 pointer-events-none" />
        
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
              className={`absolute rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
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