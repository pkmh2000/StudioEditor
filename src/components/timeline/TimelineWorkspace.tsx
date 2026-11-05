import React, { useRef, useState, useEffect } from 'react';
import {
  Scissors,
  Trash2,
  Copy,
  Magnet,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Flag,
  Film,
  Music,
  Type,
  Mic,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { TimelineClip } from './TimelineClip';
import { formatTimecode, formatDuration } from '../../utils/timecode';
import { TrackType } from '../../types/timeline';

export const TimelineWorkspace: React.FC = () => {
  const {
    project,
    setCurrentTime,
    setZoom,
    toggleSnapping,
    selectClip,
    splitClipAtPlayhead,
    duplicateClip,
    deleteClip,
    addMarker,
    deleteMarker,
    toggleTrackMute,
    toggleTrackLock,
    toggleTrackHide,
  } = useProject();

  const rulerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const zoom = project.zoom; // pixels per second
  const totalWidthPx = Math.max(project.duration * zoom + 300, 1200);

  // Playhead scrubber drag handler
  const handleRulerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    setIsScrubbing(true);

    const rect = rulerRef.current.getBoundingClientRect();
    const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
    const clickX = e.clientX - rect.left + scrollLeft;
    const newTime = Math.max(0, Math.min(project.duration, clickX / zoom));
    setCurrentTime(newTime);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentScrollLeft = scrollContainerRef.current?.scrollLeft || 0;
      const currentX = moveEvent.clientX - rect.left + currentScrollLeft;
      const scrubTime = Math.max(0, Math.min(project.duration, currentX / zoom));
      setCurrentTime(scrubTime);
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Generate tick marks for the ruler
  const tickIntervalSec = zoom > 60 ? 1 : zoom > 30 ? 2 : 5;
  const numTicks = Math.ceil(project.duration / tickIntervalSec) + 2;
  const ticks = Array.from({ length: numTicks }, (_, i) => i * tickIntervalSec);

  const getTrackIcon = (type: TrackType) => {
    switch (type) {
      case 'visuals':
      case 'overlays':
        return <Film className="w-3.5 h-3.5 text-blue-400" />;
      case 'captions':
        return <Type className="w-3.5 h-3.5 text-amber-400" />;
      case 'voiceover':
        return <Mic className="w-3.5 h-3.5 text-emerald-400" />;
      case 'music':
        return <Music className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Film className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="h-64 md:h-72 bg-slate-900 border-t border-slate-800 flex flex-col select-none shrink-0 z-20">
      {/* 1. Timeline Toolbar */}
      <div className="h-10 bg-slate-950/80 px-4 flex items-center justify-between border-b border-slate-800 text-xs">
        {/* Left Toolbar: Edit actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => splitClipAtPlayhead()}
            disabled={!project.selectedClipId}
            title="Split Clip at Playhead (Ctrl+B)"
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-1.5 font-medium"
          >
            <Scissors className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            onClick={() => duplicateClip()}
            disabled={!project.selectedClipId}
            title="Duplicate Clip (Ctrl+D)"
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-1.5 font-medium"
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Duplicate</span>
          </button>

          <button
            onClick={() => deleteClip()}
            disabled={!project.selectedClipId}
            title="Delete Selected Clip (Backspace)"
            className="p-1.5 rounded text-slate-300 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-1.5 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1.5" />

          {/* Add Marker */}
          <button
            onClick={() => addMarker()}
            title="Add Marker at Playhead (M)"
            className="p-1.5 rounded text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors flex items-center gap-1.5 font-medium"
          >
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Marker</span>
          </button>

          {/* Snapping Magnet */}
          <button
            onClick={toggleSnapping}
            title={`Snapping: ${project.isSnappingEnabled ? 'ON' : 'OFF'} (S)`}
            className={`p-1.5 rounded transition-colors flex items-center gap-1.5 font-medium ${
              project.isSnappingEnabled ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Snap</span>
          </button>
        </div>

        {/* Right Toolbar: Zoom controls */}
        <div className="flex items-center gap-2 text-slate-400">
          <button
            onClick={() => setZoom(zoom - 10)}
            title="Zoom Out"
            className="p-1 hover:text-white rounded"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <input
            type="range"
            min="15"
            max="150"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value, 10))}
            className="w-20 md:w-28 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <button
            onClick={() => setZoom(zoom + 10)}
            title="Zoom In"
            className="p-1 hover:text-white rounded"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-slate-400 w-9 text-right">{zoom}px</span>
        </div>
      </div>

      {/* 2. Main Timeline Split View: Left (Track headers) + Right (Tracks & Ruler) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Headers Column */}
        <div className="w-48 md:w-56 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-20">
          {/* Top ruler spacer */}
          <div className="h-7 border-b border-slate-800 bg-slate-950/70 px-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>TRACKS</span>
            <span className="text-[10px] text-slate-400">LOCK/MUTE</span>
          </div>

          {/* Track Headers List */}
          <div className="flex-1 overflow-y-auto">
            {project.tracks.map((track) => (
              <div
                key={track.id}
                className="h-14 px-3 border-b border-slate-800/80 flex items-center justify-between gap-2 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {getTrackIcon(track.type)}
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-200 block truncate">
                      {track.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {track.clips.length} clip{track.clips.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    onClick={() => toggleTrackHide(track.id)}
                    title={track.isHidden ? 'Show Track' : 'Hide Track'}
                    className={`p-1 rounded hover:text-white ${track.isHidden ? 'text-amber-400' : ''}`}
                  >
                    {track.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => toggleTrackMute(track.id)}
                    title={track.isMuted ? 'Unmute Track' : 'Mute Track'}
                    className={`p-1 rounded hover:text-white ${track.isMuted ? 'text-rose-400' : ''}`}
                  >
                    {track.isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => toggleTrackLock(track.id)}
                    title={track.isLocked ? 'Unlock Track' : 'Lock Track'}
                    className={`p-1 rounded hover:text-white ${track.isLocked ? 'text-cyan-400' : ''}`}
                  >
                    {track.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Canvas */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-auto relative bg-slate-950"
          onClick={() => selectClip(null)}
        >
          <div style={{ width: `${totalWidthPx}px` }} className="relative min-h-full">
            {/* Timeline Ruler */}
            <div
              ref={rulerRef}
              onMouseDown={handleRulerMouseDown}
              className="h-7 bg-slate-950 border-b border-slate-800 sticky top-0 z-30 cursor-pointer select-none"
            >
              {ticks.map((timeSec) => (
                <div
                  key={timeSec}
                  style={{ left: `${timeSec * zoom}px` }}
                  className="absolute top-0 bottom-0 flex flex-col justify-between pointer-events-none"
                >
                  <div className="h-2 w-px bg-slate-700" />
                  <span className="font-mono text-[9px] text-slate-400 pl-1 select-none">
                    {formatDuration(timeSec)}
                  </span>
                  <div className="h-1.5 w-px bg-slate-700" />
                </div>
              ))}

              {/* Marker Pins on Ruler */}
              {project.markers.map((marker) => (
                <div
                  key={marker.id}
                  style={{ left: `${marker.time * zoom}px` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTime(marker.time);
                  }}
                  title={`${marker.label} (${formatDuration(marker.time)})`}
                  className="absolute top-0 w-3 h-5 -translate-x-1/2 flex flex-col items-center cursor-pointer group z-40"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-sm shadow-md"
                    style={{ backgroundColor: marker.color }}
                  />
                  <div
                    className="w-px h-full"
                    style={{ backgroundColor: marker.color }}
                  />
                </div>
              ))}
            </div>

            {/* Playhead Red Indicator Line */}
            <div
              style={{ left: `${project.currentTime * zoom}px` }}
              className="absolute top-0 bottom-0 w-px bg-rose-500 z-40 pointer-events-none transition-none"
            >
              <div className="w-3.5 h-3.5 bg-rose-500 rounded-sm -translate-x-[6px] -translate-y-[1px] shadow-md flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Tracks Lanes */}
            <div className="flex flex-col">
              {project.tracks.map((track) => (
                <div
                  key={track.id}
                  className={`h-14 border-b border-slate-800/60 relative ${
                    track.isHidden ? 'opacity-40' : ''
                  }`}
                >
                  {/* Subtle lane background grid */}
                  <div className="absolute inset-0 bg-slate-900/20" />

                  {/* Clips in this track */}
                  {track.clips.map((clip) => (
                    <TimelineClip
                      key={clip.id}
                      clip={clip}
                      trackId={track.id}
                      zoom={zoom}
                      isSelected={project.selectedClipId === clip.id}
                      onSelect={() => selectClip(clip.id, track.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
