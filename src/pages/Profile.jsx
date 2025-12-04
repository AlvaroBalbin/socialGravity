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

// Logo
import sgLogoFull from "@/assets/sg-logo-full.jpg";

// Feedback modal
import FeedbackWidget from "@/components/feedback/FeedbackWidget";

export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [loadingSims, setLoadingSims] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false); // ✅ new

  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Load simulations for this user
  useEffect(() => {
    if (!user) {
      setSimulations([]);
      setLoadingSims(false);
      return;
    }

    const fetchSimulations = async () => {
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
          setSimulations(data || []);
        }
      } catch (err) {
        console.error(err);
        setSimulations([]);
      } finally {
        setLoadingSims(false);
      }
    };

    fetchSimulations();
  }, [user]);

  // When the simulation wizard finishes
  const handleSimulationComplete = (data) => {
    setShowModal(false);

    const { simulationId } = data || {};
    if (!simulationId) return;

    navigate(createPageUrl("SimulationResults") + `?id=${simulationId}`);
  };

  const handleOpenSimulation = (simulationId) => {
    navigate(createPageUrl("SimulationResults") + `?id=${simulationId}`);
  };

  const handleAskDeleteSimulation = (simulation) => {
    setDeleteTarget(simulation);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !user) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from("simulations")
        .delete()
        .match({ id: deleteTarget.id, user_id: user.id });

      if (error) {
        console.error("❌ Failed to delete simulation:", error);
        alert(`Couldn't delete simulation: ${error.message}`);
        return;
      }

      // Remove from UI
      setSimulations((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);

      // ✅ show slick success toast
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 2500);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!deleting) setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simulation wizard */}
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

      {/* ✅ Deletion success toast */}
      {deleteSuccess && (
        <div
          className="
            fixed top-4 right-4 z-[200]
            bg-gray-900 text-white text-[11px]
            px-3 py-1.5 rounded-lg shadow-lg
            animate-fade-in-out pointer-events-none
          "
        >
          Simulation deleted
        </div>
      )}

      {/* Top header with logo */}
      <ProfileHeader logoSrc={sgLogoFull} />

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 pb-0 w-full flex-1">
        <section
          className="mt-4"
          style={{ animation: "sectionFadeIn 0.5s ease-out 0.2s both" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Saved Simulations
            </h2>

            {/* Right-side actions: Run sim + Feedback */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-1.5 text-xs font-medium rounded-full border border-gray-900 text-gray-900 hover:shadow-sm transition"
              >
                Run Simulation
              </button>

              {/* Feedback button (opens anonymous feedback modal) */}
              <FeedbackWidget buttonLabel="Give Feedback" size="sm" />
            </div>
          </div>

          <div className="flex items-start gap-8">
            {/* LEFT: simulations list */}
            <div className="flex-1 relative mb-2">
              <div
                className="
                  h-[calc(100vh-220px)]
                  rounded-xl
                  bg-white
                  border border-gray-100
                  shadow-[0_4px_14px_rgba(0,0,0,0.04)]
                  flex flex-col
                  overflow-hidden
                "
              >
                <div className="flex-1 overflow-y-auto premium-scroll px-4 py-3">
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
              </div>

              {/* scroll fades */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent rounded-t-xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent rounded-b-xl" />
            </div>

            {/* RIGHT: analytics */}
            <div className="hidden lg:block w-80 shrink-0">
              <ProfileAnalyticsPanel />
            </div>
          </div>
        </section>
      </main>

      {/* Animations + Ghost Scrollbar CSS */}
      <style>{`
        @keyframes sectionFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* =============== GHOST SCROLLBAR =============== */

        .premium-scroll {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }

        .premium-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .premium-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .premium-scroll::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 999px;
          transition: background 0.25s ease;
        }

        .premium-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.18);
        }

        .premium-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.28);
        }

        /* ✅ shared fadeInOut animation (used by toasts) */
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-4px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }

        .animate-fade-in-out {
          animation: fadeInOut 2.5s ease forwards;
        }
      `}</style>
    </div>
  );
}
