// src/components/gravity/GravityOrbit.jsx
import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import PersonaTag from "./PersonaCard";
/** @typedef {import('react').CSSProperties} CSSProperties */

// ---------------------------------------------------------------------
// Mock personas
// ---------------------------------------------------------------------

const mockPersonas = [
  // 🔽 your real personas here
];

// ---------------------------------------------------------------------
// Layout + sizing constants
// ---------------------------------------------------------------------

const CORE_SIZE_PX = 84;          // black hole size
const DOT_MAX_SIZE = 32;
const DOT_MIN_SIZE = 12;
const PADDING_FROM_CORE = 10;     // gap between core and closest dot

// min radius so orbit never overlaps the core
const MIN_RADIUS_PX =
  CORE_SIZE_PX / 2 + DOT_MAX_SIZE / 2 + PADDING_FROM_CORE;

const MAX_RADIUS_PX = 240;        // outer ring

const RING_COUNT = 4;             // inner → outer rings
const RING_SPACING =
  (MAX_RADIUS_PX - MIN_RADIUS_PX) / (RING_COUNT - 1);

// speeds per ring (inner → outer)
const RING_SPEEDS = [80, 110, 140, 170];

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~137.5°

// ---------------------------------------------------------------------
// Layout helpers – rank → discrete rings (no clashing radii)
// ---------------------------------------------------------------------

function computePositions(personas) {
  if (!Array.isArray(personas) || personas.length === 0) return [];

  // Attach a safe engagement + original index
  const withEng = personas.map((p, idx) => ({
    ...p,
    _index: idx,
    _eng: Number.isFinite(p.engagement) ? p.engagement : 50,
  }));

  // Sort by engagement (low → high) so we can rank
  const sortedByEng = [...withEng].sort((a, b) => a._eng - b._eng);
  const n = sortedByEng.length;

  return sortedByEng.map((persona, rank) => {
    // 0 (worst) → 1 (best)
    const rankScore = n === 1 ? 1 : rank / (n - 1);

    // Best (rankScore=1) → inner ring, worst (0) → outer ring
    const ringScore = 1 - rankScore; // invert so bigger = further out
    let ringIndex = Math.round(ringScore * (RING_COUNT - 1));
    ringIndex = Math.min(RING_COUNT - 1, Math.max(0, ringIndex));

    const radius = MIN_RADIUS_PX + ringIndex * RING_SPACING;
    const duration = RING_SPEEDS[ringIndex] ?? RING_SPEEDS[RING_SPEEDS.length - 1];

    // Angles based on original index so they never start at same spot
    const baseAngle = persona._index * GOLDEN_ANGLE;
    const jitter =
      (((persona._eng % 23) - 11.5) / 11.5) * (Math.PI / 40); // ± ~4.5°
    const angleRad = baseAngle + jitter;
    const angleDeg = (angleRad * 180) / Math.PI;

    const startAngle = angleDeg; // starting rotation

    return {
      ...persona,
      radius,
      angleDeg,
      angleRad,
      startAngle,
      duration,
      ringIndex,
    };
  });
}

// ---------------------------------------------------------------------
// Dot size driven by *radius* → farther = smaller, closer = bigger
// ---------------------------------------------------------------------

const getDotSize = (radius) => {
  const safeRadius =
    typeof radius === "number"
      ? Math.min(MAX_RADIUS_PX, Math.max(MIN_RADIUS_PX, radius))
      : (MIN_RADIUS_PX + MAX_RADIUS_PX) / 2;

  // t = 0 (inner) → 1 (outer)
  const t = (safeRadius - MIN_RADIUS_PX) / (MAX_RADIUS_PX - MIN_RADIUS_PX);

  // inner big, outer small
  return DOT_MAX_SIZE - t * (DOT_MAX_SIZE - DOT_MIN_SIZE);
};

// ---------------------------------------------------------------------
// Hover tag portal – friend-style
// ---------------------------------------------------------------------

function HoverTagPortal({ persona, metrics, screenPosition }) {
  if (!persona || !screenPosition) return null;

  const { x, y } = screenPosition;
  const tagOnRight = x < window.innerWidth / 2;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: tagOnRight ? x + 4 : "auto",
        right: tagOnRight ? "auto" : window.innerWidth - x + 4,
        top: y,
        transform: "translateY(-50%)",
      }}
    >
      <PersonaTag
        persona={persona}
        metrics={metrics}
        position={tagOnRight ? "right" : "left"}
      />
    </motion.div>,
    document.body
  );
}

// ---------------------------------------------------------------------
// GravityOrbit – your personas, his visuals
// ---------------------------------------------------------------------

export default function GravityOrbit({
  onPersonaSelect,
  selectedPersona,
  savedPersonas,
  savedMetrics,
}) {
  const [hoveredPersona, setHoveredPersona] = useState(null);
  const [hoverMetrics, setHoverMetrics] = useState(null);
  const [hoverScreenPos, setHoverScreenPos] = useState(null);

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
        const key =
          m.personaId ??
          m.persona_id ??
          (m.persona && (m.persona.id || m.persona.persona_id)) ??
          m.id;

        if (key != null) {
          map[key] = m;
        }
      });
    }
    return map;
  }, [savedMetrics]);

  const handlePersonaHover = (persona, e) => {
    if (!persona || !e) {
      setHoveredPersona(null);
      setHoverMetrics(null);
      setHoverScreenPos(null);
      return;
    }

    const key =
      persona.id ??
      persona.personaId ??
      persona.persona_id;

    const metrics = key ? metricsById[key] || null : null;

    setHoveredPersona(persona);
    setHoverMetrics(metrics);
    setHoverScreenPos({
      x: e.clientX,
      y: e.clientY,
    });
  };


  const handlePersonaClick = (persona) => {
    if (!onPersonaSelect) return;
    if (selectedPersona?.id === persona.id) onPersonaSelect(null);
    else onPersonaSelect(persona);
  };

  const handleBackgroundClick = () => {
    if (!selectedPersona) return;
    onPersonaSelect(null);
  };

  const handleContainerLeave = () => {
    setHoveredPersona(null);
    setHoverMetrics(null);
    setHoverScreenPos(null);
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-default"
      onClick={handleBackgroundClick}
      onMouseLeave={handleContainerLeave}
    >
      {/* make the orbit canvas scale but no grey box */}
      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
        {/* Center sphere */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: CORE_SIZE_PX, height: CORE_SIZE_PX }}
        >
          <div
            className="relative w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle at 35% 35%, 
                rgba(80, 80, 80, 1) 0%, 
                rgba(30, 30, 30, 1) 70%,
                rgba(10, 10, 10, 1) 100%)`,
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.2),
                inset 0 -4px 12px rgba(0, 0, 0, 0.4),
                inset 0 4px 12px rgba(255, 255, 255, 0.1)
              `,
              animation: "bh-core-pulse 4s ease-in-out infinite",
            }}
          >
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-4 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.22), transparent)",
                filter: "blur(2px)",
              }}
            />
          </div>
        </div>

        {/* Orbiting persona dots */}
        {personasWithPositions.map((persona, i) => {
          const orbitRadius = persona.radius;
          const orbitDuration = persona.duration;
          const size = getDotSize(orbitRadius);

          // bigger hit-box for small dots
          const hitSize = Math.max(size, 32);

          return (
            <motion.div
              key={persona.id ?? i}
              className="absolute pointer-events-none"
              style={{
                width: orbitRadius * 2,
                height: orbitRadius * 2,
              }}
              initial={{ opacity: 0, scale: 0.9, rotate: persona.startAngle }}
              animate={{ opacity: 1, scale: 1, rotate: persona.startAngle + 360 }}
              transition={{
                rotate: {
                  duration: orbitDuration,
                  repeat: Infinity,
                  ease: "linear",
                },
                opacity: {
                  duration: 0.6,
                  delay: i * 0.04,
                },
                scale: {
                  duration: 0.6,
                  delay: i * 0.04,
                },
              }}
            >
              <div
                className="absolute cursor-pointer pointer-events-auto"
                style={{
                  top: -hitSize / 2,
                  left: "50%",
                  marginLeft: -hitSize / 2,
                  width: hitSize,
                  height: hitSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => handlePersonaHover(persona, e)}
                onMouseMove={(e) =>
                  hoveredPersona?.id === persona.id &&
                  handlePersonaHover(persona, e)
                }
                onMouseLeave={() => handlePersonaHover(null, null)}
                onClick={() => handlePersonaClick(persona)}
              >
                <div
                  className="rounded-full transition-transform duration-200 dot-core"
                  style={{
                    width: size,
                    height: size,
                    background: `radial-gradient(circle at 30% 30%, 
                      rgba(120, 120, 120, 0.9) 0%, 
                      rgba(60, 60, 60, 1) 100%)`,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    transform:
                      hoveredPersona?.id === persona.id
                        ? "scale(1.2)"
                        : "scale(1)",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {hoveredPersona && hoverScreenPos && (
          <HoverTagPortal
            persona={hoveredPersona}
            metrics={hoverMetrics}
            screenPosition={hoverScreenPos}
          />
        )}
      </AnimatePresence>

      <style>{`
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
      `}</style>
    </div>
  );
}
