// src/components/gravity/SimulationHeader.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

// Supabase + Auth
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../lib/AuthContext";
import { createPageUrl } from "@/utils";

export default function SimulationHeader({
  simulationData,
  onTitleChange,
  onSave,
  isOwnedByUser = false, // ✅ new prop
}) {
  // Generate default title if nothing exists (old sims / weird states)
  const generateDefaultTitle = () => {
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" });
    const day = now.getDate();
    const year = now.getFullYear();
    return `Simulation – ${month} ${day}, ${year}`;
  };

  // Prefer explicit title, then audience prompt, then fallback
  const initialTitle =
    simulationData?.title ||
    simulationData?.audiencePrompt ||
    generateDefaultTitle();

  const [title, setTitle] = useState(initialTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showPrompt, setShowPrompt] = useState(false);

  const titleInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const persistTitle = async (finalTitle) => {
    const simulationId =
      simulationData?.id || simulationData?.simulation_id;

    if (!simulationId) {
      console.error(
        "SimulationHeader: no simulation id found when trying to save title",
        simulationData
      );
      return;
    }

    // Only try to persist if logged in; otherwise just keep local
    if (!isAuthenticated) return;

    try {
      const { error } = await supabase
        .from("simulations")
        .update({ title: finalTitle })
        .eq("id", simulationId);

      if (error) {
        console.error("Failed to auto-save title", error);
        return;
      }

      setIsSaved(true);
    } catch (err) {
      console.error("Unexpected error while auto-saving title", err);
    }
  };

  // Keep local title in sync when you navigate between simulations
  useEffect(() => {
    const nextTitle =
      simulationData?.title ||
      simulationData?.audiencePrompt ||
      generateDefaultTitle();
    setTitle(nextTitle);
    setIsSaved(false); // new sim = not saved in this session yet
  }, [
    simulationData?.id,
    simulationData?.title,
    simulationData?.audiencePrompt,
  ]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const commitTitle = async (nextTitle) => {
    const trimmed = nextTitle.trim() || generateDefaultTitle();
    setTitle(trimmed);
    setIsEditingTitle(false);
    setIsSaved(false); // we’re editing, so mark as dirty
    onTitleChange?.(trimmed);

    // Fire-and-forget DB update (if logged in)
    await persistTitle(trimmed);
  };

  const handleTitleBlur = () => {
    commitTitle(title);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTitle(title);
    }
  };

  const handleSave = async () => {
    if (isSaved || isSaving) return;

    const simulationId =
      simulationData?.id || simulationData?.simulation_id;

    if (!simulationId) {
      console.error(
        "SimulationHeader: no simulation id found in simulationData",
        simulationData
      );
      alert("Could not determine which simulation to save.");
      return;
    }

    // Not logged in → send to login + claim_simulation
    if (!isAuthenticated) {
      const redirectTarget = createPageUrl("Profile");
      const redirectParam = encodeURIComponent(redirectTarget);

      navigate(
        `/login?redirect=${redirectParam}&claim_simulation=${simulationId}`
      );
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("simulations")
        .update({
          user_id: user.id,
          title: title, // persist the current title
        })
        .eq("id", simulationId);

      if (error) {
        console.error("Failed to save simulation", error);
        alert("Failed to save simulation. Check console for details.");
        setIsSaving(false);
        return;
      }

      setIsSaving(false);
      setIsSaved(true);
      onSave?.({ title });

      // Optional: redirect to profile after a short delay
      setTimeout(() => {
        navigate(createPageUrl("Profile"));
      }, 500);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      alert("Something went wrong while saving.");
    }
  };

  const handleViewAll = () => {
    navigate(createPageUrl("Profile"));
  };

  const createdAtLabel = simulationData?.createdAt
    ? new Date(simulationData.createdAt).toLocaleString()
    : null;

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
      {/* Section A: Title Row */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex-1">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-gray-900 outline-none w-full max-w-md"
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors text-left"
            >
              {title}
            </button>
          )}
        </div>

        {/* Right Button */}
        {isOwnedByUser ? (
          // ✅ User already owns this simulation → go to library
          <button
            onClick={handleViewAll}
            className="px-5 py-2 text-sm font-medium rounded-xl border border-gray-900 bg-gray-900 text-white hover:bg-black transition-all duration-200"
          >
            View All Simulations
          </button>
        ) : (
          // ❌ Not owned yet → Save Simulation flow
          <button
            onClick={handleSave}
            disabled={isSaved || isSaving}
            className={`px-5 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
              isSaved
                ? "bg-white border-gray-200 text-gray-400 cursor-default"
                : "bg-white border-gray-900 text-gray-900 hover:shadow-md hover:-translate-y-0.5"
            }`}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : isSaved ? (
              <span className="flex items-center gap-1.5">
                Saved <Check className="w-3.5 h-3.5" />
              </span>
            ) : (
              "Save Simulation"
            )}
          </button>
        )}
      </div>

      {/* Section B: Meta + prompt toggle */}
      <div className="px-6 pb-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3">
          {createdAtLabel && <span>Created {createdAtLabel}</span>}
          {createdAtLabel && (
            <span className="h-1 w-1 rounded-full bg-gray-300" />
          )}
          <span>Status: {simulationData?.status || "unknown"}</span>
        </div>

        {simulationData?.audiencePrompt && (
          <button
            type="button"
            onClick={() => setShowPrompt((p) => !p)}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
          >
            {showPrompt ? "Hide audience prompt" : "Show audience prompt"}
            {showPrompt ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {/* Section C: Audience prompt panel */}
      {showPrompt && simulationData?.audiencePrompt && (
        <div className="px-6 pb-4">
          <div className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 whitespace-pre-wrap">
            {simulationData.audiencePrompt}
          </div>
        </div>
      )}
    </div>
  );
}
