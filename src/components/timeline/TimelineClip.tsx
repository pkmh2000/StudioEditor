import React, { useRef, useState, useEffect } from 'react';
import { ClipItem } from '../../types/timeline';
import { useProject } from '../../context/ProjectContext';
import { formatDuration } from '../../utils/timecode';

interface TimelineClipProps {
  clip: ClipItem;
  trackId: string;
  zoom: number; // pixels per second
  isSelected: boolean;
  onSelect: () => void;
}

export const TimelineClip: React.FC<TimelineClipProps> = ({
  clip,
  trackId,
  zoom,
  isSelected,
  onSelect,
}) => {
  const { moveClip, trimClip } = useProject();
  const clipRef = useRef<HTMLDivElement | null>(null);

  // Dragging states
  const [isDraggingBody, setIsDraggingBody] = useState(false);
  const [isTrimmingLeft, setIsTrimmingLeft] = useState(false);
  const [isTrimmingRight, setIsTrimmingRight] = useState(false);

  // Position and Width in pixels
  const leftPx = clip.startTime * zoom;
  const widthPx = Math.max(clip.duration * zoom, 24); // minimum 24px wide

  // Drag handlers
  const handleMouseDownBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();

    if (e.button !== 0) return; // only left click
    setIsDraggingBody(true);

    const startX = e.clientX;
    const initialStartTime = clip.startTime;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaSec = deltaX / zoom;
      const newStartTime = Math.max(0, initialStartTime + deltaSec);
      moveClip(clip.id, newStartTime, trackId);
    };

    const handleMouseUp = () => {
      setIsDraggingBody(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDownTrimLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsTrimmingLeft(true);

    const startX = e.clientX;
    const initialStartTime = clip.startTime;
    const initialDuration = clip.duration;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaSec = deltaX / zoom;
      const newStartTime = Math.max(0, initialStartTime + deltaSec);
      const newDuration = Math.max(0.3, initialDuration - deltaSec);
      trimClip(clip.id, newStartTime, newDuration);
    };

    const handleMouseUp = () => {
      setIsTrimmingLeft(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDownTrimRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsTrimmingRight(true);

    const startX = e.clientX;
    const initialDuration = clip.duration;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaSec = deltaX / zoom;
      const newDuration = Math.max(0.3, initialDuration + deltaSec);
      trimClip(clip.id, clip.startTime, newDuration);
    };

    const handleMouseUp = () => {
      setIsTrimmingRight(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const isAudioType = clip.type === 'music' || clip.type === 'voiceover';

  return (
    <div
      ref={clipRef}
      onMouseDown={handleMouseDownBody}
      style={{
        left: `${leftPx}px`,
        width: `${widthPx}px`,
        backgroundColor: `${clip.color}30`,
        borderColor: isSelected ? '#38bdf8' : `${clip.color}80`,
      }}
      className={`absolute top-1 bottom-1 rounded-md border text-xs select-none cursor-grab active:cursor-grabbing overflow-hidden transition-shadow ${
        isSelected ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-950 z-20 shadow-lg' : 'hover:border-slate-400 z-10'
      } ${isDraggingBody ? 'opacity-80 scale-[0.99]' : ''}`}
    >
      {/* Left Trim Handle */}
      <div
        onMouseDown={handleMouseDownTrimLeft}
        title="Drag to trim start"
        className="absolute top-0 bottom-0 left-0 w-2.5 bg-white/20 hover:bg-cyan-400 cursor-ew-resize z-30 transition-colors flex items-center justify-center"
      >
        <div className="w-0.5 h-3 bg-white/70 rounded-full" />
      </div>

      {/* Clip Content Area */}
      <div className="h-full px-3 py-1 flex flex-col justify-between overflow-hidden pointer-events-none">
        <div className="flex items-center justify-between gap-1">
          <span className="font-semibold text-slate-100 truncate text-[11px] drop-shadow-sm">
            {clip.name}
          </span>
          <span className="font-mono text-[9px] text-slate-300 bg-slate-950/60 px-1 rounded shrink-0">
            {formatDuration(clip.duration)}
          </span>
        </div>

        {/* Audio Waveform visualization */}
        {isAudioType && clip.waveformData && (
          <div className="flex items-end gap-0.5 h-4 w-full opacity-70 overflow-hidden">
            {clip.waveformData.map((amp, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${Math.round(amp * 100)}%`,
                  backgroundColor: clip.color,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Trim Handle */}
      <div
        onMouseDown={handleMouseDownTrimRight}
        title="Drag to trim end"
        className="absolute top-0 bottom-0 right-0 w-2.5 bg-white/20 hover:bg-cyan-400 cursor-ew-resize z-30 transition-colors flex items-center justify-center"
      >
        <div className="w-0.5 h-3 bg-white/70 rounded-full" />
      </div>
    </div>
  );
};
