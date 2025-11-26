import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
// Supabase + Auth
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../lib/AuthContext";
import { createPageUrl } from "@/utils";

export default function SimulationHeader({
  simulationData,
  onTitleChange,
  onSave,
}) {
  // Generate default title
  const generateDefaultTitle = () => {
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" });
    const day = now.getDate();
    const year = now.getFullYear();
    return `Simulation – ${month} ${day}, ${year}`;
  };

  const [title, setTitle] = useState(
    simulationData?.title || generateDefaultTitle()
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInputsExpanded, setIsInputsExpanded] = useState(true);
  const [version, setVersion] = useState(1); // you can repurpose/remove later
  const titleInputRef = useRef(null);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    onTitleChange?.(title);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false);
      onTitleChange?.(title);
    }
  };

  const handleSave = async () => {
    if (isSaved || isSaving) return;

    // Must be logged in to save
    if (!isAuthenticated) {
      // send them to login page
      navigate("/login");
      return;
    }

    // We need a simulation ID from props
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

    setIsSaving(true);

    try {
      // Attach this simulation row to the current Supabase user
      const { error } = await supabase
        .from("simulations")
        .update({
          user_id: user.id,
          // If you have a title column in the table, uncomment this:
          // title,
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
      onSave?.();

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

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaved || isSaving}
          className={`
            px-5 py-2 text-sm font-medium rounded-xl border transition-all duration-200
            ${
              isSaved
                ? "bg-white border-gray-200 text-gray-400 cursor-default"
                : "bg-white border-gray-900 text-gray-900 hover:shadow-md hover:-translate-y-0.5"
            }
          `}
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
      </div>
    </div>
  );
}
