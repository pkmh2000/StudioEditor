import { ProjectState, TimelineTrack, ClipItem, TimelineMarker, ResolutionConfig } from '../types/timeline';
import { generateWaveform } from '../utils/timecode';

export const RESOLUTION_PRESETS: ResolutionConfig[] = [
  { width: 1920, height: 1080, label: '1080p Full HD (16:9)', aspectRatio: '16:9' },
  { width: 1080, height: 1920, label: 'TikTok / Shorts / Reels (9:16)', aspectRatio: '9:16' },
  { width: 1080, height: 1080, label: 'Instagram Square (1:1)', aspectRatio: '1:1' },
  { width: 2560, height: 1440, label: '2K QHD (16:9)', aspectRatio: '16:9' },
  { width: 3840, height: 2160, label: '4K Ultra HD (16:9)', aspectRatio: '16:9' },
];

export function createDefaultClips(): ClipItem[] {
  return [
    // Visuals Track Clips
    {
      id: 'clip-vis-1',
      trackId: 'track-visuals',
      name: 'Cyberpunk Metropolis',
      type: 'video',
      startTime: 0,
      duration: 6.0,
      trimStart: 0,
      trimEnd: 6.0,
      sourceUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90"><rect width="160" height="90" fill="%234338ca"/><circle cx="80" cy="45" r="20" fill="%23f43f5e"/><text x="80" y="80" fill="%23ffffff" font-size="10" text-anchor="middle">Scene 1</text></svg>',
      color: '#3b82f6',
      visualProps: {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        fit: 'cover',
      },
      filters: {
        brightness: 105,
        contrast: 110,
        saturation: 115,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        hueRotate: 0,
        invert: 0,
      },
    },
    {
      id: 'clip-vis-2',
      trackId: 'track-visuals',
      name: 'Aurora Sky Timelapse',
      type: 'video',
      startTime: 6.0,
      duration: 7.5,
      trimStart: 0,
      trimEnd: 7.5,
      sourceUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90"><rect width="160" height="90" fill="%23065f46"/><path d="M0,60 Q80,20 160,50 L160,90 L0,90 Z" fill="%2310b981"/><text x="80" y="80" fill="%23ffffff" font-size="10" text-anchor="middle">Scene 2</text></svg>',
      color: '#06b6d4',
      visualProps: {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        fit: 'cover',
      },
      filters: {
        brightness: 100,
        contrast: 105,
        saturation: 110,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        hueRotate: 0,
        invert: 0,
      },
    },

    // Captions Track Clips
    {
      id: 'clip-cap-1',
      trackId: 'track-captions',
      name: 'Subtitle: Intro',
      type: 'caption',
      startTime: 0.5,
      duration: 3.5,
      trimStart: 0,
      trimEnd: 3.5,
      sourceUrl: '',
      color: '#eab308',
      captionProps: {
        text: '⚡ Welcome to Timeline Studio: Next-Gen Web Video Editing',
        fontSize: 28,
        fontFamily: 'Plus Jakarta Sans',
        color: '#ffffff',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        fontWeight: '700',
        alignment: 'center',
        position: 'bottom',
      },
    },
    {
      id: 'clip-cap-2',
      trackId: 'track-captions',
      name: 'Subtitle: Local AI',
      type: 'caption',
      startTime: 4.5,
      duration: 4.0,
      trimStart: 0,
      trimEnd: 4.0,
      sourceUrl: '',
      color: '#eab308',
      captionProps: {
        text: '✨ High Performance Multi-Track Timeline & Real-Time Preview',
        fontSize: 26,
        fontFamily: 'Plus Jakarta Sans',
        color: '#38bdf8',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        fontWeight: '700',
        alignment: 'center',
        position: 'bottom',
      },
    },
    {
      id: 'clip-cap-3',
      trackId: 'track-captions',
      name: 'Subtitle: Export',
      type: 'caption',
      startTime: 9.0,
      duration: 4.0,
      trimStart: 0,
      trimEnd: 4.0,
      sourceUrl: '',
      color: '#eab308',
      captionProps: {
        text: '🚀 Export to 1080p MP4 / WebM with Deterministic Quality',
        fontSize: 26,
        fontFamily: 'Plus Jakarta Sans',
        color: '#f43f5e',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        fontWeight: '700',
        alignment: 'center',
        position: 'bottom',
      },
    },

    // Voiceover Track Clip
    {
      id: 'clip-voi-1',
      trackId: 'track-voiceover',
      name: 'Narrator: Intro Speech',
      type: 'voiceover',
      startTime: 0.5,
      duration: 4.5,
      trimStart: 0,
      trimEnd: 4.5,
      sourceUrl: 'https://cdn.freesound.org/previews/416/416838_5121236-lq.mp3',
      color: '#10b981',
      audioProps: {
        volume: 95,
        muted: false,
        pan: 0,
        fadeIn: 0.2,
        fadeOut: 0.3,
      },
      waveformData: generateWaveform(50, 88),
    },
    {
      id: 'clip-voi-2',
      trackId: 'track-voiceover',
      name: 'Narrator: Call to Action',
      type: 'voiceover',
      startTime: 8.5,
      duration: 4.2,
      trimStart: 0,
      trimEnd: 4.2,
      sourceUrl: 'https://cdn.freesound.org/previews/416/416839_5121236-lq.mp3',
      color: '#10b981',
      audioProps: {
        volume: 90,
        muted: false,
        pan: 0,
        fadeIn: 0.2,
        fadeOut: 0.3,
      },
      waveformData: generateWaveform(45, 999),
    },

    // Background Music Track Clip
    {
      id: 'clip-mus-1',
      trackId: 'track-music',
      name: 'Midnight Lo-Fi Theme',
      type: 'music',
      startTime: 0,
      duration: 13.5,
      trimStart: 0,
      trimEnd: 13.5,
      sourceUrl: 'https://cdn.freesound.org/previews/515/515823_11438991-lq.mp3',
      color: '#8b5cf6',
      audioProps: {
        volume: 45, // balanced behind voiceover
        muted: false,
        pan: 0,
        fadeIn: 0.8,
        fadeOut: 1.2,
      },
      waveformData: generateWaveform(120, 2026),
    },
  ];
}

export function createDefaultTracks(): TimelineTrack[] {
  const clips = createDefaultClips();

  return [
    {
      id: 'track-visuals',
      name: 'Main Video',
      type: 'visuals',
      isMuted: false,
      isLocked: false,
      isHidden: false,
      clips: clips.filter((c) => c.trackId === 'track-visuals'),
    },
    {
      id: 'track-captions',
      name: 'Subtitles & Text',
      type: 'captions',
      isMuted: false,
      isLocked: false,
      isHidden: false,
      clips: clips.filter((c) => c.trackId === 'track-captions'),
    },
    {
      id: 'track-voiceover',
      name: 'Voiceover & Dialogue',
      type: 'voiceover',
      isMuted: false,
      isLocked: false,
      isHidden: false,
      clips: clips.filter((c) => c.trackId === 'track-voiceover'),
    },
    {
      id: 'track-music',
      name: 'Background Music',
      type: 'music',
      isMuted: false,
      isLocked: false,
      isHidden: false,
      clips: clips.filter((c) => c.trackId === 'track-music'),
    },
  ];
}

export function createDefaultMarkers(): TimelineMarker[] {
  return [
    { id: 'marker-1', time: 0.0, label: 'Intro Hook', color: '#38bdf8', note: 'Fade in logo and opening title' },
    { id: 'marker-2', time: 6.0, label: 'Scene Transition', color: '#a855f7', note: 'Beat drop & scenic shift' },
    { id: 'marker-3', time: 11.5, label: 'Outro CTA', color: '#10b981', note: 'Subscribe & end card' },
  ];
}

export function createInitialProjectState(): ProjectState {
  const tracks = createDefaultTracks();
  const markers = createDefaultMarkers();

  // calculate max duration from clips
  let maxTime = 14.0;
  for (const track of tracks) {
    for (const clip of track.clips) {
      const clipEnd = clip.startTime + clip.duration;
      if (clipEnd > maxTime) {
        maxTime = clipEnd;
      }
    }
  }

  return {
    id: 'project-timeline-studio-1',
    name: 'Showcase Reel 2026',
    resolution: RESOLUTION_PRESETS[0], // 1080p 16:9
    fps: 30,
    duration: Math.max(maxTime, 15.0),
    currentTime: 0,
    isPlaying: false,
    playbackRate: 1.0,
    zoom: 50, // 50 pixels per second
    selectedClipId: 'clip-vis-1',
    selectedTrackId: 'track-visuals',
    isSnappingEnabled: true,
    tracks,
    markers,
    history: {
      past: [],
      future: [],
    },
  };
}
