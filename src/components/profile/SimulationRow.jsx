// src/components/profile/SimulationRow.jsx

import React, { useState } from "react";
import { Trash2, Share2 } from "lucide-react";

export default function SimulationRow({ simulation, onOpen, onDelete }) {
  const [copied, setCopied] = useState(false);

  const createdAt = simulation.created_at
    ? new Date(simulation.created_at).toLocaleString()
    : "Unknown date";

  const title =
    simulation.title ||
    simulation.audience_prompt ||
    "Untitled simulation";

  const status = simulation.status || "complete";

  const handleShare = (e) => {
    e.stopPropagation();

    const base = window.location.origin;
    const url = `${base}/simulationresults?id=${simulation.id}`;

    const copy = async () => {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        window.prompt("Copy link:", url);
      }
    };

    copy().then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1300); // auto-hide after 1.3s
    });
  };

  return (
    <div className="relative">
      {/* Toast */}
      {copied && (
        <div
          className="
            absolute right-3 -top-2 
            bg-gray-600 text-white text-[10px] 
            px-2 py-1 rounded-md shadow 
            animate-fade-in-out pointer-events-none
          "
        >
          Link copied!
        </div>
      )}

      <button
        type="button"
        onClick={onOpen}
        className="group w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition text-left bg-white"
      >
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 line-clamp-1">
            {title}
          </div>

          <div className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
            <span>{createdAt}</span>
            <span>•</span>
            <span
              className={
                status === "complete"
                  ? "text-black"
                  : status === "processing"
                  ? "text-gray-400"
                  : "text-gray-500"
              }
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center rounded-full p-1.5 text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Copy share link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="inline-flex items-center justify-center rounded-full p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Delete simulation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </button>

      {/* Tailwind animation */}
      <style>
        {`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-4px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }

        .animate-fade-in-out {
          animation: fadeInOut 1.2s ease forwards;
        }
        `}
      </style>
    </div>
  );
}
