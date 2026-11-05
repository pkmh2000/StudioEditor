import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ProjectState,
  ClipItem,
  TimelineTrack,
  TrackType,
  ResolutionConfig,
  TimelineMarker,
  ProjectHistorySnapshot,
} from '../types/timeline';
import { createInitialProjectState, createDefaultTracks, createDefaultMarkers } from '../services/sampleProject';
import { clamp, findSnapPoint } from '../utils/timecode';

interface ProjectContextType {
  project: ProjectState;
  selectedClip: ClipItem | null;
  selectedTrack: TimelineTrack | null;
  canUndo: boolean;
  canRedo: boolean;
  
  // Playback
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setPlaybackRate: (rate: number) => void;
  stepFrames: (frames: number) => void;
  
  // Timeline zoom & navigation
  setZoom: (zoom: number) => void;
  toggleSnapping: () => void;
  
  // Selection
  selectClip: (clipId: string | null, trackId?: string | null) => void;
  
  // Clip Manipulations
  updateClip: (clipId: string, updates: Partial<ClipItem>) => void;
  moveClip: (clipId: string, newStartTime: number, newTrackId?: string) => void;
  trimClip: (clipId: string, newStartTime: number, newDuration: number) => void;
  splitClipAtPlayhead: (targetClipId?: string) => void;
  duplicateClip: (targetClipId?: string) => void;
  deleteClip: (targetClipId?: string) => void;
  addClipToTrack: (trackType: TrackType, clipData: Partial<ClipItem>) => void;
  
  // Track Controls
  toggleTrackMute: (trackId: string) => void;
  toggleTrackLock: (trackId: string) => void;
  toggleTrackHide: (trackId: string) => void;
  
  // Markers
  addMarker: (time?: number, label?: string) => void;
  deleteMarker: (markerId: string) => void;
  
  // Project Settings & History
  setResolution: (resolution: ResolutionConfig) => void;
  undo: () => void;
  redo: () => void;
  resetProject: () => void;
  loadDemoProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ProjectState>(() => createInitialProjectState());

  // Helper to record history snapshot before state mutation
  const pushHistory = useCallback((currentTracks: TimelineTrack[], duration: number, markers: TimelineMarker[]) => {
    setProject((prev) => {
      const snapshot: ProjectHistorySnapshot = {
        tracks: JSON.parse(JSON.stringify(currentTracks)),
        duration,
        markers: JSON.parse(JSON.stringify(markers)),
      };
      return {
        ...prev,
        history: {
          past: [...prev.history.past.slice(-25), snapshot], // keep last 25 operations
          future: [],
        },
      };
    });
  }, []);

  // Compute currently selected clip and track
  const selectedClip = useMemo(() => {
    if (!project.selectedClipId) return null;
    for (const track of project.tracks) {
      const clip = track.clips.find((c) => c.id === project.selectedClipId);
      if (clip) return clip;
    }
    return null;
  }, [project.tracks, project.selectedClipId]);

  const selectedTrack = useMemo(() => {
    if (!project.selectedTrackId) return null;
    return project.tracks.find((t) => t.id === project.selectedTrackId) || null;
  }, [project.tracks, project.selectedTrackId]);

  // Recalculate duration whenever clips change
  const refreshDuration = (tracks: TimelineTrack[]): number => {
    let max = 10.0;
    for (const t of tracks) {
      for (const c of t.clips) {
        const end = c.startTime + c.duration;
        if (end > max) max = end;
      }
    }
    return Math.ceil(max + 2); // 2 second breathing room
  };

  // Playback loop
  useEffect(() => {
    if (!project.isPlaying) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTimeMs: number) => {
      const deltaSec = (currentTimeMs - lastTime) / 1000;
      lastTime = currentTimeMs;

      setProject((prev) => {
        if (!prev.isPlaying) return prev;
        const nextTime = prev.currentTime + deltaSec * prev.playbackRate;
        if (nextTime >= prev.duration) {
          return { ...prev, currentTime: 0, isPlaying: false };
        }
        return { ...prev, currentTime: nextTime };
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [project.isPlaying, project.playbackRate, project.duration]);

  // Playback controls
  const setCurrentTime = useCallback((time: number) => {
    setProject((prev) => ({
      ...prev,
      currentTime: clamp(time, 0, prev.duration),
    }));
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setProject((prev) => ({ ...prev, isPlaying: playing }));
  }, []);

  const togglePlay = useCallback(() => {
    setProject((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    setProject((prev) => ({ ...prev, playbackRate: rate }));
  }, []);

  const stepFrames = useCallback((frames: number) => {
    setProject((prev) => {
      const frameDuration = 1 / prev.fps;
      const target = prev.currentTime + frames * frameDuration;
      return { ...prev, currentTime: clamp(target, 0, prev.duration) };
    });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setProject((prev) => ({
      ...prev,
      zoom: clamp(zoom, 15, 160),
    }));
  }, []);

  const toggleSnapping = useCallback(() => {
    setProject((prev) => ({
      ...prev,
      isSnappingEnabled: !prev.isSnappingEnabled,
    }));
  }, []);

  const selectClip = useCallback((clipId: string | null, trackId?: string | null) => {
    setProject((prev) => ({
      ...prev,
      selectedClipId: clipId,
      selectedTrackId: trackId !== undefined ? trackId : prev.selectedTrackId,
    }));
  }, []);

  // Update properties on a clip
  const updateClip = useCallback((clipId: string, updates: Partial<ClipItem>) => {
    setProject((prev) => {
      pushHistory(prev.tracks, prev.duration, prev.markers);
      const newTracks = prev.tracks.map((track) => {
        return {
          ...track,
          clips: track.clips.map((clip) => {
            if (clip.id === clipId) {
              return {
                ...clip,
                ...updates,
                visualProps: updates.visualProps ? { ...clip.visualProps, ...updates.visualProps } : clip.visualProps,
                audioProps: updates.audioProps ? { ...clip.audioProps, ...updates.audioProps } : clip.audioProps,
                captionProps: updates.captionProps ? { ...clip.captionProps, ...updates.captionProps } : clip.captionProps,
                filters: updates.filters ? { ...clip.filters, ...updates.filters } : clip.filters,
              };
            }
            return clip;
          }),
        };
      });
      const newDuration = refreshDuration(newTracks);
      return { ...prev, tracks: newTracks, duration: newDuration };
    });
  }, [pushHistory]);

  // Move clip in time and optionally to another track
  const moveClip = useCallback((clipId: string, rawStartTime: number, newTrackId?: string) => {
    setProject((prev) => {
      let targetStartTime = Math.max(0, rawStartTime);

      // Snap to playhead, markers, and other clip edges if enabled
      if (prev.isSnappingEnabled) {
        const snapPoints: number[] = [0, prev.currentTime];
        prev.markers.forEach((m) => snapPoints.push(m.time));
        prev.tracks.forEach((t) => {
          t.clips.forEach((c) => {
            if (c.id !== clipId) {
              snapPoints.push(c.startTime);
              snapPoints.push(c.startTime + c.duration);
            }
          });
        });
        const snapResult = findSnapPoint(targetStartTime, snapPoints, 0.2);
        if (snapResult.isSnapped) {
          targetStartTime = snapResult.snappedTime;
        }
      }

      pushHistory(prev.tracks, prev.duration, prev.markers);

      let foundClip: ClipItem | null = null;
      let sourceTrackId = '';

      // Locate clip
      for (const track of prev.tracks) {
        const c = track.clips.find((item) => item.id === clipId);
        if (c) {
          foundClip = { ...c, startTime: targetStartTime };
          sourceTrackId = track.id;
          break;
        }
      }

      if (!foundClip) return prev;

      const destinationTrackId = newTrackId || sourceTrackId;
      foundClip.trackId = destinationTrackId;

      const newTracks = prev.tracks.map((track) => {
        if (track.id === sourceTrackId && sourceTrackId !== destinationTrackId) {
          return {
            ...track,
            clips: track.clips.filter((c) => c.id !== clipId),
          };
        }
        if (track.id === destinationTrackId) {
          const otherClips = track.clips.filter((c) => c.id !== clipId);
          return {
            ...track,
            clips: [...otherClips, foundClip!].sort((a, b) => a.startTime - b.startTime),
          };
        }
        return track;
      });

      const newDuration = refreshDuration(newTracks);
      return {
        ...prev,
        tracks: newTracks,
        duration: Math.max(newDuration, prev.duration),
      };
    });
  }, [pushHistory]);

  // Trim start or duration of clip
  const trimClip = useCallback((clipId: string, newStartTime: number, newDuration: number) => {
    if (newDuration < 0.2) return; // minimum 200ms clip length
    setProject((prev) => {
      pushHistory(prev.tracks, prev.duration, prev.markers);
      const newTracks = prev.tracks.map((track) => {
        return {
          ...track,
          clips: track.clips.map((clip) => {
            if (clip.id === clipId) {
              const deltaStart = newStartTime - clip.startTime;
              return {
                ...clip,
                startTime: Math.max(0, newStartTime),
                duration: newDuration,
                trimStart: Math.max(0, clip.trimStart + deltaStart),
              };
            }
            return clip;
          }),
        };
      });
      const newDurationCalc = refreshDuration(newTracks);
      return { ...prev, tracks: newTracks, duration: newDurationCalc };
    });
  }, [pushHistory]);

  // Split clip at current playhead position
  const splitClipAtPlayhead = useCallback((targetClipId?: string) => {
    setProject((prev) => {
      const clipToSplitId = targetClipId || prev.selectedClipId;
      if (!clipToSplitId) return prev;

      let targetClip: ClipItem | null = null;
      let targetTrack: TimelineTrack | null = null;

      for (const track of prev.tracks) {
        const c = track.clips.find((item) => item.id === clipToSplitId);
        if (c) {
          targetClip = c;
          targetTrack = track;
          break;
        }
      }

      if (!targetClip || !targetTrack) return prev;

      // Playhead must be strictly inside the clip boundaries
      const playhead = prev.currentTime;
      if (playhead <= targetClip.startTime + 0.1 || playhead >= targetClip.startTime + targetClip.duration - 0.1) {
        return prev;
      }

      pushHistory(prev.tracks, prev.duration, prev.markers);

      const splitOffset = playhead - targetClip.startTime;
      const firstPartDuration = splitOffset;
      const secondPartDuration = targetClip.duration - splitOffset;

      const firstPart: ClipItem = {
        ...targetClip,
        duration: firstPartDuration,
      };

      const secondPart: ClipItem = {
        ...targetClip,
        id: `clip-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        startTime: playhead,
        duration: secondPartDuration,
        trimStart: targetClip.trimStart + splitOffset,
      };

      const newTracks = prev.tracks.map((track) => {
        if (track.id === targetTrack!.id) {
          const filtered = track.clips.filter((c) => c.id !== targetClip!.id);
          return {
            ...track,
            clips: [...filtered, firstPart, secondPart].sort((a, b) => a.startTime - b.startTime),
          };
        }
        return track;
      });

      return {
        ...prev,
        tracks: newTracks,
        selectedClipId: secondPart.id,
      };
    });
  }, [pushHistory]);

  // Duplicate clip
  const duplicateClip = useCallback((targetClipId?: string) => {
    setProject((prev) => {
      const clipId = targetClipId || prev.selectedClipId;
      if (!clipId) return prev;

      let targetClip: ClipItem | null = null;
      let targetTrackId = '';

      for (const track of prev.tracks) {
        const c = track.clips.find((item) => item.id === clipId);
        if (c) {
          targetClip = c;
          targetTrackId = track.id;
          break;
        }
      }

      if (!targetClip) return prev;
      pushHistory(prev.tracks, prev.duration, prev.markers);

      const duplicatedClip: ClipItem = {
        ...JSON.parse(JSON.stringify(targetClip)),
        id: `clip-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: `${targetClip.name} (Copy)`,
        startTime: targetClip.startTime + targetClip.duration + 0.2,
      };

      const newTracks = prev.tracks.map((track) => {
        if (track.id === targetTrackId) {
          return {
            ...track,
            clips: [...track.clips, duplicatedClip].sort((a, b) => a.startTime - b.startTime),
          };
        }
        return track;
      });

      const newDuration = refreshDuration(newTracks);
      return {
        ...prev,
        tracks: newTracks,
        duration: Math.max(newDuration, prev.duration),
        selectedClipId: duplicatedClip.id,
      };
    });
  }, [pushHistory]);

  // Delete clip
  const deleteClip = useCallback((targetClipId?: string) => {
    setProject((prev) => {
      const clipId = targetClipId || prev.selectedClipId;
      if (!clipId) return prev;

      pushHistory(prev.tracks, prev.duration, prev.markers);
      const newTracks = prev.tracks.map((track) => ({
        ...track,
        clips: track.clips.filter((c) => c.id !== clipId),
      }));

      const newDuration = refreshDuration(newTracks);
      return {
        ...prev,
        tracks: newTracks,
        duration: newDuration,
        selectedClipId: null,
      };
    });
  }, [pushHistory]);

  // Add new clip to track
  const addClipToTrack = useCallback((trackType: TrackType, clipData: Partial<ClipItem>) => {
    setProject((prev) => {
      pushHistory(prev.tracks, prev.duration, prev.markers);

      // Find or create track
      let targetTrack = prev.tracks.find((t) => t.type === trackType);
      let tracksList = [...prev.tracks];

      if (!targetTrack) {
        targetTrack = {
          id: `track-${trackType}-${Date.now()}`,
          name: `${trackType.charAt(0).toUpperCase() + trackType.slice(1)} Track`,
          type: trackType,
          isMuted: false,
          isLocked: false,
          isHidden: false,
          clips: [],
        };
        tracksList.push(targetTrack);
      }

      // Default insertion at playhead or end of track
      let insertionStart = prev.currentTime;
      const duration = clipData.duration || 4.0;

      const newClip: ClipItem = {
        id: `clip-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        trackId: targetTrack.id,
        name: clipData.name || 'New Clip',
        type: clipData.type || (trackType === 'visuals' ? 'video' : 'audio'),
        startTime: insertionStart,
        duration,
        trimStart: 0,
        trimEnd: duration,
        sourceUrl: clipData.sourceUrl || '',
        thumbnailUrl: clipData.thumbnailUrl,
        color: clipData.color || (trackType === 'visuals' ? '#3b82f6' : trackType === 'captions' ? '#eab308' : '#8b5cf6'),
        visualProps: clipData.visualProps || {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          fit: 'contain',
        },
        audioProps: clipData.audioProps || {
          volume: 100,
          muted: false,
          pan: 0,
          fadeIn: 0,
          fadeOut: 0,
        },
        captionProps: clipData.captionProps,
        filters: clipData.filters || {
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0,
          grayscale: 0,
          sepia: 0,
          hueRotate: 0,
          invert: 0,
        },
        waveformData: clipData.waveformData,
      };

      const updatedTracks = tracksList.map((track) => {
        if (track.id === targetTrack!.id) {
          return {
            ...track,
            clips: [...track.clips, newClip].sort((a, b) => a.startTime - b.startTime),
          };
        }
        return track;
      });

      const newDuration = refreshDuration(updatedTracks);
      return {
        ...prev,
        tracks: updatedTracks,
        duration: Math.max(newDuration, prev.duration),
        selectedClipId: newClip.id,
        selectedTrackId: targetTrack.id,
      };
    });
  }, [pushHistory]);

  // Track toggles
  const toggleTrackMute = useCallback((trackId: string) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, isMuted: !t.isMuted } : t)),
    }));
  }, []);

  const toggleTrackLock = useCallback((trackId: string) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, isLocked: !t.isLocked } : t)),
    }));
  }, []);

  const toggleTrackHide = useCallback((trackId: string) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, isHidden: !t.isHidden } : t)),
    }));
  }, []);

  // Markers
  const addMarker = useCallback((time?: number, label?: string) => {
    setProject((prev) => {
      const markerTime = time !== undefined ? time : prev.currentTime;
      const markerColors = ['#38bdf8', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];
      const randomColor = markerColors[prev.markers.length % markerColors.length];

      const newMarker: TimelineMarker = {
        id: `marker-${Date.now()}`,
        time: Number(markerTime.toFixed(2)),
        label: label || `Marker ${prev.markers.length + 1}`,
        color: randomColor,
      };
      return {
        ...prev,
        markers: [...prev.markers, newMarker].sort((a, b) => a.time - b.time),
      };
    });
  }, []);

  const deleteMarker = useCallback((markerId: string) => {
    setProject((prev) => ({
      ...prev,
      markers: prev.markers.filter((m) => m.id !== markerId),
    }));
  }, []);

  // Set Resolution
  const setResolution = useCallback((resolution: ResolutionConfig) => {
    setProject((prev) => ({
      ...prev,
      resolution,
    }));
  }, []);

  // Undo / Redo
  const canUndo = project.history.past.length > 0;
  const canRedo = project.history.future.length > 0;

  const undo = useCallback(() => {
    setProject((prev) => {
      if (prev.history.past.length === 0) return prev;
      const previous = prev.history.past[prev.history.past.length - 1];
      const newPast = prev.history.past.slice(0, -1);

      const currentSnapshot: ProjectHistorySnapshot = {
        tracks: JSON.parse(JSON.stringify(prev.tracks)),
        duration: prev.duration,
        markers: JSON.parse(JSON.stringify(prev.markers)),
      };

      return {
        ...prev,
        tracks: previous.tracks,
        duration: previous.duration,
        markers: previous.markers,
        history: {
          past: newPast,
          future: [currentSnapshot, ...prev.history.future],
        },
      };
    });
  }, []);

  const redo = useCallback(() => {
    setProject((prev) => {
      if (prev.history.future.length === 0) return prev;
      const next = prev.history.future[0];
      const newFuture = prev.history.future.slice(1);

      const currentSnapshot: ProjectHistorySnapshot = {
        tracks: JSON.parse(JSON.stringify(prev.tracks)),
        duration: prev.duration,
        markers: JSON.parse(JSON.stringify(prev.markers)),
      };

      return {
        ...prev,
        tracks: next.tracks,
        duration: next.duration,
        markers: next.markers,
        history: {
          past: [...prev.history.past, currentSnapshot],
          future: newFuture,
        },
      };
    });
  }, []);

  const resetProject = useCallback(() => {
    setProject({
      ...createInitialProjectState(),
      tracks: [
        {
          id: 'track-visuals',
          name: 'Main Video',
          type: 'visuals',
          isMuted: false,
          isLocked: false,
          isHidden: false,
          clips: [],
        },
        {
          id: 'track-captions',
          name: 'Subtitles & Text',
          type: 'captions',
          isMuted: false,
          isLocked: false,
          isHidden: false,
          clips: [],
        },
        {
          id: 'track-music',
          name: 'Background Music',
          type: 'music',
          isMuted: false,
          isLocked: false,
          isHidden: false,
          clips: [],
        },
      ],
      duration: 10,
      currentTime: 0,
      selectedClipId: null,
      markers: [],
    });
  }, []);

  const loadDemoProject = useCallback(() => {
    setProject(createInitialProjectState());
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input, textarea or contentEditable
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Space: Play / Pause
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      // Delete or Backspace: Delete selected clip
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteClip();
      }
      // J / Left Arrow: Step backward 1 frame
      else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepFrames(-1);
      }
      // L / Right Arrow: Step forward 1 frame
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepFrames(1);
      }
      // M: Add marker at playhead
      else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        addMarker();
      }
      // S: Toggle snapping
      else if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        toggleSnapping();
      }
      // Ctrl+B / Cmd+B: Split clip at playhead
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        splitClipAtPlayhead();
      }
      // Ctrl+D / Cmd+D: Duplicate clip
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        duplicateClip();
      }
      // Ctrl+Z / Cmd+Z: Undo / Redo
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      // Ctrl+Y / Cmd+Y: Redo
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, deleteClip, stepFrames, addMarker, toggleSnapping, splitClipAtPlayhead, duplicateClip, undo, redo]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        selectedClip,
        selectedTrack,
        canUndo,
        canRedo,
        setCurrentTime,
        setIsPlaying,
        togglePlay,
        setPlaybackRate,
        stepFrames,
        setZoom,
        toggleSnapping,
        selectClip,
        updateClip,
        moveClip,
        trimClip,
        splitClipAtPlayhead,
        duplicateClip,
        deleteClip,
        addClipToTrack,
        toggleTrackMute,
        toggleTrackLock,
        toggleTrackHide,
        addMarker,
        deleteMarker,
        setResolution,
        undo,
        redo,
        resetProject,
        loadDemoProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
