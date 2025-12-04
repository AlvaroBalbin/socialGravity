// src/components/gravity/PersonaCard.jsx
import React from "react";

// 0–1 or 0–100 -> pretty %
function formatPercentFromProb(value) {
  if (value == null || typeof value !== "number" || !Number.isFinite(value)) {
    return "–";
  }

  let v = value;
  // handle 0–100 inputs
  if (v > 1) v = v / 100;

  const p = v * 100;
  if (p > 0 && p < 1) return `${p.toFixed(1)}%`; // 0.1–0.9
  if (p < 10) return `${p.toFixed(1)}%`;         // 1.0–9.9
  return `${Math.round(p)}%`;                    // 10%+
}

export default function PersonaCard({ persona, metrics, position = "right" }) {
  if (!persona) return null;

  const isRight = position === "right";

  // ---- probabilities from persona metrics -----------------------------

  const likeProbRaw =
    (metrics && metrics.likeProbability) ??
    (metrics && metrics.avgLikeProbability) ??
    persona.likeProbability ??
    null;

  const swipeProbRaw =
    (metrics && metrics.swipeProbability) ??
    (metrics && metrics.avgSwipeProbability) ??
    persona.swipeProbability ??
    null;

  const likeText = formatPercentFromProb(likeProbRaw);
  const swipeText = formatPercentFromProb(swipeProbRaw);

  // ---- persona blurb (who they are) -----------------------------------

  const personaBlurb =
    persona.one_line_summary ||
    persona.shortSummary ||
    persona.summary ||
    persona.description ||
    (persona.personaJson && persona.personaJson.one_line_summary) ||
    (persona.persona_json && persona.persona_json.one_line_summary) ||
    null;

  // ---- one-line insight about how they reacted ------------------------

  let insight = null;

  if (
    metrics &&
    Array.isArray(metrics.qualitativeFeedback) &&
    metrics.qualitativeFeedback.length > 0
  ) {
    insight = metrics.qualitativeFeedback[0];
  }

  if (!insight) {
    insight = "No insight available yet for this persona.";
  }

  const name =
    persona.displayName ||
    persona.label ||
    persona.name ||
    persona.id ||
    "Persona";

  return (
    <div
      className="flex"
      style={{
        flexDirection: isRight ? "row" : "row-reverse",
      }}
    >
      {/* Tag container (no connector line any more) */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6E6E6",
          borderRadius: 7,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          width: 260,
          animation: "personaTagFade 0.2s ease-out",
          marginLeft: isRight ? 8 : 0,
          marginRight: isRight ? 0 : 8,
        }}
      >
        {/* Persona Name */}
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "#111111",
            marginBottom: 4,
          }}
        >
          {name}
        </div>

        {/* Persona blurb */}
        {personaBlurb && (
          <div
            style={{
              fontSize: 12,
              color: "#666666",
              lineHeight: 1.35,
              marginBottom: 10,
            }}
          >
            {personaBlurb}
          </div>
        )}

        {/* Metrics Row */}
        <div className="flex justify-between" style={{ marginBottom: 10 }}>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#777777",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 2,
              }}
            >
              Like Probability
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111111",
              }}
            >
              {likeText}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#777777",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 2,
              }}
            >
              Swipe Probability
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111111",
              }}
            >
              {swipeText}
            </div>
          </div>
        </div>

        {/* Insight line */}
        <div
          style={{
            fontSize: 11,
            color: "#999999",
            fontStyle: "italic",
            lineHeight: 1.35,
          }}
        >
          {insight}
        </div>
      </div>

      <style>{`
        @keyframes personaTagFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
