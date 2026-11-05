import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Grid,
  ShieldAlert,
  Repeat,
  Gauge,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { renderPreviewFrame } from '../../utils/canvasRenderer';
import { formatTimecode } from '../../utils/timecode';

export const VideoPreviewPlayer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    project,
    togglePlay,
    setCurrentTime,
    setPlaybackRate,
    stepFrames,
    selectedClip,
    updateClip,
  } = useProject();

  const [showSafeAreas, setShowSafeAreas] = useState(false);
  const [showRuleOfThirds, setShowRuleOfThirds] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  // Dragging clip directly on the canvas preview to reposition
  const [isDraggingClip, setIsDraggingClip] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialClipX: number; initialClipY: number } | null>(null);

  // Render canvas frame on currentTime, tracks, resolution, or option changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderPreviewFrame(canvas, project.currentTime, project.tracks, project.resolution, {
      showSafeAreas,
      showRuleOfThirds,
      selectedClipId: project.selectedClipId,
    });
  }, [
    project.currentTime,
    project.tracks,
    project.resolution,
    project.selectedClipId,
    showSafeAreas,
    showRuleOfThirds,
  ]);

  // Handle Canvas mouse drag to position selected visual clip
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedClip || (selectedClip.type !== 'video' && selectedClip.type !== 'image')) return;

    setIsDraggingClip(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialClipX: selectedClip.visualProps?.x || 0,
      initialClipY: selectedClip.visualProps?.y || 0,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingClip || !dragStartRef.current || !selectedClip) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    // Convert pixel delta to normalized percentage
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const percentX = (deltaX / rect.width) * 100;
    const percentY = (deltaY / rect.height) * 100;

    updateClip(selectedClip.id, {
      visualProps: {
        ...(selectedClip.visualProps || { scale: 1, rotation: 0, opacity: 1, fit: 'contain' }),
        x: Math.round(dragStartRef.current.initialClipX + percentX),
        y: Math.round(dragStartRef.current.initialClipY + percentY),
      },
    });
  };

  const handleMouseUp = () => {
    setIsDraggingClip(false);
    dragStartRef.current = null;
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col bg-slate-950 relative select-none overflow-hidden"
    >
      {/* Top Floating Mini Overlay: Resolution & Safe Area Controls */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
          <span className="font-semibold text-slate-100">{project.resolution.label}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono text-cyan-400">{project.fps} FPS</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setShowSafeAreas((prev) => !prev)}
            title="Toggle Safe Area Guides (Action 90% & Title 80%)"
            className={`p-1.5 rounded transition-colors ${
              showSafeAreas ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowRuleOfThirds((prev) => !prev)}
            title="Toggle Rule of Thirds Grid"
            className={`p-1.5 rounded transition-colors ${
              showRuleOfThirds ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleToggleFullscreen}
            title="Fullscreen Preview"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Canvas Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0 relative">
        <div className="relative shadow-2xl shadow-black/80 rounded-lg overflow-hidden border border-slate-800 bg-black flex items-center justify-center max-w-full max-h-full">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={`max-w-full max-h-[calc(100vh-320px)] object-contain ${
              selectedClip && (selectedClip.type === 'video' || selectedClip.type === 'image')
                ? 'cursor-move'
                : 'cursor-default'
            }`}
            style={{
              aspectRatio: `${project.resolution.width} / ${project.resolution.height}`,
            }}
          />

          {/* Interactive feedback badge when dragging clip */}
          {isDraggingClip && selectedClip && (
            <div className="absolute bottom-3 left-3 bg-slate-950/90 text-cyan-400 border border-cyan-500/50 px-2 py-1 rounded text-[11px] font-mono pointer-events-none">
              X: {selectedClip.visualProps?.x}% Y: {selectedClip.visualProps?.y}%
            </div>
          )}
        </div>
      </div>

      {/* Bottom Transport Bar */}
      <div className="h-12 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between gap-4 select-none shrink-0 z-10">
        {/* Left: Timecode Display */}
        <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
          <span className="text-cyan-400 font-bold text-sm">
            {formatTimecode(project.currentTime, project.fps)}
          </span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">
            {formatTimecode(project.duration, project.fps)}
          </span>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Jump to start */}
          <button
            onClick={() => setCurrentTime(0)}
            title="Jump to Start"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Step Back 1 Frame */}
          <button
            onClick={() => stepFrames(-1)}
            title="Previous Frame (Left Arrow)"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={togglePlay}
            title={project.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            {project.isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
          </button>

          {/* Step Forward 1 Frame */}
          <button
            onClick={() => stepFrames(1)}
            title="Next Frame (Right Arrow)"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 -scale-x-100" />
          </button>

          {/* Jump to end */}
          <button
            onClick={() => setCurrentTime(project.duration)}
            title="Jump to End"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Audio Volume & Playback Rate */}
        <div className="flex items-center gap-3">
          {/* Loop toggle */}
          <button
            onClick={() => setIsLooping((l) => !l)}
            title={isLooping ? 'Looping enabled' : 'Looping disabled'}
            className={`p-1.5 rounded transition-colors ${
              isLooping ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-xs text-slate-300 bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
            <Gauge className="w-3 h-3 text-slate-400" />
            <select
              value={project.playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-transparent text-slate-200 cursor-pointer focus:outline-none font-mono"
            >
              <option value="0.5" className="bg-slate-900">0.5×</option>
              <option value="1.0" className="bg-slate-900">1.0×</option>
              <option value="1.25" className="bg-slate-900">1.25×</option>
              <option value="1.5" className="bg-slate-900">1.5×</option>
              <option value="2.0" className="bg-slate-900">2.0×</option>
            </select>
          </div>

          {/* Volume slider */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="p-1 text-slate-400 hover:text-slate-200"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseInt(e.target.value, 10));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
