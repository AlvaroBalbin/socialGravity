import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import ProfileHeader from '@/components/profile/ProfileHeader';
import EmptyState from '@/components/profile/EmptyState';
import SimulationModal from '@/components/simulation/SimulationModal';

export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Called by SimulationModal when the Supabase pipeline finishes
  const handleSimulationComplete = (data) => {
    setShowModal(false);

    const { simulationId } = data || {};

    if (!simulationId) {
      console.error('Simulation complete callback missing simulationId', data);
      return;
    }

    // Go straight to results view for that simulation
    navigate(createPageUrl('SimulationResults') + `?id=${simulationId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Run Simulation Wizard */}
      <SimulationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleSimulationComplete}
      />

      {/* Top nav / user chip / etc. */}
      <ProfileHeader />

      <main className="max-w-6xl mx-auto px-6 pb-16">
        {/* Saved Simulations Section (MVP: only shows empty state) */}
        <section
          className="mt-4"
          style={{
            animation: 'sectionFadeIn 0.5s ease-out 0.2s both',
          }}
        >
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
            Saved Simulations
          </h2>

          {/* 
            MVP behaviour:
            - No auth, no per-user history yet
            - Show the EmptyState component with a button that opens the modal
          */}
          <EmptyState onRunSimulation={() => setShowModal(true)} />
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
