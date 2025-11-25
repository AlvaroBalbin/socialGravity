import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SimulationHeader({ 
  simulationData,
  onTitleChange,
  onSave 
}) {
  // Generate default title
  const generateDefaultTitle = () => {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();
    return `Simulation – ${month} ${day}, ${year}`;
  };

  const [title, setTitle] = useState(simulationData?.title || generateDefaultTitle());
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInputsExpanded, setIsInputsExpanded] = useState(true);
  const [version, setVersion] = useState(1);
  const titleInputRef = useRef(null);

  // Get session data
  const sessionData = JSON.parse(sessionStorage.getItem('simulationData') || '{}');
  const audienceDescription = sessionData.audienceDescription || 'Not specified';
  const videoFileName = sessionData.videoFileName || 'video.mp4';

  // Calculate version from existing simulations
  useEffect(() => {
    const fetchVersion = async () => {
      const simulations = await base44.entities.Simulation.list();
      setVersion(simulations.length + 1);
    };
    fetchVersion();
  }, []);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    onTitleChange?.(title);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
      onTitleChange?.(title);
    }
  };

  const handleSave = async () => {
    if (isSaved || isSaving) return;
    
    setIsSaving(true);
    
    // Gather all simulation data
    const dataToSave = {
      title,
      audience_fit_score: 82, // From default analytics data
      top_persona: 'Creative Director',
      video_url: videoFileName,
      personas_data: [], // Would be populated with actual data
      retention_data: [95, 88, 80, 72, 65, 58, 52, 46, 40, 35],
      metrics: {
        audienceDescription,
        videoDuration: 12,
        swipeProbability: 18,
        predictedWatchTime: '8.4s',
        engagementProbabilities: {
          like: 78,
          comment: 34,
          share: 45,
          save: 61,
          follow: 23
        }
      }
    };

    await base44.entities.Simulation.create(dataToSave);
    
    setIsSaving(false);
    setIsSaved(true);
    onSave?.(dataToSave);
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
      {/* Section A: Title Row */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex-1">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-gray-900 outline-none w-full max-w-md"
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors text-left"
            >
              {title}
            </button>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaved || isSaving}
          className={`
            px-5 py-2 text-sm font-medium rounded-xl border transition-all duration-200
            ${isSaved 
              ? 'bg-white border-gray-200 text-gray-400 cursor-default' 
              : 'bg-white border-gray-900 text-gray-900 hover:shadow-md hover:-translate-y-0.5'
            }
          `}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : isSaved ? (
            <span className="flex items-center gap-1.5">
              Saved <Check className="w-3.5 h-3.5" />
            </span>
          ) : (
            'Save Simulation'
          )}
        </button>
      </div>

    </div>
  );
}