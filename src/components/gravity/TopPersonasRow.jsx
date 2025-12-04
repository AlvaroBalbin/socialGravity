import React from "react";

// Generate dot color based on engagement
const getDotColor = (engagement) => {
  const lightness = 85 - engagement * 0.7;
  return `hsl(0, 0%, ${lightness}%)`;
};

export default function TopPersonasRow({
  savedPersonas = [],
  selectedPersona,
  onPersonaSelect,
}) {
  if (!savedPersonas.length) return null;

  // Sort by engagement descending, pick top 4
  const topPersonas = [...savedPersonas]
    .filter((p) => p && typeof p.engagement === "number")
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 4);

  return (
    <div className="flex items-center justify-center gap-4 py-3 px-6 border-t border-gray-100 bg-white">
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
        Top personas
      </span>

      {/* row of pills */}
      <div className="flex items-center gap-3 overflow-x-auto">
        {topPersonas.map((persona) => {
          const isSelected = selectedPersona?.id === persona.id;

          const name =
            persona.display_name ||
            persona.displayName ||
            persona.short_label ||
            persona.shortLabel ||
            persona.name;

          return (
            <button
              key={persona.id}
              onClick={() => onPersonaSelect(isSelected ? null : persona)}
              className={`
                flex-shrink-0 inline-flex items-center gap-3
                px-3.5 py-1.5
                rounded-full
                transition-all duration-200
                border
                ${
                  isSelected
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                }
              `}
            >
              {/* Dot */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getDotColor(persona.engagement) }}
              />

              {/* Name + score */}
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium leading-none whitespace-nowrap">
                  {name}
                </span>
                <span className="text-[10px] text-gray-500 leading-tight">
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
