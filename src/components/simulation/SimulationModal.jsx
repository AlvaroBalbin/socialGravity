import React, { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

export default function SimulationModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [audienceDescription, setAudienceDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fileInputRef = useRef(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAudienceDescription('');
      setVideoFile(null);
      setFileName('');
      setError('');
    }
  }, [isOpen]);

  const handleNext = () => {
    if (!audienceDescription.trim()) {
      setError('Please describe your target audience');
      return;
    }
    setError('');
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
    if (!file.type.includes('video/mp4') && !file.type.includes('video/quicktime')) {
      setError('Please upload an MP4 or MOV file');
      return;
    }

    // Validate duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > 60) {
        setError('Video must be 60 seconds or less');
        return;
      }
      setError('');
      setVideoFile(file);
      setFileName(file.name);
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

  const handleBeginSimulation = () => {
    if (!videoFile) {
      setError('Please upload a video');
      return;
    }
    onComplete({
      audienceDescription,
      videoFile,
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        animation: 'modalFadeIn 0.5s ease-out',
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Card */}
      <div 
        className="relative bg-white rounded-[20px] border border-gray-100 p-8 w-full max-w-[500px] mx-4"
        style={{
          boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          animation: 'cardSlideUp 0.5s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* Step Content */}
        <div 
          className="transition-opacity duration-200"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          {step === 1 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Describe your target audience
              </h2>
              <p className="text-sm text-gray-500 font-light mb-6">
                Tell us who the content is intended for. The AI will generate personas based on your description.
              </p>

              <textarea
                value={audienceDescription}
                onChange={(e) => setAudienceDescription(e.target.value)}
                placeholder="Example: Gen Z viewers who like skincare, quiet luxury, aesthetics and thoughtful product reviews."
                className="w-full h-32 p-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-gray-300 transition-colors"
              />

              {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
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
                    <Upload className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  </div>
                  {fileName ? (
                    <p className="text-sm text-gray-900 font-medium">{fileName}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
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

              {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
              )}

              <div className="flex justify-between gap-3 mt-6">
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBeginSimulation}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Begin Simulation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cardSlideUp {
          from { 
            opacity: 0; 
            transform: translateY(8px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}