/*********************************
 * Backend (Supabase) types
 *********************************/

export interface BackendStoryEditingBuckets {
  what_worked?: string[];
  what_to_improve?: string[];
  key_changes?: string[];
}

export interface BackendVisualAnalysis {
  visual_style: string;
  scene_summary: string;
  aesthetic_tags: string[];
  pacing_description: string;
  quality_assessment: {
    lighting_ok: string;
    edit_quality: string;
    resolution_ok: boolean;
  };
  on_screen_text_usage: string;

  // Nested buckets we care about
  storytelling_insights?: BackendStoryEditingBuckets | null;
  editing_style_insights?: BackendStoryEditingBuckets | null;
}

export interface BackendSimulation {
  id: string;
  created_at: string;
  audience_prompt: string | null;
  video_url: string | null;
  transcript: string | null;
  status: string;
  error_message: string | null;
  video_duration_seconds: number | null;

  // Can be jsonb (object) or text, so allow both
  visual_analysis: BackendVisualAnalysis | string | null;
}

export interface BackendPersonaJson {
  id: string; // "persona_01"
  short_label: string;
  display_name: string;
  one_line_summary: string;

  goals: {
    primary_goals: string[];
    secondary_goals: string[];
  };

  background: {
    kpis: string[];
    career_path: string;
    responsibilities: string[];
  };

  product_fit: {
    key_use_cases: string[];
    onboarding_ideas: string[];
    most_valuable_features: string[];
  };

  demographics: {
    geography: string;
    seniority: string;
    industries: string[];
    company_size: string;
    company_type: string;
    typical_titles: string[];
  };

  frustrations: {
    pains: string[];
    current_solutions: string[];
    limitations_of_current_solutions: string[];
  };

  communication: {
    tone_and_style: string;
    content_they_trust: string[];
    preferred_channels: string[];
  };

  buying_journey: {
    triggers: string[];
    stakeholders: string[];
    deal_breakers: string[];
    evaluation_criteria: string[];
  };
}

export interface BackendPersonaRow {
  id: string; // row id (uuid)
  simulation_id: string;
  persona_id: string; // "persona_01"
  label: string; // "Hobbyist Maker"
  persona_json: BackendPersonaJson;
}

export interface BackendReactionJson {
  metadata: {
    platform: string;
    simulation_version: string;
  };
  persona_id: string;
  watch_time_final: number;

  alignment_analysis: {
    tone_alignment: number;
    pacing_alignment: number;
    message_alignment: number;
    aesthetic_alignment: number;
    overall_alignment_score: number;
    persona_specific_explanation: string;
  };

  emotional_reaction: {
    arousal: number;
    valence: number;
    keywords: string[];
  };

  engagement_reasoning: {
    tone_alignment: number;
    relevance_score: number;
    pacing_alignment: number;
    hook_quality_score: number;
    aesthetic_alignment: number;
    sound_alignment_score: number;
    alignment_with_interests: number;
    visual_clarity_alignment: number;
  };

  qualitative_feedback: string[];

  like_probability_final: number;
  save_probability_final: number;
  share_probability_final: number;
  swipe_probability_final: number;
  follow_probability_final: number;
  comment_probability_final: number;
}

export interface BackendReactionRow {
  id: string; // row id (uuid)
  simulation_id: string;
  persona_id: string;
  reaction_json: BackendReactionJson;
}

export interface GetSimulationResponse {
  simulation: BackendSimulation;
  personas: BackendPersonaRow[];
  reactions: BackendReactionRow[];
}

/*********************************
 * UI-facing / mapped types
 *********************************/

export interface UIPersonaSummary {
  /** "persona_01" */
  id: string;
  /** Short label like "Hobbyist Maker" */
  label: string;
  /** persona_json.short_label */
  shortLabel: string;
  /** persona_json.display_name */
  displayName: string;
  /** persona_json.one_line_summary */
  oneLineSummary: string;

  /** Full raw persona JSON from backend */
  personaJson: BackendPersonaJson;

  /** Full DB row in case we ever need ids / FKs */
  rawRow: BackendPersonaRow;

  /**
   * Derived: overall match / engagement score for this persona (0–100),
   * based on alignment_analysis.overall_alignment_score.
   * This is what TopPersonasRow + GravityOrbit use.
   */
  engagement?: number | null;

  /** Derived: watch time for this persona (seconds) */
  watchTimeSeconds?: number | null;

  /** Derived: formatted watch time string (e.g. "38.0s") for UI */
  watchTime?: string | null;

  /** Optional tags for persona pill chips */
  tags?: string[];
}

export interface UIPersonaMetrics {
  personaId: string;
  label: string;

  /** overall_alignment_score (0–1) */
  alignmentScore: number;
  /** alignmentScore as 0–100 percentage */
  alignmentScorePercent: number;

  /** watch_time_final in seconds */
  watchTimeSeconds: number;

  likeProbability: number;
  saveProbability: number;
  shareProbability: number;
  swipeProbability: number;
  followProbability: number;
  commentProbability: number;

  emotionalKeywords: string[];
  emotionalValence: number;
  emotionalArousal: number;

  engagement: BackendReactionJson["engagement_reasoning"];

  qualitativeFeedback: string[];
  explanation: string; // persona_specific_explanation

  /** Full raw reaction JSON from backend */
  raw: BackendReactionJson;

  /** Full DB row */
  rawRow: BackendReactionRow;
}

/**
 * Buckets for insights panels
 * (Storytelling + Editing)
 *
 * NOTE: we keep snake_case keys because AnalyticsPanel.normalizeInsights
 * expects what_worked / what_to_improve / key_changes.
 */
export interface UIInsightBuckets {
  what_worked: string[];
  what_to_improve: string[];
  key_changes: string[];
}

/**
 * Aggregated / general view metrics for the right-hand panel
 * when no persona is selected.
 */
export interface UIGeneralFeedback {
  avgLikeProbability: number | null;
  avgCommentProbability: number | null;
  avgShareProbability: number | null;
  avgSaveProbability: number | null;
  avgFollowProbability: number | null;
  avgSwipeProbability: number | null;
  avgWatchTimeSeconds: number | null;

  storytellingInsights: UIInsightBuckets;
  editingInsights: UIInsightBuckets;

  /** Simple 0–1 values used to draw a retention bar chart */
  retentionCurve: number[];
}

export interface UISimulation {
  id: string;
  createdAt: string;

  /** Used in headers – we fake this from audience_prompt */
  title: string;

  status: string;
  errorMessage: string | null;

  audiencePrompt: string | null;

  videoUrl: string | null;
  videoDurationSeconds: number | null;
  transcript: string | null;

  visualAnalysis: BackendVisualAnalysis | null;

  /** Derived: average alignment score across personas (0–100) */
  audienceFitScore: number | null;

  /** Persona summaries for orbit + cards */
  personas: UIPersonaSummary[];

  /** Alias used by existing components (GravityOrbit, TopPersonasRow) */
  personas_data: UIPersonaSummary[];

  /** Metrics for AnalyticsPanel etc */
  metrics: UIPersonaMetrics[];

  /** Aggregated overall feedback for "general" view */
  generalFeedback: UIGeneralFeedback;

  /** Full raw backend response for debugging / future use */
  raw: GetSimulationResponse;
}

/*********************************
 * Helpers
 *********************************/

// Safely parse visual_analysis which might be text or already JSON
function parseVisualAnalysis(
  visual: BackendSimulation["visual_analysis"]
): BackendVisualAnalysis | null {
  if (!visual) return null;

  if (typeof visual === "object") {
    return visual as BackendVisualAnalysis;
  }

  try {
    return JSON.parse(visual as string) as BackendVisualAnalysis;
  } catch {
    console.warn("Failed to parse visual_analysis JSON");
    return null;
  }
}

/**
 * Turn a flat list of bullets into:
 * - what_worked
 * - what_to_improve
 * - key_changes
 *
 * Used only as fallback if backend buckets are missing.
 */
function bucketizeFlatInsights(list: string[] | null | undefined): UIInsightBuckets {
  const items = (list ?? [])
    .map((s) => (s || "").trim())
    .filter(Boolean);

  if (!items.length) {
    return { what_worked: [], what_to_improve: [], key_changes: [] };
  }

  const half = Math.ceil(items.length / 2);
  const workedRaw = items.slice(0, half);
  const improveRaw = items.slice(half);

  const what_worked = workedRaw.slice(0, 3);
  const what_to_improve = improveRaw.slice(0, 3);
  const key_changes = items.slice(0, 3);

  return { what_worked, what_to_improve, key_changes };
}

function fromBackendBuckets(
  src: BackendStoryEditingBuckets | null | undefined
): UIInsightBuckets {
  if (!src) {
    return { what_worked: [], what_to_improve: [], key_changes: [] };
  }
  return {
    what_worked: (src.what_worked ?? []).filter(Boolean),
    what_to_improve: (src.what_to_improve ?? []).filter(Boolean),
    key_changes: (src.key_changes ?? []).filter(Boolean),
  };
}

/*********************************
 * Mapper
 *********************************/

/**
 * Map the raw get_simulation response from Supabase
 * into the UI shape expected by the Gravity components.
 */
export function mapSimulationToUI(response: GetSimulationResponse): UISimulation {
  const { simulation, personas = [], reactions = [] } = response;

  const visualAnalysis = parseVisualAnalysis(simulation.visual_analysis);

  // Index personas by persona_id for easy lookup when building metrics
  const personaById = new Map<string, BackendPersonaRow>();
  personas.forEach((p) => {
    personaById.set(p.persona_id, p);
  });

  // --- Persona summaries (structure only, metrics added later) ---
  const uiPersonas: UIPersonaSummary[] = personas.map((p) => {
    const pj = p.persona_json;

    return {
      id: p.persona_id,
      label: p.label || pj.short_label || p.persona_id,
      shortLabel: pj.short_label || p.label || p.persona_id,
      displayName: pj.display_name || p.label || p.persona_id,
      oneLineSummary: pj.one_line_summary || "",
      personaJson: pj,
      rawRow: p,
      engagement: null,
      watchTimeSeconds: null,
      watchTime: null,
      tags: [], // you can derive tags later if you want
    };
  });

  // Map for later augmentation
  const uiPersonaById = new Map<string, UIPersonaSummary>();
  uiPersonas.forEach((p) => uiPersonaById.set(p.id, p));

  // --- Persona metrics from reactions ---
  const uiMetrics: UIPersonaMetrics[] = reactions.map((r) => {
    const personaRow = personaById.get(r.persona_id);
    const label =
      personaRow?.label ||
      personaRow?.persona_json?.short_label ||
      r.persona_id;

    const rx = r.reaction_json;
    const align = rx.alignment_analysis;
    const emo = rx.emotional_reaction;

    const metric: UIPersonaMetrics = {
      personaId: r.persona_id,
      label,

      alignmentScore: align.overall_alignment_score,
      alignmentScorePercent: align.overall_alignment_score * 100,

      watchTimeSeconds: rx.watch_time_final,

      likeProbability: rx.like_probability_final,
      saveProbability: rx.save_probability_final,
      shareProbability: rx.share_probability_final,
      swipeProbability: rx.swipe_probability_final,
      followProbability: rx.follow_probability_final,
      commentProbability: rx.comment_probability_final,

      emotionalKeywords: emo.keywords || [],
      emotionalValence: emo.valence,
      emotionalArousal: emo.arousal,

      engagement: rx.engagement_reasoning,
      qualitativeFeedback: rx.qualitative_feedback || [],
      explanation: align.persona_specific_explanation,

      raw: rx,
      rawRow: r,
    };

    // 🔗 Push engagement + watch time onto the matching UIPersonaSummary
    const personaSummary = uiPersonaById.get(metric.personaId);
    if (personaSummary) {
      personaSummary.engagement = Math.round(metric.alignmentScore * 100);
      personaSummary.watchTimeSeconds = metric.watchTimeSeconds;

      if (typeof metric.watchTimeSeconds === "number") {
        personaSummary.watchTime = `${metric.watchTimeSeconds.toFixed(1)}s`;
      } else {
        personaSummary.watchTime = null;
      }
    }

    return metric;
  });

  // ---------- Derived audience fit ----------

  let audienceFitScore: number | null = null;
  if (uiMetrics.length > 0) {
    const avgAlignment =
      uiMetrics.reduce((sum, m) => sum + (m.alignmentScore || 0), 0) /
      uiMetrics.length;
    audienceFitScore = Math.round(avgAlignment * 100);
  }

  // ---------- General feedback (overall view) ----------

  let avgLike: number | null = null;
  let avgComment: number | null = null;
  let avgShare: number | null = null;
  let avgSave: number | null = null;
  let avgFollow: number | null = null;
  let avgSwipe: number | null = null;
  let avgWatch: number | null = null;

  if (uiMetrics.length > 0) {
    const n = uiMetrics.length;
    const sum = (fn: (m: UIPersonaMetrics) => number) =>
      uiMetrics.reduce((acc, m) => acc + fn(m), 0);

    avgLike = sum((m) => m.likeProbability) / n;
    avgComment = sum((m) => m.commentProbability) / n;
    avgShare = sum((m) => m.shareProbability) / n;
    avgSave = sum((m) => m.saveProbability) / n;
    avgFollow = sum((m) => m.followProbability) / n;
    avgSwipe = sum((m) => m.swipeProbability) / n;
    avgWatch = sum((m) => m.watchTimeSeconds) / n;
  }

  // --- Storytelling insights ---
  let storytellingInsights: UIInsightBuckets;

  if (visualAnalysis?.storytelling_insights) {
    // Preferred path: take buckets directly from visual_analysis
    storytellingInsights = fromBackendBuckets(
      visualAnalysis.storytelling_insights
    );
  } else {
    // Fallback: aggregate persona qualitative feedback
    const storytellingFlat: string[] = Array.from(
      new Set(uiMetrics.flatMap((m) => m.qualitativeFeedback || []))
    ).slice(0, 8);

    storytellingInsights = bucketizeFlatInsights(storytellingFlat);
  }

  // --- Editing insights ---
  let editingInsights: UIInsightBuckets;

  if (visualAnalysis?.editing_style_insights) {
    editingInsights = fromBackendBuckets(
      visualAnalysis.editing_style_insights
    );
  } else {
    // Fallback heuristic from visual_analysis basic fields
    const editingFlat: string[] = [];
    const va = visualAnalysis;

    if (va) {
      if (va.visual_style) {
        editingFlat.push(`Visual style: ${va.visual_style}`);
      }
      if (va.pacing_description) {
        editingFlat.push(`Pacing: ${va.pacing_description}`);
      }
      if (va.on_screen_text_usage) {
        editingFlat.push(`On-screen text: ${va.on_screen_text_usage}`);
      }
      if (va.quality_assessment) {
        editingFlat.push(
          `Lighting: ${va.quality_assessment.lighting_ok}, edit quality: ${va.quality_assessment.edit_quality}.`
        );
      }
      if (va.aesthetic_tags?.length) {
        editingFlat.push(`Aesthetic tags: ${va.aesthetic_tags.join(", ")}.`);
      }
    }

    editingInsights = bucketizeFlatInsights(editingFlat);
  }

  // Simple retention curve placeholder – 10 bars, 0–1 values
  const retentionCurve: number[] = [];
  const baseRetention =
    avgWatch && simulation.video_duration_seconds
      ? Math.min(avgWatch / simulation.video_duration_seconds, 1)
      : 0.7; // fallback

  for (let i = 0; i < 10; i++) {
    // decay slightly over time
    retentionCurve.push(Math.max(baseRetention - i * 0.05, 0.1));
  }

  const generalFeedback: UIGeneralFeedback = {
    avgLikeProbability: avgLike,
    avgCommentProbability: avgComment,
    avgShareProbability: avgShare,
    avgSaveProbability: avgSave,
    avgFollowProbability: avgFollow,
    avgSwipeProbability: avgSwipe,
    avgWatchTimeSeconds: avgWatch,
    storytellingInsights,
    editingInsights,
    retentionCurve,
  };

  const uiSimulation: UISimulation = {
    id: simulation.id,
    createdAt: simulation.created_at,

    // Use audience_prompt as the main title for now
    title: simulation.audience_prompt || "Simulation",

    status: simulation.status,
    errorMessage: simulation.error_message,

    audiencePrompt: simulation.audience_prompt,

    videoUrl: simulation.video_url,
    videoDurationSeconds: simulation.video_duration_seconds,
    transcript: simulation.transcript,

    visualAnalysis,

    audienceFitScore,

    personas: uiPersonas,
    personas_data: uiPersonas,
    metrics: uiMetrics,

    generalFeedback,

    raw: response,
  };

  return uiSimulation;
}
