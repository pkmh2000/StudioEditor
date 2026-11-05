/**
 * Timeline Studio - Core TypeScript Interfaces
 */

export type MediaType = 'video' | 'image' | 'audio' | 'music' | 'voiceover' | 'caption' | 'effect' | 'sticker';

export type TrackType = 'visuals' | 'overlays' | 'captions' | 'voiceover' | 'music' | 'effects';

export type AspectRatioType = '16:9' | '9:16' | '1:1' | '4:5' | '21:9';

export interface ResolutionConfig {
  width: number;
  height: number;
  label: string;
  aspectRatio: AspectRatioType;
}

export interface ClipFilters {
  brightness: number; // 0 to 200 (100 = default)
  contrast: number;   // 0 to 200 (100 = default)
  saturation: number; // 0 to 200 (100 = default)
  blur: number;       // 0 to 20px (0 = default)
  grayscale: number;  // 0 to 100%
  sepia: number;      // 0 to 100%
  hueRotate: number;  // 0 to 360deg
  invert: number;     // 0 to 100%
}

export interface ClipVisualProps {
  x: number;          // normalized -100 to 100 or pixels
  y: number;
  scale: number;      // 0.1 to 3.0 (1 = default)
  rotation: number;   // -180 to 180 degrees
  opacity: number;    // 0 to 1
  fit: 'contain' | 'cover' | 'fill';
}

export interface ClipAudioProps {
  volume: number;     // 0 to 100 (100 = default)
  muted: boolean;
  pan: number;        // -1 (left) to 1 (right)
  fadeIn: number;     // seconds
  fadeOut: number;    // seconds
}

export interface ClipCaptionProps {
  text: string;
  fontSize: number;   // px
  fontFamily: string;
  color: string;
  backgroundColor: string;
  fontWeight: '400' | '600' | '700' | '900';
  alignment: 'left' | 'center' | 'right';
  position: 'top' | 'center' | 'bottom';
  letterSpacing?: number;
  lineHeight?: number;
}

export interface ClipItem {
  id: string;
  trackId: string;
  name: string;
  type: MediaType;
  startTime: number;    // project timeline start in seconds
  duration: number;     // duration in timeline in seconds
  trimStart: number;    // in-point in media asset (seconds)
  trimEnd: number;      // out-point in media asset (seconds)
  sourceUrl: string;    // video URL, image URL, audio URL, or canvas generative source
  thumbnailUrl?: string;
  color: string;        // timeline block accent color
  visualProps?: ClipVisualProps;
  audioProps?: ClipAudioProps;
  captionProps?: ClipCaptionProps;
  filters?: ClipFilters;
  waveformData?: number[]; // simulated or real audio amplitude points for tracks
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: TrackType;
  isMuted: boolean;
  isLocked: boolean;
  isHidden: boolean;
  clips: ClipItem[];
}

export interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  color: string;
  note?: string;
}

export interface ProjectState {
  id: string;
  name: string;
  resolution: ResolutionConfig;
  fps: number;
  duration: number;         // total project duration (seconds)
  currentTime: number;      // playhead position (seconds)
  isPlaying: boolean;
  playbackRate: number;     // 0.5, 1, 1.25, 1.5, 2
  zoom: number;             // pixels per second (e.g. 20 to 150)
  selectedClipId: string | null;
  selectedTrackId: string | null;
  isSnappingEnabled: boolean;
  tracks: TimelineTrack[];
  markers: TimelineMarker[];
  history: {
    past: ProjectHistorySnapshot[];
    future: ProjectHistorySnapshot[];
  };
}

export interface ProjectHistorySnapshot {
  tracks: TimelineTrack[];
  duration: number;
  markers: TimelineMarker[];
}

export interface ExportSettings {
  format: 'mp4' | 'webm' | 'gif';
  quality: 'high' | 'medium' | 'low';
  resolution: string;
  fps: number;
  includeAudio: boolean;
  isExporting: boolean;
  progress: number;
  exportUrl?: string;
}

export interface StockMediaItem {
  id: string;
  title: string;
  type: MediaType;
  duration: number;
  url: string;
  thumbnail: string;
  tags: string[];
  author?: string;
  resolution?: string;
  waveformData?: number[];
}
