import React, { useState, useMemo } from 'react';
import PersonaCard from './PersonaCard';
/** @typedef {import('react').CSSProperties} CSSProperties */


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
function computePositions(personas) {
  // Tight, readable orbits around the centre
  const MIN_RADIUS_PX = 140; // highest engagement – close but not overlapping core
  const MAX_RADIUS_PX = 260; // lowest engagement – still fairly tight
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~137.5°

  return personas.map((persona, index) => {
    const rawEng = Number.isFinite(persona.engagement)
      ? persona.engagement
      : 50;

    // normalise 0–100 → 0–1
    const norm = Math.min(1, Math.max(0, rawEng / 100));

    // strong inward bias so high-engagement gets clearly pulled in
    const inwardBias = Math.pow(norm, 2.0);

    // 0 → MAX_RADIUS, 1 → MIN_RADIUS
    const radiusPx =
      MIN_RADIUS_PX + (1 - inwardBias) * (MAX_RADIUS_PX - MIN_RADIUS_PX);

    const baseAngle = index * GOLDEN_ANGLE;

    // small deterministic jitter for organic spacing
    const jitter =
      (((rawEng % 23) - 11.5) / 11.5) * (Math.PI / 40); // about ±4.5°
    const finalAngle = baseAngle + jitter;

    const angleDeg = (finalAngle * 180) / Math.PI;

    return {
      ...persona,
      angleDeg,
      radius: radiusPx,
    };
  });
}

const getDotColor = (engagement) => {
  const safe = Number.isFinite(engagement) ? engagement : 50;
  const norm = Math.min(1, Math.max(0, safe / 100));

  // High contrast: cold personas = pale, hot personas = deep dark
  // 0 → 88% light, 1 → 10% light
  const lightness = 88 - Math.pow(norm, 1.4) * 78;

  return `hsl(0, 0%, ${lightness}%)`;
};

const getDotSize = (engagement) => {
  const safe = Number.isFinite(engagement) ? engagement : 50;
  const norm = Math.min(1, Math.max(0, safe / 100));

  // Big difference between low and high engagement
  const minSize = 10; // px – small
  const maxSize = 48; // px – very large

  const t = Math.pow(norm, 1.8); // strongly non-linear
  return minSize + t * (maxSize - minSize);
};

export default function GravityOrbit({
  onPersonaSelect,
  selectedPersona,
  savedPersonas,
  savedMetrics,
}) {
  const [hoveredPersona, setHoveredPersona] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  const personasWithPositions = useMemo(() => {
    const source =
      Array.isArray(savedPersonas) && savedPersonas.length > 0
        ? savedPersonas
        : mockPersonas;

    return computePositions(source);
  }, [savedPersonas]);

  const metricsById = useMemo(() => {
    const map = {};
    if (Array.isArray(savedMetrics)) {
      savedMetrics.forEach((m) => {
        if (m.personaId) {
          map[m.personaId] = m;
        }
      });
    }
    return map;
  }, [savedMetrics]);

  const activePersona = hoveredPersona;

const handlePersonaHover = (persona, e) => {
  if (!persona) {
    setHoveredPersona(null);
    return;
  }

  // Use the same outer container you used before
  const containerEl = e.currentTarget.closest(".orbit-container");
  if (!containerEl) {
    return;
  }

  const containerRect = containerEl.getBoundingClientRect();

  // persona.x / persona.y are percentages (0–100) of the orbit square.
  // We’ll map them into pixel coordinates inside the container.
  const baseX = (persona.x / 100) * containerRect.width;
  const baseY = (persona.y / 100) * containerRect.height;

  // Prefer card on the RIGHT of the dot, slightly above
  const preferredOffsetX = 120;   // px to the right
  const fallbackOffsetX = -120;   // px to the left if too close to right edge
  const offsetY = -20;            // a bit above the dot

  const containerWidth = containerRect.width;
  const safeRightMargin = 16;

  let offsetX = preferredOffsetX;
  if (baseX + preferredOffsetX > containerWidth - safeRightMargin) {
    // Flip to the left if we'd overflow the right side
    offsetX = fallbackOffsetX;
  }

  setCardPosition({
    x: baseX + offsetX,
    y: baseY + offsetY,
  });

  setHoveredPersona(persona);
};



  const handlePersonaClick = (persona) => {
    if (!onPersonaSelect) return;
    if (selectedPersona?.id === persona.id) onPersonaSelect(null);
    else onPersonaSelect(persona);
  };

 const handleBackgroundClick = (e) => {
  // If no persona is selected, nothing to clear
  if (!selectedPersona) return;

  // If the click happened INSIDE the PersonaCard, ignore it
  const clickedInsideCard = e.target.closest('.persona-card');
  if (clickedInsideCard) return;

  // If it’s a dot, ignore it (dot click handler handles its own logic)
  const clickedDot = e.target.closest('.dot-core');
  if (clickedDot) return;

  // Otherwise: clear selection
  onPersonaSelect(null);
};


  return (
    <div
      className="relative w-full h-full flex items-center justify-center orbit-container cursor-default"
      onClick={handleBackgroundClick}
    >
      {/* Light centre-focused background to use white space but keep it clean */}
      <div
        className="absolute inset-0 orbit-bg"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 55%)",
        }}
      />

      {/* Orbit container – big so it actually uses the page width */}
      <div className="relative w-full max-w-[720px] aspect-square">
        {/* Simple black core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bh-core" />
        </div>

        {/* Persona dots */}
        {personasWithPositions.map((persona, idx) => {
          const size = getDotSize(persona.engagement);
          const color = getDotColor(persona.engagement);
          const isSelected = selectedPersona?.id === persona.id;

          const entryDelay = 200 + ((idx * 90) % 900);
          const floatDelayMs = 3500;

          return (
            <button
              key={persona.id ?? idx}
              onMouseEnter={(e) => handlePersonaHover(persona, e)}
              onMouseLeave={() => handlePersonaHover(null)}
              onClick={() => handlePersonaClick(persona)}
              className="absolute cursor-pointer"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
          {/* orbit animation wrapper */}
          <span
            className="orbit-wrapper block"
            style={
              /** @type {CSSProperties} */
              ({
                "--orbit-angle-final": `${persona.angleDeg}deg`,
                "--orbit-radius-final": `${persona.radius}px`,
                animation: `orbit-in 3.2s ease-out ${entryDelay}ms forwards`,
              })
            }
          >


                {/* float animation */}
                <span
                  className="dot-float-wrapper block"
                  style={{
                    animation: `float-${idx % 3} ${
                      9 + (idx % 4)
                    }s ease-in-out ${floatDelayMs}ms infinite`,
                  }}
                >
                  <span
                    className="relative flex items-center justify-center"
                    style={{
                      width: `${size + 10}px`,
                      height: `${size + 10}px`,
                    }}
                  >
                    {isSelected && (
                      <span
                        className="absolute rounded-full selection-halo"
                        style={{
                          width: `${size + 8}px`,
                          height: `${size + 8}px`,
                        }}
                      />
                    )}

                    <span
                      className="dot-core block rounded-full"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: color,
                      }}
                    />
                  </span>
                </span>
              </span>
            </button>
          );
        })}

        {/* Persona hover card */}
        {activePersona && (
          <PersonaCard
            persona={activePersona}
            metrics={metricsById[activePersona.id]}
            position={cardPosition}
          />
        )}
      </div>

      {/* Animations & styles */}
      <style>{`
      /* centre black circle – nothing fancy, just a pulse */
      .bh-core {
        width: 120px;
        height: 120px;
        border-radius: 9999px;
        background: #000;
        box-shadow: 0 0 38px rgba(0,0,0,0.6);
        animation: bh-core-pulse 4s ease-in-out infinite;
      }

      @keyframes bh-core-pulse {
        0%, 100% {
          transform: scale(0.96);
          box-shadow: 0 0 32px rgba(0,0,0,0.55);
        }
        50% {
          transform: scale(1.04);
          box-shadow: 0 0 46px rgba(0,0,0,0.8);
        }
      }

      /* NEW: default state for orbit wrappers so they don't flash in the centre */
      .orbit-wrapper {
        opacity: 0;
        transform:
          rotate(calc(var(--orbit-angle-final) - 220deg))
          translateX(calc(var(--orbit-radius-final) * 1.2));
        transform-origin: center center;
      }

      @keyframes orbit-in {
        0% {
          opacity: 0;
          transform:
            rotate(calc(var(--orbit-angle-final) - 220deg))
            translateX(calc(var(--orbit-radius-final) * 1.2));
        }
        /* keep them invisible a bit longer so they only appear after "leaving" */
        25% {
          opacity: 0;
          transform:
            rotate(calc(var(--orbit-angle-final) + 18deg))
            translateX(calc(var(--orbit-radius-final) * 1.05));
        }
        0% {
          opacity: 1;
          transform:
            rotate(calc(var(--orbit-angle-final) + 30deg))
            translateX(calc(var(--orbit-radius-final) * 0.95));
        }
        100% {
          opacity: 1;
          transform:
            rotate(var(--orbit-angle-final))
            translateX(var(--orbit-radius-final));
        }
      }

      .selection-halo {
        border: 2px solid rgba(255,255,255,0.95);
        box-shadow:
          0 0 0 1px rgba(0,0,0,0.4),
          0 0 14px rgba(255,255,255,0.7);
      }

      @keyframes float-0 {
        0%,100% { transform: translate(0,0); }
        50% { transform: translate(0,-4px); }
      }
      @keyframes float-1 {
        0%,100% { transform: translate(0,0); }
        50% { transform: translate(4px,1px); }
      }
      @keyframes float-2 {
        0%,100% { transform: translate(0,0); }
        50% { transform: translate(-3px,-3px); }
      }

      /* Hover card fade-in – depends on PersonaCard root having className="persona-card" */
      @keyframes persona-card-fade-in {
        from {
          opacity: 0;
          transform: translateY(4px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .persona-card {
        animation: persona-card-fade-in 15000ms ease-out;
        transform-origin: top left;
      }
    `}</style>

    </div>
  );
}
