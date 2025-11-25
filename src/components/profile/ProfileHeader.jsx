import React from 'react';
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
        {/* Logo and Label */}
        <div className="flex items-center gap-3">
          {/* Simple orbit icon */}
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 rounded-full border border-black" />
            <div className="absolute inset-[30%] rounded-full border border-black/40" />
            <div className="absolute top-1/2 left-[15%] w-1.5 h-1.5 bg-black rounded-full -translate-y-1/2" />
          </div>
          <span className="text-sm font-medium text-gray-900 tracking-tight">Profile</span>
        </div>

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