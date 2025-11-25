import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function ProfileHeader() {
  const handleLogout = () => {
    base44.auth.logout();
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

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
        >
          Log Out
        </button>
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