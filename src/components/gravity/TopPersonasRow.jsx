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
    <div className="flex items-center justify-center gap-6 py-5 border-t border-gray-100 bg-white">
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
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                isSelected ? 'bg-gray-50 ring-1 ring-gray-200' : ''
              }`}
            >
              {/* Mini dot */}
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: getDotColor(persona.engagement) }}
              />

              {/* Name + score */}
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-700 font-medium leading-tight">
                  {persona.displayName || persona.name || persona.shortLabel}
                </span>
                <span className="text-[10px] text-gray-400">
                  {persona.engagement ?? 0}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
