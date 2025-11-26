// src/components/gravity/PersonaCard.jsx
import React from 'react';

export default function PersonaCard({ persona, metrics, position }) {
  if (!persona) return null;

  const cardX = Math.min(Math.max(position.x, 120), 360);
  const cardY = position.y < 180 ? position.y + 40 : position.y - 200;

  const watchTime =
    typeof persona.watchTimeSeconds === 'number'
      ? `${persona.watchTimeSeconds.toFixed(1)}s`
      : metrics && typeof metrics.watchTimeSeconds === 'number'
      ? `${metrics.watchTimeSeconds.toFixed(1)}s`
      : '—';

  const engagement =
    typeof persona.engagement === 'number'
      ? `${persona.engagement}%`
      : metrics && typeof metrics.alignmentScorePercent === 'number'
      ? `${Math.round(metrics.alignmentScorePercent)}%`
      : '—';

  let insight = null;
  if (metrics && Array.isArray(metrics.qualitativeFeedback) && metrics.qualitativeFeedback.length > 0) {
    insight = metrics.qualitativeFeedback[0];
  }
  if (!insight) {
    insight = 'No insight available yet for this persona.';
  }

  const tags = Array.isArray(persona.tags) && persona.tags.length
    ? persona.tags
    : metrics && metrics.emotionalKeywords
    ? metrics.emotionalKeywords
    : [];

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
      <h3 className="font-semibold text-gray-900 text-sm mb-2.5">
        {persona.displayName || persona.label || persona.name || persona.id}
      </h3>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-[11px] text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="space-y-0.5 mb-3">
        <p className="text-xs text-gray-500">
          Watch time: <span className="text-gray-800 font-medium">{watchTime}</span>
        </p>
        <p className="text-xs text-gray-500">
          Engagement: <span className="text-gray-800 font-medium">{engagement}</span>
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
