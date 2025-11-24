import React from 'react';
import TopBar from '@/components/gravity/TopBar';
import GravityOrbit from '@/components/gravity/GravityOrbit';
import AnalyticsPanel from '@/components/gravity/AnalyticsPanel';
import VisualizationLegend from '@/components/gravity/VisualizationLegend';
import { HelpCircle } from 'lucide-react';

export default function SimulationResults() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left: Gravity Visualization */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <GravityOrbit />
          </div>
          
          {/* Bottom Legend */}
          <VisualizationLegend />
        </div>

        {/* Right: Analytics Panel */}
        <div className="p-6 border-l border-gray-100 bg-gray-50/50">
          <AnalyticsPanel />
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <HelpCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
      </button>
    </div>
  );
}