// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/supabaseClient";

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-[0.12em] text-slate-400 font-semibold">
        {label}
      </span>
      <span className="text-xl font-semibold text-slate-900">{value}</span>
      {sub && (
        <span className="text-[11px] text-slate-500 leading-snug">{sub}</span>
      )}
    </div>
  );
}

function Pill({ children, tone = "default" }) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : tone === "info"
      ? "bg-sky-50 text-sky-700 border-sky-100"
      : "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium border ${toneClasses}`}
    >
      {children}
    </span>
  );
}

// Helper: parse JSON whether it's a JS object or a JSON string
function parseMaybeJson(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// Helper: format probability (0–1) into %
function formatPercent(prob) {
  if (prob == null) return "—";
  const p = prob * 100;
  if (p < 1 && p > 0) return `${p.toFixed(1)}%`;
  if (p < 10) return `${p.toFixed(1)}%`;
  return `${Math.round(p)}%`;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userStats, setUserStats] = useState({
    count: 0,
    recent: [],
  });

  const [simStats, setSimStats] = useState({
    count: 0,
    recent: [],
  });

  const [videoCount, setVideoCount] = useState(0);

  const [feedbackStats, setFeedbackStats] = useState({
    count: 0,
    recent: [],
  });

  const [topCreators, setTopCreators] = useState([]);

  // selection + details
  const [selectedSimId, setSelectedSimId] = useState(null);
  const [selectedSim, setSelectedSim] = useState(null);
  const [selectedSimLoading, setSelectedSimLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          // Users – count + latest
          {
            data: users,
            count: userCount,
            error: usersErr,
          },
          // Simulations – count + latest
          {
            data: sims,
            count: simCount,
            error: simsErr,
          },
          // Videos – count only
          { count: videoCountRaw, error: videosErr },
          // Feedback – ALL rows, we'll slice + count in JS
          { data: feedbackRows, error: fbErr },
          // Top creators
          { data: analytics, error: analyticsErr },
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("id, created_at, full_name", { count: "exact" })
            .order("created_at", { ascending: false })
            .limit(8),

          supabase
            .from("simulations")
            .select("id, created_at, title, status, user_id", {
              count: "exact",
            })
            .order("created_at", { ascending: false })
            .limit(10),

          supabase
            .from("videos")
            .select("id", { count: "exact", head: true }),

          supabase
            .from("feedback")
            .select("id, created_at, message, account_email, contact_email"),

          supabase
            .from("user_profile_analytics")
            .select("user_id, simulations_count, metrics")
            .order("simulations_count", { ascending: false })
            .limit(5),
        ]);

        if (usersErr || simsErr || videosErr || fbErr || analyticsErr) {
          console.error(
            "Admin data errors:",
            usersErr,
            simsErr,
            videosErr,
            fbErr,
            analyticsErr
          );
          setError("Some admin data failed to load. Check console for details.");
        }

        setUserStats({
          count: userCount ?? 0,
          recent: users ?? [],
        });

        setSimStats({
          count: simCount ?? 0,
          recent: sims ?? [],
        });

        setVideoCount(videoCountRaw ?? 0);

        const fbList = feedbackRows ?? [];

        fbList.sort((a, b) => {
        const tb = new Date(b.created_at ?? 0).getTime();
        const ta = new Date(a.created_at ?? 0).getTime();
        return tb - ta; // newest first
        });

        setFeedbackStats({
          count: fbList.length,
          recent: fbList.slice(0, 8),
        });

        setTopCreators(analytics ?? []);
      } catch (err) {
        console.error("Admin dashboard error", err);
        setError("Unexpected error loading admin data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // --- simulation status breakdown ---------------------------------------

  const simStatusBreakdown = useMemo(() => {
    const result = { complete: 0, processing: 0, other: 0 };

    simStats.recent.forEach((s) => {
      if (s.status === "complete") result.complete += 1;
      else if (s.status === "processing") result.processing += 1;
      else result.other += 1;
    });

    return result;
  }, [simStats.recent]);

  // --- load full simulation details --------------------------------------

  const handleSelectSimulation = async (sim) => {
    setSelectedSimId(sim.id);
    setSelectedSim(null);
    setSelectedSimLoading(true);

    try {
      const { data, error } = await supabase
        .from("simulations")
        .select("*")
        .eq("id", sim.id)
        .single();

      if (error) {
        console.error("Failed to load simulation details", error);
        setSelectedSim(null);
      } else {
        setSelectedSim(data);
      }
    } catch (err) {
      console.error("Simulation details error", err);
      setSelectedSim(null);
    } finally {
      setSelectedSimLoading(false);
    }
  };

  // --- derived: parsed JSON from selected simulation ---------------------

  const simMetrics = useMemo(
    () => parseMaybeJson(selectedSim?.metrics),
    [selectedSim]
  );
  const simVisual = useMemo(
    () => parseMaybeJson(selectedSim?.visual_analysis),
    [selectedSim]
  );
  const simStory = useMemo(
    () => parseMaybeJson(selectedSim?.storytelling_insights),
    [selectedSim]
  );
  const simEditing = useMemo(
    () => parseMaybeJson(selectedSim?.editing_insights),
    [selectedSim]
  );

  const engagement = simMetrics?.engagement_probabilities;
  const attention = simMetrics?.attention_metrics;

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-slate-900 flex items-center justify-center text-[11px] font-semibold">
              SG
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                SocialGravity
              </span>
              <span className="text-[11px] text-slate-400">
                Internal Admin Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Go to app
            </button>
            <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white">
              Admin
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6 space-y-6">
        {/* Top row: stats + overview */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Users"
              value={userStats.count}
              sub="Profiles in the system"
            />
            <StatCard
              label="Simulations"
              value={simStats.count}
              sub="Total runs across all users"
            />
            <StatCard
              label="Videos"
              value={videoCount}
              sub="Processed or queued"
            />
            <StatCard
              label="Feedback"
              value={feedbackStats.count}
              sub="Messages from users"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-400">
                OVERVIEW
              </span>
              {loading ? (
                <span className="text-[11px] text-slate-400">Loading…</span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Updated just now
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Keep a quick pulse on creator activity: who&apos;s running
              simulations, how many videos are being processed, and what people
              are saying about SocialGravity.
            </p>
            {error && (
              <p className="text-[11px] text-red-500 mt-1">{error}</p>
            )}
          </div>
        </section>

        {/* Middle row: simulations + simulation detail */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent simulations list */}
          <div className="lg:col-span-2 rounded-3xl bg-white shadow-sm border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-slate-800 tracking-[0.12em] uppercase">
                  Recent Simulations
                </h2>
                <p className="text-[11px] text-slate-400">
                  Latest runs across all accounts
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>
                  complete: {simStatusBreakdown.complete} · processing:{" "}
                  {simStatusBreakdown.processing} · other:{" "}
                  {simStatusBreakdown.other}
                </span>
              </div>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {simStats.recent.map((sim) => {
                const isSelected = selectedSimId === sim.id;
                return (
                  <button
                    key={sim.id}
                    type="button"
                    onClick={() => handleSelectSimulation(sim)}
                    className={`w-full text-left px-5 py-3 border-b border-slate-100 last:border-b-0 flex items-center justify-between gap-4 transition ${
                      isSelected ? "bg-slate-50" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-medium text-slate-900">
                        {sim.title || "Untitled simulation"}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span>
                          {new Date(sim.created_at).toLocaleDateString()}
                        </span>
                        <span>·</span>
                        <span className="lowercase">{sim.status}</span>
                        {sim.user_id && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-[10px]">
                              {sim.user_id.slice(0, 8)}…
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <Pill
                      tone={
                        sim.status === "complete"
                          ? "success"
                          : sim.status === "processing"
                          ? "info"
                          : "default"
                      }
                    >
                      {sim.status}
                    </Pill>
                  </button>
                );
              })}

              {!simStats.recent.length && !loading && (
                <div className="px-5 py-6 text-center text-[11px] text-slate-400">
                  No simulations yet.
                </div>
              )}
            </div>
          </div>

          {/* Simulation details */}
          <div className="rounded-3xl bg-white shadow-sm border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-slate-800 tracking-[0.12em] uppercase">
                  Simulation Details
                </h2>
                <p className="text-[11px] text-slate-400">
                  Select a simulation on the left to inspect
                </p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3 max-h-[360px] overflow-y-auto text-[11px] text-slate-600">
              {selectedSimLoading && (
                <p className="text-slate-400">Loading simulation…</p>
              )}

              {!selectedSimLoading && !selectedSim && (
                <p className="text-slate-400">
                  No simulation selected yet. Click on a row in{" "}
                  <span className="font-semibold">Recent Simulations</span> to
                  see full details.
                </p>
              )}

              {selectedSim && (
                <>
                  {/* Title + meta */}
                  <div className="space-y-1">
                    <p className="text-[12px] font-semibold text-slate-900">
                      {selectedSim.title || "Untitled simulation"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(selectedSim.created_at).toLocaleString()} ·{" "}
                      {selectedSim.status}
                      {selectedSim.video_duration_seconds && (
                        <>
                          {" "}
                          · {selectedSim.video_duration_seconds}s
                        </>
                      )}
                    </p>
                    {selectedSim.user_id && (
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        User: {selectedSim.user_id}
                      </p>
                    )}
                  </div>

                  {/* Video link */}
                  {selectedSim.video_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Source video
                      </span>
                      <a
                        href={selectedSim.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-medium text-slate-900 underline underline-offset-2"
                      >
                        Open video
                      </a>
                    </div>
                  )}

                  {/* Metrics summary */}
                  {simMetrics && (
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400 font-semibold">
                          Metrics
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Audience fit:{" "}
                          <span className="font-semibold text-slate-800">
                            {simMetrics.overall_audience_fit ?? "—"}/100
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div>
                          <p className="text-[10px] text-slate-400">
                            Predicted watch time
                          </p>
                          <p className="text-[11px] font-semibold text-slate-800">
                            {attention?.predicted_watch_time_seconds
                              ? `${attention.predicted_watch_time_seconds.toFixed(
                                  1
                                )}s`
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">
                            Swipe probability
                          </p>
                          <p className="text-[11px] font-semibold text-slate-800">
                            {formatPercent(attention?.swipe_probability)}
                          </p>
                        </div>
                      </div>

                      {engagement && (
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          {["like", "comment", "share", "save", "follow"].map(
                            (k) => (
                              <div key={k} className="space-y-0.5">
                                <p className="text-[9px] uppercase tracking-[0.11em] text-slate-400">
                                  {k}
                                </p>
                                <p className="text-[11px] font-semibold text-slate-800">
                                  {formatPercent(engagement[k])}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visual analysis */}
                  {simVisual && (
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 font-semibold">
                        Visual analysis
                      </p>
                      {simVisual.visual_style && (
                        <p className="text-[11px] text-slate-700">
                          <span className="font-semibold">Style:</span>{" "}
                          {simVisual.visual_style}
                        </p>
                      )}
                      {simVisual.scene_summary && (
                        <p className="text-[11px] text-slate-600">
                          {simVisual.scene_summary}
                        </p>
                      )}
                      {Array.isArray(simVisual.aesthetic_tags) &&
                        simVisual.aesthetic_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {simVisual.aesthetic_tags.slice(0, 8).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  )}

                  {/* Storytelling / editing insights */}
                  {(simStory || simEditing) && (
                    <div className="grid grid-cols-1 gap-3">
                      {simStory && (
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 font-semibold">
                            Storytelling key changes
                          </p>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                            {(simStory.key_changes || [])
                              .slice(0, 3)
                              .map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {simEditing && (
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 font-semibold">
                            Editing key changes
                          </p>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                            {(simEditing.key_changes || [])
                              .slice(0, 3)
                              .map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Bottom row: users + feedback */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* New users */}
          <div className="rounded-3xl bg-white shadow-sm border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-slate-800 tracking-[0.12em] uppercase">
                  New Users
                </h2>
                <p className="text-[11px] text-slate-400">
                  Most recent sign-ups
                </p>
              </div>
            </div>
            <div className="max-h-[220px] overflow-y-auto">
              {userStats.recent.map((u) => (
                <div
                  key={u.id}
                  className="px-5 py-3 border-b border-slate-100 last:border-b-0"
                >
                  <p className="text-[12px] text-slate-900">
                    {u.full_name || "(no name)"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(u.created_at).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    {u.id}
                  </p>
                </div>
              ))}

              {!userStats.recent.length && !loading && (
                <div className="px-5 py-4 text-center text-[11px] text-slate-400">
                  No users yet.
                </div>
              )}
            </div>
          </div>

          {/* Latest feedback */}
          <div className="lg:col-span-2 rounded-3xl bg-white shadow-sm border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-slate-800 tracking-[0.12em] uppercase">
                  Latest Feedback
                </h2>
                <p className="text-[11px] text-slate-400">
                  What creators are saying
                </p>
              </div>
            </div>
            <div className="max-h-[220px] overflow-y-auto">
              {feedbackStats.recent.map((fb) => (
                <div
                  key={fb.id}
                  className="px-5 py-3 border-b border-slate-100 last:border-b-0 flex flex-col gap-1"
                >
                  <p className="text-[11px] text-slate-800 leading-snug">
                    {fb.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                    <span>
                      {new Date(fb.created_at).toLocaleString()}
                    </span>
                    <span>·</span>
                    <span>
                      {fb.account_email ||
                        fb.contact_email ||
                        "anonymous feedback"}
                    </span>
                  </div>
                </div>
              ))}

              {!feedbackStats.recent.length && !loading && (
                <div className="px-5 py-6 text-center text-[11px] text-slate-400">
                  No feedback yet.
                </div>
              )}
            </div>
          </div>
        </section>

        {loading && (
          <p className="text-[11px] text-slate-400">Loading admin data…</p>
        )}
      </main>
    </div>
  );
}
