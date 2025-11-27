import React from 'react';

// Generate dot color based on engagement
const getDotColor = (engagement) => {
  const lightness = 85 - (engagement * 0.7);
  return `hsl(0, 0%, ${lightness}%)`;
};

export default function TopPersonasRow({
  savedPersonas = [],
  selectedPersona,
  onPersonaSelect,
}) {
  if (!savedPersonas.length) return null;

  // Sort by engagement descending, pick top 5
  const topPersonas = [...savedPersonas]
    .filter((p) => p && typeof p.engagement === 'number')
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 4); // only show top 4 personas

  return (
    <div className="flex items-center justify-center gap-6 py-5 px-6 border-t border-gray-100 bg-white">
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
        Top Personas
      </span>
      <div className="flex items-center gap-4 overflow-x-auto">
        {topPersonas.map((persona) => {
          const isSelected = selectedPersona?.id === persona.id;

          return (
            <button
            key={persona.id}
            onClick={() => onPersonaSelect(isSelected ? null : persona)}
            className={`
              w-full       /* full clickable width */
              flex items-center gap-3
              px-4 py-3    /* MUCH larger click area */
              rounded-xl
              transition-all duration-200
              hover:bg-gray-100
              ${isSelected ? "bg-gray-100 ring-1 ring-gray-300" : ""}
            `}
          >
            {/* Dot */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: getDotColor(persona.engagement) }}
            />

            {/* Name + score */}
            <div className="flex flex-col items-start">
              <span className="text-sm text-gray-800 font-medium leading-tight">
                {persona.displayName || persona.name || persona.shortLabel}
              </span>
              <span className="text-[11px] text-gray-500">{persona.engagement ?? 0}%</span>
            </div>
          </button>

          );
        })}
      </div>
    </div>
  );
}
