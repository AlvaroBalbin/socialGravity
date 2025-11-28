// src/lib/convertToMp4.ts
import { createFFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: false });

let loaded = false;

async function ensureLoaded() {
  if (!loaded) {
    await ffmpeg.load();
    loaded = true;
  }
}

// File -> Uint8Array (so we don't need fetchFile)
async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const buf = await file.arrayBuffer();
  return new Uint8Array(buf);
}

// Check if this environment can safely run ffmpeg.wasm
function canUseFfmpeg(): boolean {
  // Must support SharedArrayBuffer + cross-origin isolation
  const hasSAB =
    typeof (globalThis as any).SharedArrayBuffer !== "undefined";
  const isolated =
    (globalThis as any).crossOriginIsolated === true;

  // ffmpeg.wasm is flaky in Firefox, so skip there for now
  const ua = navigator.userAgent.toLowerCase();
  const isFirefox = ua.includes("firefox");

  return hasSAB && isolated && !isFirefox;
}

/**
 * If the file is .mov and the environment supports ffmpeg.wasm,
 * convert it to MP4 (H.264 + AAC).
 * Otherwise return the original file unchanged.
 */
export async function convertToMp4IfNeeded(file: File): Promise<File> {
  const name = file.name.toLowerCase();
  const isMov =
    file.type === "video/quicktime" || name.endsWith(".mov");

  // Already MP4/WebM/etc – no conversion needed
  if (!isMov) return file;

  // Environment can't safely run ffmpeg -> just return original file
  if (!canUseFfmpeg()) {
    console.warn(
      "[ffmpeg] Environment not compatible (no SAB / not isolated / Firefox). Skipping MOV->MP4 conversion."
    );
    return file;
  }

  try {
    await ensureLoaded();

    // Clean up previous runs (ignore errors)
    try {
      ffmpeg.FS("unlink", "input.mov");
    } catch {}
    try {
      ffmpeg.FS("unlink", "output.mp4");
    } catch {}

    // Write MOV into ffmpeg FS
    ffmpeg.FS("writeFile", "input.mov", await fileToUint8Array(file));

    // Convert MOV -> MP4
    await ffmpeg.run(
      "-i",
      "input.mov",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-movflags",
      "+faststart",
      "output.mp4"
    );

    // Uint8Array with MP4 bytes
    const data = ffmpeg.FS("readFile", "output.mp4") as Uint8Array;

    // Cast for TS; Uint8Array is a valid BlobPart at runtime
    return new File(
      [data as any],
      file.name.replace(/\.mov$/i, ".mp4"),
      {
        type: "video/mp4",
      }
    );
  } catch (err) {
    console.error(
      "[ffmpeg] Conversion failed, using original file instead:",
      err
    );
    // Fall back so the rest of the pipeline still runs
    return file;
  }
}
