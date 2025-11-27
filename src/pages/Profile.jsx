// src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createPageUrl } from "@/utils";
import ProfileHeader from "@/components/profile/ProfileHeader";
import EmptyState from "@/components/profile/EmptyState";
import SimulationModal from "@/components/simulation/SimulationModal";

import ProfileAnalyticsPanel from "@/components/profile/ProfileAnalyticsPanel";
import SimulationRow from "@/components/profile/SimulationRow.jsx";
import DeleteSimulationDialog from "@/components/profile/DeleteSimulationDialog.jsx";

import { supabase } from "../supabaseClient";
import { useAuth } from "../lib/AuthContext";

export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [loadingSims, setLoadingSims] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null); // simulation being deleted
  const [deleting, setDeleting] = useState(false);

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

  // After full pipeline
  const handleSimulationComplete = (data) => {
    setShowModal(false);

    const { simulationId } = data || {};

    if (!simulationId) {
      console.error("❌ Simulation complete callback missing simulationId", data);
      return;
    }

    navigate(createPageUrl("SimulationResults") + `?id=${simulationId}`);
  };

  const handleOpenSimulation = (simulationId) => {
    navigate(createPageUrl("SimulationResults") + `?id=${simulationId}`);
  };

  const handleAskDeleteSimulation = (simulation) => {
    setDeleteTarget(simulation);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    const { error } = await supabase
      .from("simulations")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      console.error("❌ Failed to delete simulation", error);
      alert("Couldn't delete simulation. Try again.");
      setDeleting(false);
      return;
    }

    setSimulations((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simulation Wizard Modal */}
      <SimulationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleSimulationComplete}
      />

      {/* Delete confirmation dialog */}
      <DeleteSimulationDialog
        open={!!deleteTarget}
        simulationTitle={
          deleteTarget?.title ||
          deleteTarget?.audience_prompt ||
          "this simulation"
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
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

          <div className="flex items-start gap-8">
            {/* LEFT: simulations list */}
            <div className="flex-1">
              {loadingSims ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                </div>
              ) : simulations.length === 0 ? (
                <EmptyState onRunSimulation={() => setShowModal(true)} />
              ) : (
                <div className="space-y-3">
                  {simulations.map((sim) => (
                    <SimulationRow
                      key={sim.id}
                      simulation={sim}
                      onOpen={() => handleOpenSimulation(sim.id)}
                      onDelete={() => handleAskDeleteSimulation(sim)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: analytics */}
            <div className="hidden lg:block w-80 shrink-0">
              <ProfileAnalyticsPanel />
            </div>
          </div>
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
