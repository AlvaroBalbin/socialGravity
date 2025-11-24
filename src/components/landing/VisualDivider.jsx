import React from 'react';

export default function VisualDivider() {
  return (
    <div className="py-8 flex items-center justify-center gap-3">
      {/* Animated dots flowing downward */}
      <div className="flex flex-col items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-300"
            style={{
              animation: `flowDown 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes flowDown {
          0%, 100% { opacity: 0.3; transform: translateY(-4px); }
          50% { opacity: 1; transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}