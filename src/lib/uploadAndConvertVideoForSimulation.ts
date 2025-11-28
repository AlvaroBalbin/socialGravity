// src/lib/uploadAndConvertVideoForSimulation.ts
import { supabase } from "../supabaseClient";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForVideoReady(videoId: string, maxAttempts = 60) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data, error } = await supabase
      .from("videos")
      .select("status, mp4_path, error_message")
      .eq("id", videoId)
      .single();

    if (error) {
      console.error("Error polling videos table:", error);
      throw new Error("Failed to check video conversion status");
    }

    if (!data) {
      await wait(2000);
      continue;
    }

    if (data.status === "ready" && data.mp4_path) {
      return data.mp4_path as string;
    }

    if (data.status === "error") {
      throw new Error(data.error_message || "Video conversion failed");
    }

    // Still processing
    await wait(5000);
  }

  throw new Error("Timed out waiting for video conversion");
}

/**
 * Uploads the raw video file for a given simulation, triggers conversion,
 * waits until the MP4 is ready, and returns the public MP4 URL.
 *
 * NOTE: This version does NOT require authentication. user_id will be null.
 */
export async function uploadAndConvertVideoForSimulation(
  simulationId: string,
  file: File
): Promise<string> {
  // 1) Upload original file to Storage in the existing `videos` bucket
  const ext = file.name.split(".").pop() || "mp4";
  const originalPath = `${simulationId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("videos")
    .upload(originalPath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw new Error(
      uploadError.message || "Failed to upload video to storage"
    );
  }

  // 2) Insert row into `videos` table (user_id is null for anon users)
  const { error: insertError } = await supabase.from("videos").insert({
    id: simulationId,
    original_path: originalPath,
    status: "processing",
    // user_id: null  // implicitly null, no auth
  });

  if (insertError) {
    console.error("Insert error:", insertError);
    throw new Error(insertError.message || "Failed to create video record");
  }

  // 3) Call Edge Function to trigger the Railway converter
  const { data: fnData, error: fnError } = await supabase.functions.invoke(
    "request_video_conversion",
    {
      body: { video_id: simulationId },
    }
  );

  // With the new function, fnError should almost always be null
  if (fnError) {
    console.error("request_video_conversion unexpected error:", fnError);
    throw new Error(
      fnError.message ||
        "Failed to trigger video conversion (edge function unexpected error)."
    );
  }

  if (!fnData || (fnData as any).ok === false) {
    const msg =
      (fnData as any)?.error ||
      "Video conversion service reported an error triggering conversion.";
    console.error("request_video_conversion returned error:", fnData);
    throw new Error(msg);
  }

  // 4) Poll the `videos` table until conversion is done
  const mp4Path = await waitForVideoReady(simulationId);

  // 5) Get public URL for the converted MP4
  const { data: publicUrlData } = supabase.storage
    .from("videos")
    .getPublicUrl(mp4Path);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Failed to generate public URL for converted video");
  }

  return publicUrlData.publicUrl;
}
