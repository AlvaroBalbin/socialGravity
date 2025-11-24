import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, UserPlus } from 'lucide-react';

const defaultEngagement = {
  like: 78,
  comment: 34,
  share: 45,
  save: 61,
  follow: 23,
};

export default function AnalyticsPanel({ selectedPersona }) {
  const overallScore = 82;
  
  // Use selected persona's engagement data or defaults
  const engagementValues = selectedPersona ? {
    like: selectedPersona.like,
    comment: selectedPersona.comment,
    share: selectedPersona.share,
    save: selectedPersona.save,
    follow: selectedPersona.follow,
  } : defaultEngagement;

  const engagementData = [
    { label: 'Like', value: engagementValues.like, icon: Heart },
    { label: 'Comment', value: engagementValues.comment, icon: MessageCircle },
    { label: 'Share', value: engagementValues.share, icon: Share2 },
    { label: 'Save', value: engagementValues.save, icon: Bookmark },
    { label: 'Follow', value: engagementValues.follow, icon: UserPlus },
  ];
  
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
                stroke="#f5f5f5"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#262626"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${overallScore * 2.64} 264`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold text-gray-900">{overallScore}</span>
              <span className="text-[10px] text-gray-400 font-medium">/100</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">Overall Audience Fit</p>
        </div>
      </div>

      {/* Engagement Probabilities Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-gray-900">Engagement Probabilities</h3>
          {selectedPersona && (
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {selectedPersona.name}
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          {engagementData.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 tabular-nums">{item.value}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out"
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