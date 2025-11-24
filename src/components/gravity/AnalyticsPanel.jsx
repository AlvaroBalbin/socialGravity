import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, UserPlus } from 'lucide-react';

const engagementData = [
  { label: 'Like', value: 78, icon: Heart },
  { label: 'Comment', value: 34, icon: MessageCircle },
  { label: 'Share', value: 45, icon: Share2 },
  { label: 'Save', value: 61, icon: Bookmark },
  { label: 'Follow', value: 23, icon: UserPlus },
];

export default function AnalyticsPanel() {
  const overallScore = 82;
  
  return (
    <div className="w-72 flex-shrink-0 space-y-4">
      {/* Overall Audience Fit Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col items-center">
          {/* Circular Score */}
          <div className="relative w-28 h-28 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#1f2937"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${overallScore * 2.64} 264`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{overallScore}</span>
              <span className="text-xs text-gray-400">/100</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Overall Audience Fit</p>
        </div>
      </div>

      {/* Engagement Probabilities Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">Engagement Probabilities</h3>
        
        <div className="space-y-5">
          {engagementData.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-900 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}