import React from 'react';
import { format } from 'date-fns';

export default function UserBlock({ user }) {
  const memberSince = user?.created_date 
    ? format(new Date(user.created_date), 'MMMM yyyy')
    : 'Recently';

  return (
    <div 
      className="flex items-center gap-4 py-8"
      style={{
        animation: 'slideUp 0.5s ease-out',
      }}
    >
      {/* Avatar Placeholder */}
      <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
        <span className="text-lg font-medium text-gray-400">
          {user?.full_name?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </div>

      {/* User Info */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
          {user?.full_name || 'User'}
        </h1>
        <p className="text-sm text-gray-400 font-light">{user?.email}</p>
        <p className="text-xs text-gray-300 font-light mt-0.5">Member since {memberSince}</p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(2px); 
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