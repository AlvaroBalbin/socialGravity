import React, { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { callEdge } from "@/lib/api";
import { uploadAndConvertVideoForSimulation } from "@/lib/uploadAndConvertVideoForSimulation";
import GravityLoader from "@/components/gravity/GravityLoader";

export default function SimulationModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [simulationTitle, setSimulationTitle] = useState("");
  const [audienceDescription, setAudienceDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [videoDurationSeconds, setVideoDurationSeconds] = useState(null);
  const [statusText, setStatusText] = useState("");

  const fileInputRef = useRef(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSimulationTitle("");
      setAudienceDescription("");
      setVideoFile(null);
      setFileName("");
      setError("");
      setIsTransitioning(false);
      setIsRunning(false);
      setVideoDurationSeconds(null);
      setStatusText("");
    }
  }, [isOpen]);

  const handleNext = () => {
    if (!simulationTitle.trim()) {
      setError("Please enter a title for this simulation");
      return;
    }

    if (!audienceDescription.trim()) {
      setError("Please describe your target audience");
      return;
    }

    setError("");
    setIsTransitioning(true);

    setTimeout(() => {
      setStep(2);
      setIsTransitioning(false);
    }, 200);
  };

  const handleBack = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setStep(1);
      setIsTransitioning(false);
    }, 200);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (
      !file.type.includes("video/mp4") &&
      !file.type.includes("video/quicktime")
    ) {
      setError("Please upload an MP4 or MOV file");
      return;
    }

    // Validate duration
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);

      if (video.duration > 60) {
        setError("Video must be 60 seconds or less");
        return;
      }

      setError("");
      setVideoFile(file);
      setFileName(file.name);
      setVideoDurationSeconds(video.duration);
    };

    video.src = URL.createObjectURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const handleBeginSimulation = async () => {
    if (!audienceDescription.trim()) {
      setError("Please describe your target audience");
      return;
    }

    if (!videoFile) {
      setError("Please upload a video");
      return;
    }

    if (!videoDurationSeconds) {
      setError("Unable to read video duration. Try re-uploading the file.");
      return;
    }

    setError("");
    setIsRunning(true);

    try {
      // 1) Create simulation record
      setStatusText("Setting up your simulation workspace…");
      const startRes = await callEdge("start_simulation", {
        audience_prompt: audienceDescription,
        title: simulationTitle,
      });

      const simulationId =
        startRes.simulation_id || startRes.simulationId || startRes.id;

      if (!simulationId) {
        throw new Error("start_simulation did not return simulation_id");
      }

      // 2) Upload + convert video server-side (MOV → MP4)
      setStatusText("Uploading your video and preparing frames…");
      const publicUrl = await uploadAndConvertVideoForSimulation(
        simulationId,
        videoFile
      );

      // 3) Attach video URL + duration to the simulation
      setStatusText("Saving video details and metadata…");
      await callEdge("set_video_url", {
        simulation_id: simulationId,
        video_url: publicUrl,
        video_duration_seconds: Math.round(videoDurationSeconds),
      });

      // 4) Transcribe video
      setStatusText("Transcribing your audio with AI…");
      await callEdge("transcribe_video", {
        simulation_id: simulationId,
      });

      // 5) Generate personas
      setStatusText("Building your audience personas…");
      await callEdge("generate_personas", {
        simulation_id: simulationId,
      });

      // 6) Analyze simulation (persona reactions / metrics)
      setStatusText("Running the audience reaction model…");
      await callEdge("analyze_simulation", {
        simulation_id: simulationId,
      });

      // 7) Start visual analysis (frames + visual summary)
      setStatusText("Scanning visuals for hooks and key frames…");
      await callEdge("start_visual_analysis", {
        simulation_id: simulationId,
      });

      // 8) Finalizing
      setStatusText("Finalising your simulation dashboard…");

      // Notify parent that everything is done
      onComplete({
        simulationId,
        audienceDescription,
        simulationTitle,
        videoFile,
        videoDurationSeconds,
        videoUrl: publicUrl, // final MP4 URL
      });
    } catch (err) {
      console.error("Error running simulation pipeline", err);
      setError(
        err?.message || "Something went wrong while running the simulation."
      );
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ animation: "modalFadeIn 0.45s ease-out" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/20 backdrop-blur-sm"
        onClick={isRunning ? undefined : onClose}
      />

      {/* Card */}
      <div
        className="relative bg-white rounded-[20px] border border-gray-100 p-8 w-full max-w-[500px] mx-4"
        style={{
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          animation: "cardSlideUp 0.4s ease-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={isRunning ? undefined : onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          disabled={isRunning}
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* Content / Loader */}
        <div
          className="transition-opacity duration-200"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          {isRunning ? (
            <div className="flex flex-col items-center justify-center py-10">
              <GravityLoader className="mb-4" />

              {/* key={statusText} forces remount so the fade anim replays */}
              <p
                key={statusText}
                className="text-sm text-gray-900 mb-1 status-fade"
              >
                {statusText || "Running your simulation…"}
              </p>

              <p className="text-xs text-gray-500 text-center max-w-xs">
                We’re analysing your video and preparing your simulation. This might take up to 2 minutes.
              </p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Name your simulation &amp; audience
                  </h2>

                  <p className="text-sm text-gray-500 font-light mb-6">
                    Give this simulation a clear title and describe who you want
                    to stress-test the content against.
                  </p>

                  {/* Simulation Title */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Simulation title
                    </label>

                    <input
                      type="text"
                      value={simulationTitle}
                      onChange={(e) => setSimulationTitle(e.target.value)}
                      placeholder="e.g. Hook Test - Skincare Gen-Z TikTok"
                      className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>

                  {/* Audience Description */}
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Audience description
                  </label>

                  <textarea
                    value={audienceDescription}
                    onChange={(e) => setAudienceDescription(e.target.value)}
                    placeholder="My audience is mostly late teens to mid-20s in the UK and US. It’s a mix of students and young professionals who follow me for my personality and chaotic energy. They’re into gym content, self-improvement, uni life, dating, and anything relatable or low-effort funny."
                    className="w-full h-32 p-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-gray-300 transition-colors"
                  />

                  {/* Error */}
                  {error && (
                    <p className="text-xs text-red-500 mt-2">{error}</p>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      disabled={isRunning}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleNext}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                      disabled={isRunning}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Upload your video
                  </h2>

                  <p className="text-sm text-gray-500 font-light mb-6">
                    Maximum 60 seconds (MP4 or MOV).
                  </p>

                  {/* Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <Upload
                          className="w-5 h-5 text-gray-400"
                          strokeWidth={1.5}
                        />
                      </div>

                      {fileName ? (
                        <p className="text-sm text-gray-900 font-medium">
                          {fileName}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Drag &amp; drop or click to upload
                        </p>
                      )}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {error && step === 2 && (
                    <p className="text-xs text-red-500 mt-2">{error}</p>
                  )}

                  <div className="flex justify-between gap-3 mt-6">
                    <button
                      onClick={handleBack}
                      className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      disabled={isRunning}
                    >
                      Back
                    </button>

                    <button
                      onClick={handleBeginSimulation}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-60"
                      disabled={isRunning}
                    >
                      {isRunning ? "Running simulation…" : "Begin Simulation"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes statusFade {
          from {
            opacity: 0;
            transform: translateY(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .status-fade {
          animation: statusFade 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}
