// src/components/profile/ProfileAnalyticsPanel.jsx

import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../lib/AuthContext";

const CACHE_KEY_PREFIX = "profileAnalytics:";

export default function ProfileAnalyticsPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);      // only for manual refresh
  const [payload, setPayload] = useState(null);       // last good result
  const [error, setError] = useState(null);           // string | null

  const cacheKey = user ? `${CACHE_KEY_PREFIX}${user.id}` : null;

  // Load last cached payload on mount / user change
  useEffect(() => {
    if (!cacheKey) return;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setPayload(parsed);
        setError(parsed?.error ?? null);
      }
    } catch (e) {
      console.warn("Failed to read cached analytics:", e);
    }
  }, [cacheKey]);

  const loadInsights = useCallback(
    async () => {
      if (!user || loading) return;

      setLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke(
        "get_global_insights",
        {
          body: { user_id: user.id },
        }
      );

      if (fnError) {
        console.error("get_global_insights error:", fnError, data);
        const errMsg = data?.error || fnError.message || "UNKNOWN_ERROR";
        setError(errMsg);
        // keep old payload so UI doesn’t flash empty
      } else {
        // 🔹 ADD A TIMESTAMP ON THE CLIENT
        const stamped = {
          ...data,
          last_refreshed_at: new Date().toISOString(),
        };

        if (stamped?.error === "NOT_ENOUGH_SIMULATIONS") {
          setError("NOT_ENOUGH_SIMULATIONS");
          setPayload(stamped);
        } else {
          setPayload(stamped);
          setError(null);
        }

        // Cache the latest payload so we can restore it on reload
        if (cacheKey) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(stamped));
          } catch (e) {
            console.warn("Failed to cache analytics:", e);
          }
        }
      }

      setLoading(false);
    },
    [user, loading, cacheKey]
  );

  const metrics = payload?.metrics;
  const insights = payload?.insights;
  const lastUpdated = payload?.last_refreshed_at;

  const formatPct = (x) =>
    x === null || x === undefined ? "–" : `${Math.round(x * 100)}%`;

  // --- "time since last refresh" helper -----------------------------
  const formatSince = (timestamp) => {
    if (!timestamp) return null;
    const updatedAt = new Date(timestamp).getTime();
    const now = Date.now();
    if (Number.isNaN(updatedAt)) return null;

    const diffMs = now - updatedAt;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 30) return "just now";
    if (diffSec < 60) return `${diffSec} sec${diffSec === 1 ? "" : "s"} ago`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60)
      return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;

    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24)
      return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;

    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  };

  const sinceLabel = lastUpdated ? formatSince(lastUpdated) : null;
  const showSkeleton = loading && !payload; // only show skeleton on very first fetch

  return (
    <aside
      className="
        border-l border-gray-100 pl-6
        sticky top-24
        max-h-[calc(100vh-9rem)]
        overflow-y-auto
        pr-2
      "
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Analytics
        </h2>

        <div className="flex items-center gap-2">
          {sinceLabel && (
            <span className="text-[10px] text-gray-400">
              Updated {sinceLabel}
            </span>
          )}

          <button
            type="button"
            onClick={loadInsights}
            disabled={loading || !user}
            className="text-[10px] px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Initial idle message if nothing loaded yet */}
      {!payload && !error && !showSkeleton && (
        <div className="mb-3 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
          Click <span className="font-medium text-emerald-700">Refresh</span> to
          generate global insights from your simulations.
        </div>
      )}

      {/* Error hint (except "not enough sims") */}
      {!showSkeleton &&
        error &&
        error !== "NOT_ENOUGH_SIMULATIONS" && (
          <div className="mb-3 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <div>Something went wrong loading analytics.</div>
            <div className="mt-0.5 text-[10px] text-red-500/80">
              Error: {error}
            </div>
          </div>
        )}

      {showSkeleton && (
        <div className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-3">
          Crunching your simulations…
        </div>
      )}

      {!showSkeleton && error === "NOT_ENOUGH_SIMULATIONS" && (
        <div className="text-xs text-gray-600 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-3 py-3">
          <p className="font-medium text-gray-800 mb-1">
            Not enough data yet.
          </p>
          <p>Run at least 3 simulations to unlock global insights.</p>
        </div>
      )}

      {!showSkeleton &&
        payload &&
        insights &&
        !["NOT_ENOUGH_SIMULATIONS"].includes(error || "") && (
          <div className="space-y-3">
            {/* Global summary */}
            <section className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1">
                Overall
              </div>
              <p className="text-xs text-gray-800 leading-relaxed">
                {insights.global_summary}
              </p>
              <p className="mt-1 text-[10px] text-gray-400">
                Based on {payload.simulations_count} simulations.
              </p>
            </section>

            {/* Metrics */}
            {metrics && (
              <section>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1">
                  Average probabilities
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {[
                    ["Like", metrics.avg_like_probability],
                    ["Comment", metrics.avg_comment_probability],
                    ["Share", metrics.avg_share_probability],
                    ["Save", metrics.avg_save_probability],
                    ["Follow", metrics.avg_follow_probability],
                    ["Swipe", metrics.avg_swipe_probability],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="border border-gray-100 rounded-lg px-2 py-1.5 bg-white"
                    >
                      <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-0.5">
                        {label}
                      </div>
                      <div className="text-[11px] font-semibold text-gray-900">
                        {formatPct(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <BulletSection title="Strengths" items={insights.strengths} />
            <BulletSection title="Weaknesses" items={insights.weaknesses} />
            <BulletSection title="Storytelling" items={insights.storytelling} />
            <BulletSection title="Editing" items={insights.editing} />
            <BulletSection
              title="Experiments to run"
              items={insights.experiments}
            />
          </div>
        )}
    </aside>
  );
}

function BulletSection({ title, items }) {
  if (!items || !items.length) return null;

  return (
    <section>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1">
        {title}
      </div>
      <ul className="text-[11px] text-gray-800 space-y-1 pl-4 list-disc">
        {items.map((item, idx) => (
          <li key={idx} className="leading-snug">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
