// src/components/gravity/PersonaCard.jsx
import React from 'react';

export default function PersonaCard({ persona, metrics, position }) {
  if (!persona) return null;

  const cardX = Math.min(Math.max(position.x, 120), 360);
  const cardY = position.y < 180 ? position.y + 40 : position.y - 200;

  // ---- Helpers ---------------------------------------------------------

  const formatPercentFromProb = (prob) => {
    if (prob == null || Number.isNaN(prob)) return '—';
    const p = prob * 100;
    if (p > 0 && p < 1) return `${p.toFixed(1)}%`; // 0.1–0.9
    if (p < 10) return `${p.toFixed(1)}%`; // 1.0–9.9
    return `${Math.round(p)}%`; // 10%+
  };

  // Persona-level like & swipe (prefer metrics; fall back to persona props)
  const likeProb =
    typeof metrics?.likeProbability === 'number'
      ? metrics.likeProbability
      : typeof persona?.likeProbability === 'number'
      ? persona.likeProbability
      : null;

  const swipeProb =
    typeof metrics?.swipeProbability === 'number'
      ? metrics.swipeProbability
      : typeof persona?.swipeProbability === 'number'
      ? persona.swipeProbability
      : null;

  const likeDisplay = formatPercentFromProb(likeProb);
  const swipeDisplay = formatPercentFromProb(swipeProb);

  // Insight line
  let insight = null;
  if (
    metrics &&
    Array.isArray(metrics.qualitativeFeedback) &&
    metrics.qualitativeFeedback.length > 0
  ) {
    insight = metrics.qualitativeFeedback[0];
  }
  if (!insight) {
    insight = 'No insight available yet for this persona.';
  }

  // Tags / emotional keywords – only used as a LAST-RESORT fallback for description
  const tags =
    (Array.isArray(persona.tags) && persona.tags.length && persona.tags) ||
    (metrics && metrics.emotionalKeywords) ||
    [];

  // --- One-sentence persona description ---------------------------------
  let description =
    // fields coming directly from edge function
    persona.one_liner ||
    persona.oneLiner ||
    persona.one_line_summary ||
    persona.description ||
    // nested JSON variants (if persona_json was not flattened)
    (persona.personaJson && persona.personaJson.one_liner) ||
    (persona.persona_json && persona.persona_json.one_liner) ||
    (persona.personaJson && persona.personaJson.one_line_summary) ||
    (persona.persona_json && persona.persona_json.one_line_summary) ||
    (persona.personaJson && persona.personaJson.description) ||
    (persona.persona_json && persona.persona_json.description) ||
    null;

  // If still nothing, gently turn tags into a human sentence
  if (!description && tags.length) {
    const top = tags.slice(0, 3).join(', ');
    description = `A ${top.toLowerCase()} type viewer.`;
  }

  return (
    <div
      className="absolute z-30 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-56 pointer-events-none"
      style={{
        left: `${cardX}px`,
        top: `${cardY}px`,
        transform: 'translateX(-50%)',
        animation: 'fadeIn 0.45s ease-out',
      }}
    >
      <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
        {persona.displayName ||
          persona.display_name ||
          persona.label ||
          persona.name ||
          persona.id}
      </h3>

      {/* One-sentence description instead of tags */}
      {description && (
        <p className="text-[11px] text-gray-600 mb-3 leading-snug">
          {description}
        </p>
      )}

      {/* Stats: Like % and Swipe % only */}
      <div className="space-y-0.5 mb-3">
        <p className="text-xs text-gray-500">
          Like rate:{' '}
          <span className="text-gray-800 font-medium">{likeDisplay}</span>
        </p>
        <p className="text-xs text-gray-500">
          Swipe rate:{' '}
          <span className="text-gray-800 font-medium">{swipeDisplay}</span>
        </p>
      </div>

      {/* Insight */}
      <p className="text-[11px] text-gray-400 italic border-t border-gray-100 pt-2.5">
        {insight}
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(5px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
