// src/components/marketing/OrbitShowcaseSection.jsx
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

// Persona info box component – small card: name + like + swipe
function PersonaInfoBox({ name, likeProb, swipeProb, style }) {
  const likeText = formatPercentFromProb(likeProb);
  const swipeText = formatPercentFromProb(swipeProb);

  return (
    <div className="absolute pointer-events-none" style={style}>
      {/* Card */}
      <div
        className="bg-white/90 backdrop-blur-sm rounded-md px-2.5 py-1.5 shadow-md border border-gray-100/50"
        style={{
          width: "130px",
          boxShadow: "0 3px 14px rgba(0,0,0,0.06)",
        }}
      >
        {/* Name */}
        <p className="text-[10px] font-medium text-gray-800 leading-tight mb-1">
          {name}
        </p>

        {/* Metrics row */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[8px] uppercase tracking-[0.12em] text-gray-400 mb-0.5">
              Like
            </p>
            <p className="text-[11px] font-semibold text-gray-900 leading-none">
              {likeText}
            </p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.12em] text-gray-400 mb-0.5">
              Swipe
            </p>
            <p className="text-[11px] font-semibold text-gray-900 leading-none">
              {swipeText}
            </p>
          </div>
        </div>
      </div>

      {/* Connector stem */}
      <div
        className="w-px h-6 mx-auto"
        style={{ backgroundColor: "#D3D6DB" }}
      />
    </div>
  );
}

function ShowcaseOrbit() {
  // 12 persona dots with orbital properties
  const dots = [
    {
      distance: 32,
      angle: 30,
      size: "large",
      duration: 32,
      hasCard: true,
      cardInfo: {
        name: "High-Intent Viewer",
        likeProb: 0.82,
        swipeProb: 0.64,
      },
    },
    {
      distance: 42,
      angle: 70,
      size: "medium",
      duration: 30,
    },
    {
      distance: 24,
      angle: 110,
      size: "large",
      duration: 34,
    },
    {
      distance: 44,
      angle: 150,
      size: "small",
      duration: 28,
      hasCard: true,
      cardInfo: {
        name: "Passive Scroller",
        likeProb: 0.33,
        swipeProb: 0.18,
      },
    },
    {
      distance: 28,
      angle: 190,
      size: "medium",
      duration: 32,
    },
    {
      distance: 38,
      angle: 230,
      size: "large",
      duration: 30,
    },
    {
      distance: 46,
      angle: 270,
      size: "small",
      duration: 36,
    },
    {
      distance: 36,
      angle: 310,
      size: "medium",
      duration: 28,
      hasCard: true,
      cardInfo: {
        name: "Context-Driven Thinker",
        likeProb: 0.61,
        swipeProb: 0.47,
      },
    },
    {
      distance: 22,
      angle: 350,
      size: "large",
      duration: 34,
    },
    {
      distance: 48,
      angle: 50,
      size: "small",
      duration: 32,
    },
    {
      distance: 26,
      angle: 170,
      size: "medium",
      duration: 30,
    },
    {
      distance: 45,
      angle: 250,
      size: "small",
      duration: 28,
    },
  ];

  // Size classes (35–45% larger)
  const sizes = {
    small: 14,
    medium: 20,
    large: 26,
  };

  return (
    <div className="relative w-full max-w-xl aspect-square mx-auto">
      {/* Soft ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.015) 0%, transparent 50%)",
        }}
      />

      {/* Concentric orbit rings */}
      <div
        className="absolute inset-[12%] rounded-full border border-gray-300"
        style={{ opacity: 0.08 }}
      />
      <div
        className="absolute inset-[22%] rounded-full border border-gray-300"
        style={{ opacity: 0.07 }}
      />
      <div
        className="absolute inset-[32%] rounded-full border border-gray-300"
        style={{ opacity: 0.06 }}
      />
      <div
        className="absolute inset-[42%] rounded-full border border-gray-300"
        style={{ opacity: 0.05 }}
      />

      {/* Central black hole – matched to GravityOrbit */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bh-core-landing">
          {/* highlight strip like GravityOrbit */}
          <div className="bh-core-highlight" />
        </div>
      </div>

      {/* Orbiting Dots */}
      {dots.map((dot, i) => {
        const size = sizes[dot.size];

        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: `${dot.distance * 2}%`,
              height: `${dot.distance * 2}%`,
              marginLeft: `-${dot.distance}%`,
              marginTop: `-${dot.distance}%`,
              animation: `orbitShowcase ${dot.duration}s linear infinite`,
              animationDelay: `-${(dot.angle / 360) * dot.duration}s`,
            }}
          >
            {/* Persona info card - stays upright, counter-rotation */}
            {dot.hasCard && dot.cardInfo && (
              <div
                className="absolute"
                style={{
                  left: "100%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: `counterOrbitShowcase ${dot.duration}s linear infinite`,
                  animationDelay: `-${(dot.angle / 360) * dot.duration}s`,
                }}
              >
                <PersonaInfoBox
                  name={dot.cardInfo.name}
                  likeProb={dot.cardInfo.likeProb}
                  swipeProb={dot.cardInfo.swipeProb}
                  style={{
                    left: "50%",
                    bottom: `${size / 2 + 4}px`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            )}

            {/* The dot itself – same style as GravityOrbit's dot-core */}
            <div
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: "100%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle at 30% 30%, rgba(120,120,120,0.9) 0%, rgba(60,60,60,1) 100%)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                animation: `wobbleShowcase ${
                  6 + i * 0.3
                }s ease-in-out infinite, breatheShowcase ${
                  5 + i * 0.2
                }s ease-in-out infinite`,
              }}
            />
          </div>
        );
      })}

      <style>{`
        /* Central core – copied from GravityOrbit visual language */
        .bh-core-landing {
          width: 84px;
          height: 84px;
          border-radius: 9999px;
          position: relative;
          background: radial-gradient(circle at 35% 35%, 
            rgba(80, 80, 80, 1) 0%, 
            rgba(30, 30, 30, 1) 70%,
            rgba(10, 10, 10, 1) 100%);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 -4px 12px rgba(0, 0, 0, 0.4),
            inset 0 4px 12px rgba(255, 255, 255, 0.1);
          animation: bh-core-pulse 4s ease-in-out infinite;
        }

        .bh-core-highlight {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 16px;
          border-radius: 9999px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.22), transparent);
          filter: blur(2px);
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

        @keyframes orbitShowcase {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes counterOrbitShowcase {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        @keyframes wobbleShowcase {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          25% { transform: translate(-50%, -50%) translate(1px, -0.5px); }
          50% { transform: translate(-50%, -50%) translate(-0.5px, 1px); }
          75% { transform: translate(-50%, -50%) translate(-1px, -0.5px); }
        }

        @keyframes breatheShowcase {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.02); }
        }
      `}</style>
    </div>
  );
}

export default function OrbitShowcaseSection() {
  const [headingRef, setHeadingRef] = React.useState(null);
  const [headingInView, setHeadingInView] = React.useState(false);

  React.useEffect(() => {
    if (!headingRef) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(headingRef);
    return () => observer.disconnect();
  }, [headingRef]);

  return (
    <section id="resonance" className="py-20 px-6 pb-28 bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            ref={setHeadingRef}
            className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-5"
            style={{
              opacity: headingInView ? 1 : 0,
              transform: headingInView ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            A new way to &quot;see&quot; resonance.
          </h2>
          <p
            className="text-sm text-gray-500 font-light max-w-md mx-auto leading-relaxed"
            style={{
              opacity: headingInView ? 1 : 0,
              transform: headingInView ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s",
            }}
          >
            Every dot is an AI persona.
            <br />
            The closer they drift, the more engaged they are.
            <br />
            Their position reveals how strongly they connect.
            <br />
            The orbit visualizes your content&apos;s pull.
          </p>
        </div>

        {/* Visual */}
        <ShowcaseOrbit />
      </div>
    </section>
  );
}
