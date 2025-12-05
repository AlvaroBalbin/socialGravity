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

// persona label -> max 2 words
function getTwoWordLabel(label) {
  if (!label || typeof label !== 'string') return '';
  const parts = label.trim().split(/\s+/);
  return parts.slice(0, 2).join(' ');
}

// 🔑 unified key helpers so persona <-> metrics matching actually works
const getPersonaKey = (p) =>
  p?.id ?? p?.personaId ?? p?.persona_id ?? p?.personaID ?? null;

const getMetricsKey = (m) =>
  m?.personaId ??
  m?.persona_id ??
  (m?.persona &&
    (m.persona.id ||
      m.persona.personaId ||
      m.persona.persona_id ||
      m.persona.personaID)) ??
  m?.id ??
  null;

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

      {/* Taller, chunkier monochrome bars */}
      <div className="flex items-end gap-1.5 h-16 relative px-1">
        {retentionCurve.map((rawValue, index) => {
          const value = Math.max(0, Math.min(rawValue ?? 0, 1)); // clamp 0–1
          const valuePct = Math.round(value * 100);

          // never make the bar visually tiny if there is *some* retention
          const barHeightPct = valuePct === 0 ? 6 : Math.max(valuePct, 14);

          const startTime = (index * segmentDuration).toFixed(1);
          const endTime = ((index + 1) * segmentDuration).toFixed(1);

          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className="flex-1 rounded-md bg-gray-900 cursor-pointer transition-all duration-300 relative"
              style={{
                height: `${barHeightPct}%`,
                opacity: isHovered
                  ? 1
                  : 0.35 + (valuePct / 100) * 0.55, // darker where retention is higher
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isHovered && (
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

// Minimal “View details” link-style button
function ViewDetailsButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-900 hover:underline"
    >
      <Maximize2 className="w-3 h-3" />
      <span>View details</span>
    </button>
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
  const [showAttentionMethod, setShowAttentionMethod] = useState(false);
  const [showEngagementMethod, setShowEngagementMethod] = useState(false);

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

  // 🔑 Find persona metrics using unified key matching
  const selectedPersonaKey = getPersonaKey(selectedPersona);

  const personaMetrics =
    selectedPersonaKey &&
    Array.isArray(metrics) &&
    metrics.find((m) => getMetricsKey(m) === selectedPersonaKey);

  const isPersonaView = !!(selectedPersona && personaMetrics);

  const pct = (v) =>
    v == null || Number.isNaN(v) ? null : Math.round(v * 100);

  const overallScore = simulation.audienceFitScore ?? 0;

  // Persona match / fit score (0–100)
  const personaMatch = pct(personaMetrics?.alignmentScore);
  const dialScore =
    isPersonaView && personaMatch != null ? personaMatch : overallScore;

  const rawPersonaLabel =
    selectedPersona?.label ||
    selectedPersona?.name ||
    selectedPersona?.displayName ||
    'Selected persona';

  const selectedPersonaLabel =
    getTwoWordLabel(rawPersonaLabel) || 'Selected persona';

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

  // ---- Overall spectrum summary sentence --------------------------------
  let fitWord = 'mixed';
  if (dialScore < 50) fitWord = 'weak';
  else if (dialScore >= 70 && dialScore < 85) fitWord = 'strong';
  else if (dialScore >= 85) fitWord = 'standout';

  const overallSummaryText = `This looks like a ${fitWord} fit for your overall audience.`;
  const personaSummaryText = `This looks like a ${fitWord} fit for ${selectedPersonaLabel}.`;

  const markerPosition = `${Math.min(Math.max(dialScore, 0), 100)}%`;
  const isDarkSide = dialScore >= 50; // 0–49 = light side, 50–100 = dark side

  return (
    <div className="w-full space-y-4">
      {/* 1) OVERALL / PERSONA FIT – simplified spectrum card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm w-full">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.12em]">
            {isPersonaView ? `${selectedPersonaLabel} fit` : 'Overall audience fit'}
          </span>

          <div className="mt-3 text-4xl font-semibold text-gray-900 tabular-nums">
            {dialScore}
          </div>
          <span className="text-[11px] text-gray-400">Score out of 100</span>

          {/* Spectrum gradient */}
          <div className="mt-5 w-full max-w-sm">
            <div className="relative h-1.5 rounded-full overflow-hidden bg-gradient-to-r from-white via-gray-400 to-black">
              {/* Tick marker: black on left half, white on right half */}
              <div
                style={{ left: markerPosition }}
                className={`absolute top-0 -translate-x-1/2 h-full w-[2px] rounded-full ${
                  isDarkSide ? 'bg-white' : 'bg-black'
                }`}
              />
            </div>

            <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
              <span>Reconsider</span>
              <span>Great</span>
            </div>
          </div>

          {/* One-sentence summary */}
          <p className="mt-3 text-[11px] text-gray-500 leading-snug">
            {isPersonaView ? personaSummaryText : overallSummaryText}
          </p>

          {isPersonaView && (
            <p className="text-[11px] text-gray-400 mt-2">
              Like{' '}
              <span className="text-gray-800 font-medium">
                {personaLikePercent}
              </span>{' '}
              • Swipe{' '}
              <span className="text-gray-800 font-medium">
                {swipeProb != null ? `${swipeProb}%` : '–'}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* 2) STORYTELLING – summary + expand */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Storytelling Insights
            </h3>
            <p className="text-[11px] text-gray-400">
              Your hook, ideas and narrative.
            </p>
          </div>
          {(storySummary.length ||
            storytelling.what_worked.length ||
            storytelling.improvement_actions.length) && (
            <ViewDetailsButton onClick={() => setShowStoryModal(true)} />
          )}
        </div>

        {storyPreviewActions.length ? (
          // Show timestamped preview actions if we have them
          <div className="space-y-1.5 mt-2">
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
          <div className="space-y-1.5 mt-2">
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
          <p className="text-xs text-gray-400 mt-2">
            Storytelling feedback will appear here once analysis completes.
          </p>
        )}
      </div>

      {/* 3) EDITING – summary + expand */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Editing Style Insights
            </h3>
            <p className="text-[11px] text-gray-400">
              Your pacing, cuts and visual style.
            </p>
          </div>
          {(editingSummary.length ||
            editing.what_worked.length ||
            editing.improvement_actions.length) && (
            <ViewDetailsButton onClick={() => setShowEditingModal(true)} />
          )}
        </div>

        {editingPreviewActions.length ? (
          // Show timestamped preview actions if we have them
          <div className="space-y-1.5 mt-2">
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
          <div className="space-y-1.5 mt-2">
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
          <p className="text-xs text-gray-400 mt-2">
            Visual and pacing insights will appear here once analysis completes.
          </p>
        )}
      </div>

      {/* 4) ATTENTION METRICS + RETENTION  (ABOVE ENGAGEMENT) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Attention Metrics
            </h3>
            <p className="text-[11px] text-gray-400">
              How likely they swipe and when.
            </p>
          </div>
          <button
            onClick={() => setShowAttentionMethod((v) => !v)}
            className="text-[10px] font-medium text-gray-500 hover:text-gray-900 underline-offset-2 hover:underline"
          >
            How do we know?
          </button>
        </div>

        {showAttentionMethod && (
          <p className="text-[10px] text-gray-400 mb-4">
            We estimate attention using models trained on thousands of short-form
            videos, combining your script, visuals and pacing with historical
            watch-time and scroll data.
          </p>
        )}

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
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {isPersonaView ? 'Engagement Breakdown' : 'Engagement Probabilities'}
            </h3>
            <p className="text-[11px] text-gray-400">
              How likely viewers engage.
            </p>
          </div>
          <button
            onClick={() => setShowEngagementMethod((v) => !v)}
            className="text-[10px] font-medium text-gray-500 hover:text-gray-900 underline-offset-2 hover:underline"
          >
            How do we know?
          </button>
        </div>

        {showEngagementMethod && (
          <p className="text-[10px] text-gray-400 mb-4">
            Engagement is predicted from patterns in similar posts and audiences:
            we model how viewers with matching interests have historically liked,
            commented, shared, saved and followed after watching content like this.
          </p>
        )}

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
