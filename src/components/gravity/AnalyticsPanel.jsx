import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  UserPlus,
  Maximize2,
  X,
} from 'lucide-react';

// ---- Helpers -------------------------------------------------------------

// seconds -> "mm:ss"
function formatTimestamp(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return '0:00';
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// RetentionCurve expects values 0–1 (from generalFeedback / personaMetrics / global metrics)
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

// Normalised insight shape we want internally (JS version)
function makeEmptyInsights() {
  return {
    short_summary: [],
    what_worked: [],
    what_to_improve: [],
    key_changes: [],
    improvement_actions: [], // { label, timestamp_seconds, confidence }
  };
}

// Helper to normalize insights into the shape above
function normalizeInsights(raw) {
  if (!raw) return makeEmptyInsights();

  // Flat array -> treat as key_changes + derive simple actions
  if (Array.isArray(raw)) {
    const trimmed = raw.filter(Boolean);
    const improvement_actions = trimmed.slice(0, 4).map((label) => ({
      label,
      timestamp_seconds: 0,
      confidence: 0.7,
    }));

    return {
      short_summary: [],
      what_worked: [],
      what_to_improve: [],
      key_changes: trimmed,
      improvement_actions,
    };
  }

  // Object – new/mixed shape
  const short_summary = Array.isArray(raw.short_summary)
    ? raw.short_summary
    : [];
  const what_worked = Array.isArray(raw.what_worked) ? raw.what_worked : [];
  const what_to_improve = Array.isArray(raw.what_to_improve)
    ? raw.what_to_improve
    : [];
  const key_changes = Array.isArray(raw.key_changes) ? raw.key_changes : [];

  let improvement_actions = [];

  if (Array.isArray(raw.improvement_actions)) {
    improvement_actions = raw.improvement_actions
      .slice(0, 4)
      .map((item) => {
        if (!item) return null;

        // If model somehow returned strings
        if (typeof item === 'string') {
          return {
            label: item,
            timestamp_seconds: 0,
            confidence: 0.7,
          };
        }

        const label =
          typeof item.label === 'string'
            ? item.label
            : typeof item.text === 'string'
            ? item.text
            : typeof item.action === 'string'
            ? item.action
            : '';

        if (!label) return null;

        const ts =
          typeof item.timestamp_seconds === 'number'
            ? item.timestamp_seconds
            : 0;
        const confidence =
          typeof item.confidence === 'number' ? item.confidence : 0.7;

        return {
          label,
          timestamp_seconds: ts,
          confidence,
        };
      })
      .filter(Boolean);
  }

  // Fallback: derive actions from what_to_improve/key_changes
  if (!improvement_actions.length) {
    const merged = [...what_to_improve, ...key_changes]
      .map((s) => (s || '').trim())
      .filter(Boolean)
      .slice(0, 4);

    improvement_actions = merged.map((label) => ({
      label,
      timestamp_seconds: 0,
      confidence: 0.7,
    }));
  }

  // Ensure chronological order just in case
  improvement_actions = improvement_actions.sort(
    (a, b) => (a.timestamp_seconds ?? 0) - (b.timestamp_seconds ?? 0)
  );

  return {
    short_summary,
    what_worked,
    what_to_improve,
    key_changes,
    improvement_actions,
  };
}

// Tiny helper to grab 2–3 bullets for collapsed view
// Priority: short_summary -> improvement_actions.labels -> buckets
function summarizeBuckets(buckets, maxItems = 3) {
  if (buckets.short_summary && buckets.short_summary.length) {
    return buckets.short_summary.slice(0, maxItems);
  }

  if (buckets.improvement_actions && buckets.improvement_actions.length) {
    return buckets.improvement_actions
      .map((a) => (a.label || '').trim())
      .filter(Boolean)
      .slice(0, maxItems);
  }

  const all = [
    ...(buckets.what_worked || []),
    ...(buckets.what_to_improve || []),
    ...(buckets.key_changes || []),
  ]
    .map((s) => (s || '').trim())
    .filter(Boolean);

  return all.slice(0, maxItems);
}

function InsightGroup({ title, items }) {
  if (!items || !items.length) return null;

  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-800 mb-2">{title}</p>
      <div className="space-y-2 mb-3">
        {items.map((insight, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-gray-300 text-xs leading-none">•</span>
            <p className="text-xs text-gray-600 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImprovementGroup({ items, title = 'Improvement actions' }) {
  if (!items || !items.length) return null;

  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-800 mb-2">{title}</p>
      <div className="space-y-2 mb-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-[2px] inline-flex items-center justify-center px-1.5 py-[1px] rounded-full border border-gray-200 bg-gray-50 text-[10px] font-mono text-gray-500">
              {formatTimestamp(item.timestamp_seconds)}
            </span>
            <p className="text-xs text-gray-600 leading-relaxed">
              {item.label}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400">
        Timestamps are approximate edit points in the video.
      </p>
    </div>
  );
}

// Simple center modal for expanded insights
function InsightsModal({ title, buckets, onClose }) {
  if (!buckets) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-lg w-full mx-4 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <InsightGroup title="What worked" items={buckets.what_worked} />
          <ImprovementGroup items={buckets.improvement_actions} />
        </div>
      </div>
    </div>
  );
}

// ---- Engagement UI helpers -------------------------------------------

// These match your backend ENGAGEMENT_RANGES (fractions 0–1)
const ENGAGEMENT_UI_RANGES = {
  Like: { min: 0.01, max: 0.15 }, // 1–15%
  Comment: { min: 0.001, max: 0.02 }, // 0.1–2%
  Share: { min: 0.002, max: 0.04 }, // 0.2–4%
  Save: { min: 0.003, max: 0.06 }, // 0.3–6%
  Follow: { min: 0.0005, max: 0.015 }, // 0.05–1.5%
};

// Show nice percentages, including sub-1% values
function formatPercentFromProb(prob) {
  if (prob == null || Number.isNaN(prob)) return '–';
  const p = prob * 100;
  if (p > 0 && p < 1) return `${p.toFixed(1)}%`; // 0.1–0.9
  if (p < 10) return `${p.toFixed(1)}%`; // 1.0–9.9
  return `${Math.round(p)}%`; // 10%+
}

// Bar width is relative to that metric's own allowed range
function getEngagementBarWidth(label, prob) {
  if (prob == null || Number.isNaN(prob)) return 0;

  const cfg = ENGAGEMENT_UI_RANGES[label];
  if (!cfg) {
    // fallback: just straight percentage
    return Math.max(0, Math.min(prob * 100, 100));
  }

  const { min, max } = cfg;
  const clamped = Math.min(Math.max(prob, min), max);
  let ratio = (clamped - min) / (max - min); // 0–1 within that metric's band

  // ensure non-zero values don't look like a hairline
  const MIN_VISUAL_RATIO = 0.08; // 8%
  if (ratio > 0 && ratio < MIN_VISUAL_RATIO) ratio = MIN_VISUAL_RATIO;

  return ratio * 100;
}

/**
 * Props:
 *   - simulation: UISimulation
 *   - selectedPersona: UIPersonaSummary | null
 */
export default function AnalyticsPanel({ simulation, selectedPersona }) {
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showEditingModal, setShowEditingModal] = useState(false);

  if (!simulation) return null;

  const general = simulation.generalFeedback || {};
  const metrics = simulation.metrics || [];

  // If metrics is an object (new backend payload), pull global attention metrics from it
  const globalAttention =
    simulation.metrics &&
    !Array.isArray(simulation.metrics) &&
    simulation.metrics.attention_metrics
      ? simulation.metrics.attention_metrics
      : null;

  // Find persona metrics (probabilities, watch time, qualitative feedback…)
  const personaMetrics =
    selectedPersona &&
    Array.isArray(metrics) &&
    metrics.find((m) => m.personaId === selectedPersona.id);

  const isPersonaView = !!(selectedPersona && personaMetrics);

  const pct = (v) =>
    v == null || Number.isNaN(v) ? null : Math.round(v * 100);

  const overallScore = simulation.audienceFitScore ?? 0;

  // Persona match / fit score (0–100)
  const personaMatch = pct(personaMetrics?.alignmentScore);
  const dialScore =
    isPersonaView && personaMatch != null ? personaMatch : overallScore;

  const selectedPersonaLabel =
    selectedPersona?.label ||
    selectedPersona?.name ||
    selectedPersona?.displayName ||
    'Selected persona';

  // Engagement data source: persona vs general
  const engagementSource = isPersonaView ? personaMetrics : general;

  // keep raw probabilities (0–1) here
  const engagementData = [
    {
      label: 'Like',
      value: isPersonaView
        ? engagementSource.likeProbability
        : engagementSource.avgLikeProbability,
      icon: Heart,
    },
    {
      label: 'Comment',
      value: isPersonaView
        ? engagementSource.commentProbability
        : engagementSource.avgCommentProbability,
      icon: MessageCircle,
    },
    {
      label: 'Share',
      value: isPersonaView
        ? engagementSource.shareProbability
        : engagementSource.avgShareProbability,
      icon: Share2,
    },
    {
      label: 'Save',
      value: isPersonaView
        ? engagementSource.saveProbability
        : engagementSource.avgSaveProbability,
      icon: Bookmark,
    },
    {
      label: 'Follow',
      value: isPersonaView
        ? engagementSource.followProbability
        : engagementSource.avgFollowProbability,
      icon: UserPlus,
    },
  ];

  // Persona like % for subtitle
  const personaLikeProb = isPersonaView
    ? engagementSource.likeProbability
    : null;
  const personaLikePercent =
    personaLikeProb != null && !Number.isNaN(personaLikeProb)
      ? formatPercentFromProb(personaLikeProb)
      : '–';

  const swipeProb = pct(
    isPersonaView
      ? personaMetrics.swipeProbability
      : globalAttention?.swipe_probability ?? general.avgSwipeProbability
  );

  const predictedWatchTimeSeconds = isPersonaView
    ? personaMetrics.watchTimeSeconds
    : globalAttention?.predicted_watch_time_seconds ??
      general.avgWatchTimeSeconds;

  const predictedWatchTime =
    predictedWatchTimeSeconds == null
      ? '–'
      : `${predictedWatchTimeSeconds.toFixed(1)}s`;

  const videoDuration = simulation.videoDurationSeconds || 0;
  const watchTimePercent =
    videoDuration && predictedWatchTimeSeconds != null
      ? Math.round(
          Math.min(predictedWatchTimeSeconds / videoDuration, 1) * 100
        )
      : null;

  // 🔹 persona-specific retention curve if available; otherwise use global from metrics
  const globalRetentionCurve =
    (globalAttention?.retention_curve &&
      Array.isArray(globalAttention.retention_curve) &&
      globalAttention.retention_curve) ||
    general.retentionCurve ||
    [];

  const retentionCurve =
    isPersonaView && Array.isArray(personaMetrics?.retentionCurve)
      ? personaMetrics.retentionCurve
      : globalRetentionCurve;

  // ---- Persona-level story playbook (from generate_personas) -----------
  const personaStoryPlaybook =
    selectedPersona?.storyPlaybook ||
    selectedPersona?.story_playbook ||
    selectedPersona?.personaJson?.story_playbook ||
    selectedPersona?.persona_json?.story_playbook ||
    null;

  // Qualitative:
  // In persona view, prefer the per-persona story_playbook (with timestamps).
  const rawStorytelling = isPersonaView
    ? personaStoryPlaybook &&
      Array.isArray(personaStoryPlaybook.improvement_actions) &&
      personaStoryPlaybook.improvement_actions.length
      ? {
          improvement_actions: personaStoryPlaybook.improvement_actions,
          short_summary: Array.isArray(personaStoryPlaybook.short_summary)
            ? personaStoryPlaybook.short_summary
            : [],
          what_worked: Array.isArray(personaStoryPlaybook.what_worked)
            ? personaStoryPlaybook.what_worked
            : [],
          what_to_improve: Array.isArray(personaStoryPlaybook.what_to_improve)
            ? personaStoryPlaybook.what_to_improve
            : [],
          key_changes: Array.isArray(personaStoryPlaybook.key_changes)
            ? personaStoryPlaybook.key_changes
            : [],
        }
      : personaMetrics?.storytellingInsights ||
        personaMetrics?.qualitativeFeedback
    : general.storytellingInsights;

  const rawEditing = general.editingInsights;

  const storytelling = normalizeInsights(rawStorytelling);
  const editing = normalizeInsights(rawEditing);

  const storySummary = summarizeBuckets(storytelling, 3);
  const editingSummary = summarizeBuckets(editing, 3);

  // pick top 3 improvement actions for collapsed view
  const storyPreviewActions = storytelling.improvement_actions.slice(0, 3);
  const editingPreviewActions = editing.improvement_actions.slice(0, 3);

  return (
    <div className="w-full space-y-4">
      {/* 1) OVERALL / PERSONA FIT – top card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm w-full">
        <div className="flex flex-col items-center">
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
                strokeDasharray={`${dialScore * 2.64} 264`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold text-gray-900">
                {dialScore}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                /100
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {isPersonaView
              ? `${selectedPersonaLabel} Fit`
              : 'Overall Audience Fit'}
          </p>

          {isPersonaView && (
            <p className="text-[11px] text-gray-400 mt-2">
              Like:{' '}
              <span className="text-gray-800 font-medium">
                {personaLikePercent}
              </span>{' '}
              • Swipe:{' '}
              <span className="text-gray-800 font-medium">
                {swipeProb != null ? `${swipeProb}%` : '–'}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* 2) STORYTELLING – summary + expand */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Storytelling Insights
          </h3>
          {(storySummary.length ||
            storytelling.what_worked.length ||
            storytelling.improvement_actions.length) && (
            <button
              onClick={() => setShowStoryModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50"
            >
              <Maximize2 className="w-3 h-3" />
              View details
            </button>
          )}
        </div>

        {storyPreviewActions.length ? (
          // Show timestamped preview actions if we have them
          <div className="space-y-1.5">
            {storyPreviewActions.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="mt-[1px] inline-flex items-center justify-center px-1.5 py-[1px] rounded-full border border-gray-200 bg-gray-50 text-[9px] font-mono text-gray-500">
                  {formatTimestamp(item.timestamp_seconds)}
                </span>
                <p className="text-[11px] text-gray-600 leading-snug">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        ) : storySummary.length ? (
          // Fallback: plain text bullets
          <div className="space-y-1.5">
            {storySummary.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-300 text-xs leading-none">•</span>
                <p className="text-[11px] text-gray-600 leading-snug">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            Storytelling feedback will appear here once analysis completes.
          </p>
        )}
      </div>

      {/* 3) EDITING – summary + expand */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Editing Style Insights
          </h3>
          {(editingSummary.length ||
            editing.what_worked.length ||
            editing.improvement_actions.length) && (
            <button
              onClick={() => setShowEditingModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50"
            >
              <Maximize2 className="w-3 h-3" />
              View details
            </button>
          )}
        </div>

        {editingPreviewActions.length ? (
          // Show timestamped preview actions if we have them
          <div className="space-y-1.5">
            {editingPreviewActions.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="mt-[1px] inline-flex items-center justify-center px-1.5 py-[1px] rounded-full border border-gray-200 bg-gray-50 text-[9px] font-mono text-gray-500">
                  {formatTimestamp(item.timestamp_seconds)}
                </span>
                <p className="text-[11px] text-gray-600 leading-snug">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        ) : editingSummary.length ? (
          // Fallback: plain text bullets
          <div className="space-y-1.5">
            {editingSummary.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-300 text-xs leading-none">•</span>
                <p className="text-[11px] text-gray-600 leading-snug">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            Visual and pacing insights will appear here once analysis completes.
          </p>
        )}
      </div>

      {/* 4) ATTENTION METRICS + RETENTION  (ABOVE ENGAGEMENT) */}
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
            <span className="text-xs text-gray-600">
              Predicted Watch Time
            </span>
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

      {/* 5) ENGAGEMENT PROBABILITIES  (NOW BELOW ATTENTION) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">
          {isPersonaView ? 'Engagement Breakdown' : 'Engagement Probabilities'}
        </h3>

        <div className="space-y-4">
          {engagementData.map((item) => {
            const Icon = item.icon;
            const prob = item.value; // 0–1 fraction
            const display = formatPercentFromProb(prob);
            const width = getEngagementBarWidth(item.label, prob);

            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      className="w-3.5 h-3.5 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span className="text-xs text-gray-600">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 tabular-nums">
                    {display}
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODALS FOR EXPANDED INSIGHTS */}
      {showStoryModal && (
        <InsightsModal
          title="Storytelling Insights – Full Breakdown"
          buckets={storytelling}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      {showEditingModal && (
        <InsightsModal
          title="Editing Style Insights – Full Breakdown"
          buckets={editing}
          onClose={() => setShowEditingModal(false)}
        />
      )}
    </div>
  );
}
