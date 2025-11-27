// src/components/profile/ProfileAnalyticsPanel.jsx

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../lib/AuthContext";

export default function ProfileAnalyticsPanel() {
  const { user } = useAuth();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null); // string | null

  const loadInsights = useCallback(
    async (opts = { initial: false }) => {
      if (!user) return;

      if (opts.initial) {
        setLoadingInitial(true);
        setPayload(null);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const { data, error } = await supabase.functions.invoke(
        "get_global_insights",
        {
          body: { user_id: user.id },
        }
      );

      if (error) {
        console.error("get_global_insights error:", error, data);
        // show useful error code if backend sent one
        setError(data?.error || error.message || "UNKNOWN_ERROR");
        if (opts.initial) {
          setPayload(null);
        }
      } else {
        if (data?.error === "NOT_ENOUGH_SIMULATIONS") {
          // treat as a special non-fatal state
          setError("NOT_ENOUGH_SIMULATIONS");
          setPayload(data);
        } else {
          setPayload(data);
          setError(null);
        }
      }

      if (opts.initial) setLoadingInitial(false);
      else setRefreshing(false);
    },
    [user?.id]
  );

  useEffect(() => {
    if (!user) return;
    loadInsights({ initial: true });
  }, [user?.id, loadInsights]);

  const metrics = payload?.metrics;
  const insights = payload?.insights;

  const formatPct = (x) =>
    x === null || x === undefined ? "–" : `${Math.round(x * 100)}%`;

  const showSkeleton = loadingInitial && !payload;

  return (
    <aside
    className="
      border-l border-gray-100 pl-6
      sticky top-24
      max-h-[calc(100vh-7rem)]
      overflow-y-auto
      pr-2
    "
  >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Analytics
        </h2>

        <button
          type="button"
          onClick={() => loadInsights({ initial: false })}
          disabled={refreshing || loadingInitial}
          className="text-[10px] px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {refreshing || loadingInitial ? "Refreshing…" : "Refresh"}
        </button>
      </div>

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
