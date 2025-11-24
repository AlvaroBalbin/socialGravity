import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, UserPlus, Clock, TrendingUp } from 'lucide-react';

const defaultData = {
  overallScore: 82,
  like: 78,
  comment: 34,
  share: 45,
  save: 61,
  follow: 23,
  swipeProb: 18,
  predictedWatchTime: '8.4s',
  predictedWatchPercent: 70,
  retentionCurve: [95, 88, 80, 72, 65, 58, 52, 46, 40, 35],
  qualitativeInsights: [
    'Personas with aesthetic or cozy vibes were strongly pulled inward. High resonance with soft, wholesome content.',
    'Fast-paced personas dropped early due to slower cuts. Pacing mismatch detected in first 3 seconds.',
    'High cultural fit with NYC Gen Z cluster; low fit with chaotic-humour personas.',
    'Opening hook needs more immediate visual impact. Current 1.2s delay causes early drop-off.',
    'Color palette strongly resonates with target demographic. Consider maintaining consistency.',
    'Suggestion: Tighten the hook to <0.7s for maximum pull and reduce swipe probability by ~40%.'
  ]
};

export default function AnalyticsPanel({ selectedPersona }) {
  const engagementData = [
    { label: 'Like', value: selectedPersona?.like ?? defaultData.like, icon: Heart },
    { label: 'Comment', value: selectedPersona?.comment ?? defaultData.comment, icon: MessageCircle },
    { label: 'Share', value: selectedPersona?.share ?? defaultData.share, icon: Share2 },
    { label: 'Save', value: selectedPersona?.save ?? defaultData.save, icon: Bookmark },
    { label: 'Follow', value: selectedPersona?.follow ?? defaultData.follow, icon: UserPlus },
  ];

  const swipeProb = selectedPersona?.swipeProb ?? defaultData.swipeProb;
  const predictedWatchTime = selectedPersona?.predictedWatchTime ?? defaultData.predictedWatchTime;
  const predictedWatchPercent = selectedPersona?.watchTimePercent ?? defaultData.predictedWatchPercent;
  const retentionCurve = selectedPersona?.retentionCurve ?? defaultData.retentionCurve;
  const qualitativeInsights = selectedPersona?.qualitativeInsights ?? defaultData.qualitativeInsights;
  
  return (
    <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
      
      {/* TOP CARD - Dynamic: Overall Audience Fit / Selected Persona */}
      {!selectedPersona ? (
        /* DEFAULT STATE: Overall Audience Fit */
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col items-center">
            {/* Circular Score */}
            <div className="relative w-28 h-28 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#f5f5f5"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#262626"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${defaultData.overallScore * 2.64} 264`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold text-gray-900">{defaultData.overallScore}</span>
                <span className="text-[10px] text-gray-400 font-medium">/100</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">Overall Audience Fit</p>
          </div>
        </div>
      ) : (
        /* SELECTED STATE: Selected Persona Card */
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          {/* Header */}
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">Selected Persona</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-0.5">{selectedPersona.name}</h2>
          <p className="text-xs text-gray-400 mb-4">{selectedPersona.personaId}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedPersona.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-700 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gray-100 mb-5" />
          
          {/* Overall Match */}
          <div className="bg-gray-50 rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 font-medium">Overall Match</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-900">{selectedPersona.engagement}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${selectedPersona.engagement}%` }}
              />
            </div>
          </div>
          
          {/* Watch Time */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <span className="text-sm text-gray-700 font-medium">Watch Time</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">{selectedPersona.watchTime}</span>
                <p className="text-[10px] text-gray-400">{selectedPersona.watchTimePercent}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENGAGEMENT PROBABILITIES */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">
          {selectedPersona ? 'Engagement Breakdown' : 'Engagement Probabilities'}
        </h3>
        
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

      {/* ATTENTION METRICS */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">Attention Metrics</h3>
        
        {/* Swipe Probability */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Swipe Probability</span>
            <span className="text-xs font-semibold text-gray-900 tabular-nums">{swipeProb}%</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${swipeProb}%` }}
            />
          </div>
        </div>
        
        {/* Predicted Watch Time */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Predicted Watch Time</span>
            <div className="text-right">
              <span className="text-xs font-semibold text-gray-900">{predictedWatchTime}</span>
              <p className="text-[10px] text-gray-400">{predictedWatchPercent}%</p>
            </div>
          </div>
        </div>
        
        {/* Retention Curve */}
        <div>
          <span className="text-xs text-gray-600 block mb-3">Retention Curve</span>
          <div className="flex items-end gap-1 h-8">
            {retentionCurve.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gray-700 rounded-sm transition-all duration-500"
                style={{ 
                  height: `${(value / 100) * 100}%`,
                  opacity: 0.4 + (value / 100) * 0.6
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* QUALITATIVE INSIGHTS */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Qualitative Insights</h3>
        
        <div className="space-y-4">
          {qualitativeInsights.map((insight, index) => (
            <div key={index} className="flex gap-3">
              <span className="text-gray-300 mt-0.5">•</span>
              <p className="text-xs text-gray-600 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}