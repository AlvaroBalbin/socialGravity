// src/components/profile/DeleteSimulationDialog.jsx

import React from "react";

export default function DeleteSimulationDialog({
  open,
  simulationTitle,
  onCancel,
  onConfirm,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />

      {/* Dialog card */}
      <div className="relative z-[1000] bg-white rounded-2xl shadow-xl border border-gray-200 max-w-sm w-full mx-4 p-6">
        {/* Title */}
        <div className="text-xs font-medium tracking-wide text-gray-400 uppercase mb-3">
          Delete Simulation
        </div>

        {/* Main text */}
        <p className="text-sm text-gray-700 mb-1">
          Are you sure you want to delete:
        </p>
        <p className="text-sm text-gray-900 font-medium mb-4 line-clamp-2">
          “{simulationTitle}”
        </p>

        <p className="text-xs text-gray-500 mb-6">
          This action cannot be undone. The simulation and all insights will be
          permanently removed.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-1.5 text-xs rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-1.5 text-xs rounded-full bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
