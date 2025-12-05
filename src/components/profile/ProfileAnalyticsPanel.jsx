// src/components/profile/ProfileAnalyticsPanel.jsx

import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../lib/AuthContext";

const MAX_BULLETS_PER_SECTION = 3;

export default function ProfileAnalyticsPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false); // manual refresh only
  const [payload, setPayload] = useState(null);  // row from user_profile_analytics
  const [error, setError] = useState(null);      // string | null

  // --- Helper to load from user_profile_analytics -----------------------
  const fetchAnalyticsRow = useCallback(
    async () => {
      if (!user) return;

      try {
        const { data, error: dbError } = await supabase
          .from("user_profile_analytics")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (dbError) {
          console.error("fetchAnalyticsRow error:", dbError);
          // Don't nuke the UI, but surface a soft error
          setError(dbError.message || "DB_ERROR");
          return;
        }

        if (data) {
          setPayload(data);
          setError(null);
        } else {
          // No row yet – not an error, just "no analytics yet"
          setPayload(null);
        }
      } catch (e) {
        console.error("fetchAnalyticsRow exception:", e);
        setError("DB_FETCH_EXCEPTION");
      }
    },
    [user]
  );

  // Load DB row on mount / user change
  useEffect(() => {
    if (!user) {
      setPayload(null);
      setError(null);
      return;
    }
    fetchAnalyticsRow();
  }, [user, fetchAnalyticsRow]);

  // --- Manual refresh: call edge function, then reload DB row -----------
  const loadInsights = useCallback(
    async () => {
      if (!user || loading) return;

      setLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke(
        "get_global_insights",
        { body: { user_id: user.id } }
      );

      if (fnError) {
        console.error("get_global_insights error:", fnError, data);
        const errMsg = data?.error || fnError.message || "UNKNOWN_ERROR";
        setError(errMsg);
        // Keep whatever payload we already had
      } else if (data?.error === "NOT_ENOUGH_SIMULATIONS") {
        // Edge function returned soft error – no DB write
        setPayload(null);
        setError("NOT_ENOUGH_SIMULATIONS");
      } else {
        // Function succeeded and should have upserted into user_profile_analytics
        await fetchAnalyticsRow();
      }

      setLoading(false);
    },
    [user, loading, fetchAnalyticsRow]
  );

  const metrics = payload?.metrics;
  const insights = payload?.insights;
  const lastUpdated =
    payload?.last_refreshed_at ||
    payload?.updated_at ||
    payload?.created_at;

  const formatPct = (x) =>
    x === null || x === undefined ? "–" : `${Math.round(x * 100)}%`;

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
  const showSkeleton = loading && !payload; // only on first refresh with no data

  return (
    <aside
      className="
        border-l border-gray-100 pl-6
        sticky top-24
      "
    >
      {/* Outer card: fixed viewport height, inner: scroll */}
      <div className="relative h-[calc(100vh-220px)]">
        <div
          className="
            h-full
            rounded-xl
            bg-white
            border border-gray-100
            shadow-[0_4px_14px_rgba(0,0,0,0.04)]
            flex flex-col
            overflow-hidden
          "
        >
          {/* Header row stays fixed inside card */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
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
                className="
                  text-[10px] px-3 py-1 rounded-full
                  border border-gray-300
                  text-gray-700
                  bg-white
                  hover:bg-gray-100
                  active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition
                "
              >
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div
            className="
              flex-1
              overflow-y-auto
              premium-scroll
              px-4 pb-4 pt-1
              space-y-3
            "
          >
            {/* Initial idle / no-data message */}
            {!payload && !error && !showSkeleton && (
              <div className="mb-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                Click{" "}
                <span className="font-medium text-emerald-700">Refresh</span>{" "}
                to generate global insights from your simulations.
              </div>
            )}

            {/* Error hint (except "not enough sims") */}
            {!showSkeleton &&
              error &&
              error !== "NOT_ENOUGH_SIMULATIONS" && (
                <div className="mb-1 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
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
                <>
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
                        Average engagement
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
                            className="
                              group
                              border border-gray-100
                              rounded-lg
                              px-2 py-1.5
                              bg-white
                              transition-all
                              duration-150
                              ease-out
                              hover:-translate-y-0.5
                              hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)]
                              hover:border-gray-200
                              hover:bg-gray-50
                              cursor-default
                            "
                          >
                            <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-0.5 group-hover:text-gray-700">
                              {label}
                            </div>
                            <div className="text-[11px] font-semibold text-gray-900 group-hover:text-gray-950">
                              {formatPct(value)}
                            </div>
                          </div>

                        ))}
                      </div>
                    </section>
                  )}

                  <BulletSection title="Strengths" items={insights.strengths} />
                  <BulletSection title="Weaknesses" items={insights.weaknesses} />
                  <BulletSection
                    title="Storytelling"
                    items={insights.storytelling}
                  />
                  <BulletSection title="Editing" items={insights.editing} />
                  <BulletSection
                    title="Experiments to run"
                    items={insights.experiments}
                  />
                </>
              )}
          </div>
        </div>

        {/* Fades to match sims column */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent rounded-t-xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent rounded-b-xl" />
      </div>
    </aside>
  );
}

function BulletSection({ title, items }) {
  if (!items || !items.length) return null;

  // ensure we never show more than MAX_BULLETS_PER_SECTION
  const limitedItems = Array.isArray(items)
    ? items.slice(0, MAX_BULLETS_PER_SECTION)
    : [];

  if (!limitedItems.length) return null;

  return (
    <section>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1">
        {title}
      </div>
      <ul className="text-[11px] text-gray-800 space-y-1 pl-4 list-disc">
        {limitedItems.map((item, idx) => (
          <li key={idx} className="leading-snug">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
