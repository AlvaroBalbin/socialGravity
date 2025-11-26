// src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createPageUrl } from "@/utils";
import ProfileHeader from "@/components/profile/ProfileHeader";
import EmptyState from "@/components/profile/EmptyState";
import SimulationModal from "@/components/simulation/SimulationModal";

import { supabase } from "../supabaseClient";
import { useAuth } from "../lib/AuthContext";

export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [loadingSims, setLoadingSims] = useState(false); // start false

  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // If auth is resolved and user is not logged in → send to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Fetch simulations for this user
  useEffect(() => {
    // No user yet, nothing to load
    if (!user) {
      setSimulations([]);
      setLoadingSims(false);
      return;
    }

    const fetchSimulations = async () => {
      console.log("🔍 Fetching sims for user", user.id);
      setLoadingSims(true);

      try {
        const { data, error } = await supabase
          .from("simulations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Failed to load simulations", error);
          setSimulations([]);
        } else {
          console.log("✅ Loaded simulations:", data);
          setSimulations(data || []);
        }
      } catch (err) {
        console.error("❌ Exception while loading simulations", err);
        setSimulations([]);
      } finally {
        setLoadingSims(false);
      }
    };

    fetchSimulations();
  }, [user]);

  // Called after the full Supabase pipeline (start → upload → analyze → visual analysis)
  const handleSimulationComplete = (data) => {
    setShowModal(false);

    const { simulationId } = data || {};

    if (!simulationId) {
      console.error("❌ Simulation complete callback missing simulationId", data);
      return;
    }

    // Navigate to the results page
    navigate(createPageUrl("SimulationResults") + `?id=${simulationId}`);
  };

  const handleOpenSimulation = (simulationId) => {
    navigate(createPageUrl("SimulationResults") + `?id=${simulationId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simulation Wizard Modal */}
      <SimulationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleSimulationComplete}
      />

      {/* Header UI */}
      <ProfileHeader />

      <main className="max-w-6xl mx-auto px-6 pb-16">
        <section
          className="mt-4"
          style={{ animation: "sectionFadeIn 0.5s ease-out 0.2s both" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Saved Simulations
            </h2>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1.5 text-xs font-medium rounded-full border border-gray-900 text-gray-900 hover:shadow-sm transition"
            >
              Run Simulation
            </button>
          </div>

          {/* Loading state – ONLY depends on loadingSims now */}
          {loadingSims ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
          ) : simulations.length === 0 ? (
            // No sims yet → show original empty state
            <EmptyState onRunSimulation={() => setShowModal(true)} />
          ) : (
            // List of simulations for this user
            <div className="space-y-3">
              {simulations.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => handleOpenSimulation(sim.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition text-left"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {sim.audience_prompt || "Untitled simulation"}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {sim.created_at
                        ? new Date(sim.created_at).toLocaleString()
                        : "Unknown date"}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {sim.status || "complete"}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <style>{`
        @keyframes sectionFadeIn {
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
