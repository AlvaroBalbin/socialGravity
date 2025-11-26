// src/components/profile/ProfileHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/lib/AuthContext';

export default function ProfileHeader() {
  const { user, isAuthenticated, signOut } = useAuth();

  const handleLogout = async () => {
  await signOut();           // clears Supabase session
  window.location.href = "/"; // send them back to landing
};

  return (
    <header 
      className="sticky top-0 z-50 bg-white border-b border-gray-100"
      style={{
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to={createPageUrl('Landing')}
          className="text-lg font-medium text-gray-900 tracking-tight hover:text-gray-600 transition-colors"
        >
          Social Gravity
        </Link>

        <div className="flex items-center gap-4">

          {/* Signed-in user email (optional but nice UX) */}
          {isAuthenticated && (
            <span className="text-xs text-gray-400">
              {user?.email}
            </span>
          )}

          {/* Logout button */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              Log Out
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </header>
  );
}
