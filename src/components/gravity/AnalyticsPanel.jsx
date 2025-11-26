import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  UserPlus,
  Clock,
  TrendingUp,
} from 'lucide-react';

// RetentionCurve now expects values 0–1 (from generalFeedback.retentionCurve)
function RetentionCurve({ retentionCurve = [], videoDuration = 12 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  if (!retentionCurve.length) return null;

  const segmentDuration = videoDuration / retentionCurve.length;

  return (
    <div>
      <span className="text-xs text-gray-600 block mb-3">Retention Curve</span>
      <div className="flex items-end gap-1 h-8 relative">
        {retentionCurve.map((rawValue, index) => {
          const value = Math.max(0, Math.min(rawValue ?? 0, 1)); // clamp 0–1
          const valuePct = Math.round(value * 100);

          const startTime = (index * segmentDuration).toFixed(1);
          const endTime = ((index + 1) * segmentDuration).toFixed(1);

          return (
            <div
              key={index}
              className="flex-1 bg-gray-700 rounded-sm transition-all duration-300 cursor-pointer hover:opacity-100 relative"
              style={{
                height: `${valuePct}%`,
                opacity:
                  hoveredIndex === index ? 1 : 0.4 + (valuePct / 100) * 0.6,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap z-10 pointer-events-none"
                  style={{ animation: 'fadeIn 0.15s ease-out' }}
                >
                  <p className="text-[10px] text-gray-700 font-medium">
                    {startTime}s – {endTime}s
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {valuePct}% retained
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Helper to normalize insights:
// - if it's already an object {what_worked, what_to_improve, key_changes} → use it
// - if it's just an array → treat it as "key_changes" so we still show it
function normalizeInsights(raw) {
  if (!raw) return { what_worked: [], what_to_improve: [], key_changes: [] };

  // Already structured
  if (
    typeof raw === 'object' &&
    !Array.isArray(raw) &&
    ('what_worked' in raw || 'what_to_improve' in raw || 'key_changes' in raw)
  ) {
    return {
      what_worked: raw.what_worked ?? [],
      what_to_improve: raw.what_to_improve ?? [],
      key_changes: raw.key_changes ?? [],
    };
  }

  // Legacy flat array
  if (Array.isArray(raw)) {
    return {
      what_worked: [],
      what_to_improve: [],
      key_changes: raw,
    };
  }

  return { what_worked: [], what_to_improve: [], key_changes: [] };
}

function InsightGroup({ title, items }) {
  if (!items || !items.length) return null;

  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-800 mb-2">
        {title}
      </p>
      <div className="space-y-2 mb-3">
        {items.map((insight, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-gray-300 mt-0.5">•</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Props:
 *   - simulation: UISimulation (from mappers.ts)
 *   - selectedPersona: UIPersonaSummary | null
 */
export default function AnalyticsPanel({ simulation, selectedPersona }) {
  if (!simulation) return null;

  const general = simulation.generalFeedback || {};
  const metrics = simulation.metrics || [];

  // Find persona metrics (probabilities, watch time, qualitative feedback…)
  const personaMetrics =
    selectedPersona &&
    metrics.find((m) => m.personaId === selectedPersona.id);

  const isPersonaView = !!(selectedPersona && personaMetrics);

  const pct = (v) =>
    v == null || Number.isNaN(v) ? null : Math.round(v * 100);

  const overallScore = simulation.audienceFitScore ?? 0;

  // Engagement data source: persona vs general
  const engagementSource = isPersonaView ? personaMetrics : general;

  const engagementData = [
    {
      label: 'Like',
      value: pct(
        isPersonaView
          ? engagementSource.likeProbability
          : engagementSource.avgLikeProbability
      ),
      icon: Heart,
    },
    {
      label: 'Comment',
      value: pct(
        isPersonaView
          ? engagementSource.commentProbability
          : engagementSource.avgCommentProbability
      ),
      icon: MessageCircle,
    },
    {
      label: 'Share',
      value: pct(
        isPersonaView
          ? engagementSource.shareProbability
          : engagementSource.avgShareProbability
      ),
      icon: Share2,
    },
    {
      label: 'Save',
      value: pct(
        isPersonaView
          ? engagementSource.saveProbability
          : engagementSource.avgSaveProbability
      ),
      icon: Bookmark,
    },
    {
      label: 'Follow',
      value: pct(
        isPersonaView
          ? engagementSource.followProbability
          : engagementSource.avgFollowProbability
      ),
      icon: UserPlus,
    },
  ];

  const swipeProb = pct(
    isPersonaView
      ? personaMetrics.swipeProbability
      : general.avgSwipeProbability
  );

  const predictedWatchTimeSeconds = isPersonaView
    ? personaMetrics.watchTimeSeconds
    : general.avgWatchTimeSeconds;

  const predictedWatchTime =
    predictedWatchTimeSeconds == null
      ? '–'
      : `${predictedWatchTimeSeconds.toFixed(1)}s`;

  // Very rough “percentage of video watched”
  const videoDuration = simulation.videoDurationSeconds || 0;
  const watchTimePercent =
    videoDuration && predictedWatchTimeSeconds != null
      ? Math.round(
          Math.min(predictedWatchTimeSeconds / videoDuration, 1) * 100
        )
      : null;

  const retentionCurve = general.retentionCurve || [];

  // Qualitative:
  // Persona view can still fall back to old qualitativeFeedback array
  const rawStorytelling = isPersonaView
    ? personaMetrics.storytellingInsights || personaMetrics.qualitativeFeedback
    : general.storytellingInsights;

  const rawEditing = general.editingInsights;

  const storytelling = normalizeInsights(rawStorytelling);
  const editing = normalizeInsights(rawEditing);

  const personaName =
    selectedPersona?.displayName ||
    selectedPersona?.label ||
    selectedPersona?.shortLabel ||
    'Selected Persona';

  const personaId = selectedPersona?.id || selectedPersona?.personaId;

  const personaTags = selectedPersona?.tags || [];

  const personaMatch = pct(personaMetrics?.alignmentScore);

  const personaWatchTimeStr =
    personaMetrics?.watchTimeSeconds == null
      ? '–'
      : `${personaMetrics.watchTimeSeconds.toFixed(1)}s`;

  const personaWatchPercent =
    videoDuration && personaMetrics?.watchTimeSeconds != null
      ? Math.round(
          Math.min(personaMetrics.watchTimeSeconds / videoDuration, 1) * 100
        )
      : null;

  return (
    <div className="w-full space-y-4">
      {/* TOP CARD - Dynamic: Overall Audience Fit / Selected Persona */}
      {!isPersonaView ? (
        // DEFAULT STATE: Overall Audience Fit
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm w-full">
          <div className="flex flex-col items-center">
            {/* Circular Score */}
            <div className="relative w-28 h-28 mb-4">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
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
                  strokeDasharray={`${overallScore * 2.64} 264`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold text-gray-900">
                  {overallScore}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  /100
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">Overall Audience Fit</p>
          </div>
        </div>
      ) : (
        // SELECTED STATE: Selected Persona Card
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
          {/* Header */}
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">
            Selected Persona
          </p>
          <h2 className="text-lg font-semibold text-gray-900 mb-0.5">
            {personaName}
          </h2>
          {personaId && (
            <p className="text-xs text-gray-400 mb-4">{personaId}</p>
          )}

          {/* Tags */}
          {personaTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {personaTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-5" />

          {/* Overall Match */}
          <div className="bg-gray-50 rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 font-medium">
                Overall Match
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-900">
                  {personaMatch != null ? `${personaMatch}%` : '–'}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${personaMatch ?? 0}%` }}
              />
            </div>
          </div>

          {/* Watch Time */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <span className="text-sm text-gray-700 font-medium">
                  Watch Time
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {personaWatchTimeStr}
                </span>
                <p className="text-[10px] text-gray-400">
                  {personaWatchPercent != null ? `${personaWatchPercent}%` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENGAGEMENT PROBABILITIES */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">
          {isPersonaView ? 'Engagement Breakdown' : 'Engagement Probabilities'}
        </h3>

        <div className="space-y-4">
          {engagementData.map((item) => {
            const Icon = item.icon;
            const value = item.value ?? 0;
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      className="w-3.5 h-3.5 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 tabular-nums">
                    {item.value != null ? `${item.value}%` : '–'}
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ATTENTION METRICS */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">
          Attention Metrics
        </h3>

        {/* Swipe Probability */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Swipe Probability</span>
            <span className="text-xs font-semibold text-gray-900 tabular-nums">
              {swipeProb != null ? `${swipeProb}%` : '–'}
            </span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${swipeProb ?? 0}%` }}
            />
          </div>
        </div>

        {/* Predicted Watch Time */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Predicted Watch Time</span>
            <div className="text-right">
              <span className="text-xs font-semibold text-gray-900">
                {predictedWatchTime}
              </span>
              <p className="text-[10px] text-gray-400">
                {watchTimePercent != null ? `${watchTimePercent}%` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Retention Curve */}
        <RetentionCurve
          retentionCurve={retentionCurve}
          videoDuration={videoDuration || 12}
        />
      </div>

      {/* QUALITATIVE INSIGHTS */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-6 w-full">
        {/* STORYTELLING */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Storytelling Insights
          </h3>

          {storytelling.what_worked.length ||
          storytelling.what_to_improve.length ||
          storytelling.key_changes.length ? (
            <>
              <InsightGroup
                title="What worked"
                items={storytelling.what_worked}
              />
              <InsightGroup
                title="What to improve"
                items={storytelling.what_to_improve}
              />
              <InsightGroup
                title="Key changes"
                items={storytelling.key_changes}
              />
            </>
          ) : (
            <p className="text-xs text-gray-400">
              Storytelling feedback will appear here once analysis completes.
            </p>
          )}
        </div>

        {/* EDITING */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Editing Style Insights
          </h3>

          {editing.what_worked.length ||
          editing.what_to_improve.length ||
          editing.key_changes.length ? (
            <>
              <InsightGroup
                title="What worked"
                items={editing.what_worked}
              />
              <InsightGroup
                title="What to improve"
                items={editing.what_to_improve}
              />
              <InsightGroup
                title="Key changes"
                items={editing.key_changes}
              />
            </>
          ) : (
            <p className="text-xs text-gray-400">
              Visual and pacing insights will appear here once analysis
              completes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
