import React from "react";

export default function GravityLoader({ className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="gravity-orbit-wrapper">
        {/* Gravity lens / glow behind core */}
        <div className="gravity-orbit-lens" />

        {/* Core */}
        <div className="gravity-orbit-core" />

        {/* Subtle ring */}
        <div className="gravity-orbit-ring" />

        {/* Two orbiting dots (inner + middle) */}
        <div className="gravity-orbit-dot gravity-orbit-dot-inner" />
        <div className="gravity-orbit-dot gravity-orbit-dot-middle" />

        <style>{`
          /* =======================
             GRAVITY SIGNATURE LOADER
             ======================= */

          .gravity-orbit-wrapper {
            width: 120px;
            height: 120px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Soft gravity lens behind core */
          .gravity-orbit-lens {
            position: absolute;
            width: 110px;
            height: 110px;
            border-radius: 9999px;
            background: radial-gradient(
              circle,
              rgba(15, 23, 42, 0.12) 0%,
              rgba(15, 23, 42, 0.06) 35%,
              rgba(15, 23, 42, 0) 70%
            );
            filter: blur(2px);
            opacity: 0.9;
            animation: gravity-lens-pulse 4.2s ease-in-out infinite;
          }

          /* Center black hole core */
          .gravity-orbit-core {
            width: 44px;
            height: 44px;
            border-radius: 9999px;
            background: #0f172a; /* near-black */
            box-shadow: 0 0 32px rgba(15, 23, 42, 0.4);
            animation: gravity-core-pulse 3.8s ease-in-out infinite;
          }

          /* Faint ring around core */
          .gravity-orbit-ring {
            position: absolute;
            inset: 12px;
            border-radius: 9999px;
            border: 1px solid rgba(15, 23, 42, 0.12);
          }

          /* Base dot styling */
          .gravity-orbit-dot {
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 9999px;
            background: #0f172a;
            box-shadow: 0 0 18px rgba(15, 23, 42, 0.4);
            transform-origin: center;
          }

          /* --------------------------
             Inner orbit (small)
             -------------------------- */
          .gravity-orbit-dot-inner {
            width: 7px;
            height: 7px;
            opacity: 0.85;
            animation: gravity-orbit-inner 2.1s linear infinite;
          }

          @keyframes gravity-orbit-inner {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(30px);
            }
            50% {
              transform: translate(-50%, -50%) rotate(180deg) translateX(30px) scale(0.96);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(30px);
            }
          }

          /* --------------------------
             Middle orbit (hero dot)
             -------------------------- */
          .gravity-orbit-dot-middle {
            width: 9px;
            height: 9px;
            opacity: 0.95;
            animation: gravity-orbit-middle 1.6s linear infinite;
          }

          @keyframes gravity-orbit-middle {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(40px);
            }
            50% {
              transform: translate(-50%, -50%) rotate(180deg) translateX(40px) scale(1.08);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(40px);
            }
          }

          /* --------------------------
             Core & lens pulses
             -------------------------- */
          @keyframes gravity-core-pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 28px rgba(15, 23, 42, 0.42);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 38px rgba(15, 23, 42, 0.6);
            }
          }

          @keyframes gravity-lens-pulse {
            0%, 100% {
              opacity: 0.7;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
          }

          /* --------------------------
             Reduced motion support
             -------------------------- */
          @media (prefers-reduced-motion: reduce) {
            .gravity-orbit-dot-inner,
            .gravity-orbit-dot-middle,
            .gravity-orbit-core,
            .gravity-orbit-lens {
              animation-duration: 0.001ms !important;
              animation-iteration-count: 1 !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
