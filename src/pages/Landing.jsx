import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import StickyHeader from "@/components/landing/StickyHeader";
import HeroSection from "@/components/landing/HeroSection";
import WhatItDoesSection from "@/components/landing/WhatItDoesSection";
import OrbitShowcaseSection from "@/components/landing/OrbitShowcaseSection";
import InsightPreviewSection from "@/components/landing/InsightPreviewSection";
import WhyItMattersSection from "@/components/landing/WhyItMattersSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

import SimulationModal from "@/components/simulation/SimulationModal";
import { createPageUrl } from "@/utils";

export default function Landing() {
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const navigate = useNavigate();

  const openSimulationModal = () => setShowSimulationModal(true);
  const closeSimulationModal = () => setShowSimulationModal(false);

  // Called when the full pipeline finishes inside SimulationModal
  const handleSimulationComplete = ({ simulationId }) => {
    setShowSimulationModal(false);

    if (!simulationId) {
      console.error("Simulation complete without simulationId");
      return;
    }

    // Same style as Profile page: ?id=<simulationId>
    navigate(createPageUrl("SimulationResults") + `?id=${simulationId}`);

    // If later you prefer path style:
    // navigate(`/simulationresults/${simulationId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Global header */}
      <StickyHeader />

      {/* Hero/sections – we pass the "run simulation" action into the hero + CTA */}
      <HeroSection onRunSimulation={openSimulationModal} />
      <OrbitShowcaseSection />
      <WhatItDoesSection />
      <InsightPreviewSection />
      <WhyItMattersSection />
      <FAQSection />
      <CTASection onRunSimulation={openSimulationModal} />
      <Footer />

      {/* Simulation wizard for the free try-from-landing flow */}
      <SimulationModal
        isOpen={showSimulationModal}
        onClose={closeSimulationModal}
        onComplete={handleSimulationComplete}
      />
    </div>
  );
}
