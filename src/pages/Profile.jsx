import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ProfileHeader from '@/components/profile/ProfileHeader';
import UserBlock from '@/components/profile/UserBlock';
import SimulationCard from '@/components/profile/SimulationCard';
import EmptyState from '@/components/profile/EmptyState';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const { data: simulations = [], isLoading } = useQuery({
    queryKey: ['simulations'],
    queryFn: () => base44.entities.Simulation.filter(
      { created_by: user?.email },
      '-created_date'
    ),
    enabled: !!user?.email,
  });

  const handleSimulationClick = (simulation) => {
    // Navigate to simulation detail view with ID
    window.location.href = createPageUrl('SimulationDetail') + `?id=${simulation.id}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <ProfileHeader />

      <main className="max-w-6xl mx-auto px-6 pb-16">
        {/* User Block */}
        {user && <UserBlock user={user} />}

        {/* Saved Simulations Section */}
        <section 
          className="mt-4"
          style={{
            animation: 'sectionFadeIn 0.5s ease-out 0.2s both',
          }}
        >
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
            Saved Simulations
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="h-32 bg-gray-50 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : simulations.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulations.map((simulation, index) => (
                <SimulationCard
                  key={simulation.id}
                  simulation={simulation}
                  onClick={() => handleSimulationClick(simulation)}
                  delay={index * 0.05}
                />
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