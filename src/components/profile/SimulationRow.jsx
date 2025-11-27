// src/components/profile/SimulationRow.jsx

import React from "react";
import { Trash2 } from "lucide-react";

export default function SimulationRow({ simulation, onOpen, onDelete }) {
  const createdAt = simulation.created_at
    ? new Date(simulation.created_at).toLocaleString()
    : "Unknown date";

  const title =
    simulation.title ||
    simulation.audience_prompt ||
    "Untitled simulation";

  const status = simulation.status || "complete";

  return (
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
                ? "text-emerald-600"
                : status === "processing"
                ? "text-amber-600"
                : "text-gray-500"
            }
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {/* status on desktop can be subtle (already shown above) or removed */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="simulation-row__delete inline-flex items-center justify-center rounded-full p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Delete simulation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </button>
  );
}
