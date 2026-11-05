import { StockMediaItem, MediaType } from '../types/timeline';
import { generateWaveform } from '../utils/timecode';

/**
 * Curated high-performance stock library for browser video editing.
 * Uses high-efficiency SVG animated and HTML5 canvas-ready media elements,
 * avoiding broken external image links per frontend-design constitution.
 */
export const STOCK_MEDIA_LIBRARY: StockMediaItem[] = [
  // --- Video & Footage ---
  {
    id: 'vid-neon-city',
    title: 'Cyberpunk Metropolis',
    type: 'video',
    duration: 8.0,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="50%" stop-color="%234338ca"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="320" height="180" fill="url(%23g1)"/><circle cx="160" cy="90" r="40" fill="%23f43f5e" opacity="0.8"/><text x="160" y="150" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Cyberpunk City</text></svg>',
    tags: ['cyberpunk', 'city', 'tech', 'night'],
    resolution: '1920x1080',
    author: 'Studio Archive'
  },
  {
    id: 'vid-nature-timelapse',
    title: 'Aurora Borealis Timelapse',
    type: 'video',
    duration: 10.0,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23064e3b"/><stop offset="60%" stop-color="%23047857"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="320" height="180" fill="url(%23g2)"/><path d="M0,120 Q80,70 160,110 T320,90 L320,180 L0,180 Z" fill="%2310b981" opacity="0.6"/><text x="160" y="150" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Aurora Night</text></svg>',
    tags: ['nature', 'aurora', 'landscape', 'timelapse'],
    resolution: '1920x1080',
    author: 'Nature Captures'
  },
  {
    id: 'vid-abstract-particles',
    title: 'Neural Energy Particles',
    type: 'video',
    duration: 6.5,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><defs><linearGradient id="g3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="%23311042"/><stop offset="50%" stop-color="%237e22ce"/><stop offset="100%" stop-color="%23ec4899"/></linearGradient></defs><rect width="320" height="180" fill="url(%23g3)"/><circle cx="100" cy="70" r="16" fill="%23f472b6"/><circle cx="220" cy="110" r="24" fill="%23a855f7"/><text x="160" y="150" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Neural Particles</text></svg>',
    tags: ['abstract', 'energy', 'vfx', 'particles'],
    resolution: '1920x1080',
    author: 'Creative Pulse'
  },

  // --- Background Music & Audio ---
  {
    id: 'audio-chill-beats',
    title: 'Midnight Lo-Fi Chillhop',
    type: 'music',
    duration: 15.0,
    url: 'https://cdn.freesound.org/previews/515/515823_11438991-lq.mp3',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="8" fill="%233b82f6"/><text x="40" y="48" fill="%23ffffff" font-size="28" text-anchor="middle">🎵</text></svg>',
    tags: ['lofi', 'chill', 'beats', 'music'],
    waveformData: generateWaveform(60, 42),
    author: 'AudioCraft Labs'
  },
  {
    id: 'audio-cinematic-epic',
    title: 'Heroic Cinematic Rise',
    type: 'music',
    duration: 12.0,
    url: 'https://cdn.freesound.org/previews/456/456565_5121236-lq.mp3',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="8" fill="%238b5cf6"/><text x="40" y="48" fill="%23ffffff" font-size="28" text-anchor="middle">🎻</text></svg>',
    tags: ['cinematic', 'epic', 'orchestral', 'trailer'],
    waveformData: generateWaveform(60, 99),
    author: 'Symphony Grid'
  },
  {
    id: 'audio-ambient-synth',
    title: 'Atmospheric Cyber Pulse',
    type: 'music',
    duration: 14.0,
    url: 'https://cdn.freesound.org/previews/612/612662_11861866-lq.mp3',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="8" fill="%2306b6d4"/><text x="40" y="48" fill="%23ffffff" font-size="28" text-anchor="middle">🎹</text></svg>',
    tags: ['ambient', 'synth', 'future', 'relax'],
    waveformData: generateWaveform(60, 777),
    author: 'Vapor Waveform'
  },

  // --- Voiceover & Narration Presets ---
  {
    id: 'voice-intro',
    title: 'Studio Narrator: "Welcome to Timeline"',
    type: 'voiceover',
    duration: 3.5,
    url: 'https://cdn.freesound.org/previews/416/416838_5121236-lq.mp3',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="8" fill="%2310b981"/><text x="40" y="48" fill="%23ffffff" font-size="28" text-anchor="middle">🎙️</text></svg>',
    tags: ['narration', 'ai-voice', 'female', 'warm'],
    waveformData: generateWaveform(45, 123),
    author: 'Hojo TTS Voice'
  },
  {
    id: 'voice-outro',
    title: 'Studio Voice: "Subscribe & Follow"',
    type: 'voiceover',
    duration: 2.8,
    url: 'https://cdn.freesound.org/previews/416/416839_5121236-lq.mp3',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="8" fill="%2314b8a6"/><text x="40" y="48" fill="%23ffffff" font-size="28" text-anchor="middle">🎙️</text></svg>',
    tags: ['narration', 'ai-voice', 'call-to-action'],
    waveformData: generateWaveform(35, 456),
    author: 'Kokoro TTS'
  },

  // --- Images / Overlays ---
  {
    id: 'img-gradient-sunset',
    title: 'Vibrant Horizon Gradient',
    type: 'image',
    duration: 5.0,
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><linearGradient id="s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23f97316"/><stop offset="40%" stop-color="%23ec4899"/><stop offset="100%" stop-color="%233b0764"/></linearGradient></defs><rect width="1920" height="1080" fill="url(%23s1)"/><circle cx="960" cy="450" r="220" fill="%23fef08a" opacity="0.9"/></svg>',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><defs><linearGradient id="s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23f97316"/><stop offset="50%" stop-color="%23ec4899"/><stop offset="100%" stop-color="%233b0764"/></linearGradient></defs><rect width="320" height="180" fill="url(%23s1)"/><circle cx="160" cy="70" r="30" fill="%23fef08a"/></svg>',
    tags: ['gradient', 'sunset', 'minimal', 'background'],
    resolution: '1920x1080',
    author: 'Vector Forge'
  },
  {
    id: 'img-tech-grid',
    title: 'Cyber Grid Floor',
    type: 'image',
    duration: 5.0,
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%230284c7"/></linearGradient></defs><rect width="1920" height="1080" fill="url(%23tg)"/><path d="M0,600 L1920,600 M0,700 L1920,700 M0,850 L1920,850 M960,600 L100,1080 M960,600 L1820,1080 M960,600 L960,1080" stroke="%2338bdf8" stroke-width="2" opacity="0.4"/></svg>',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="%230f172a"/><path d="M0,100 L320,100 M160,100 L40,180 M160,100 L280,180" stroke="%2338bdf8" stroke-width="2"/></svg>',
    tags: ['grid', 'tech', 'cyber', 'retro'],
    resolution: '1920x1080',
    author: 'Pixel Matrix'
  }
];

/**
 * Fetch stock media with simulated API latency & search filter
 */
export async function fetchStockMedia(
  type?: MediaType | 'all',
  searchQuery = ''
): Promise<StockMediaItem[]> {
  // Simulate network roundtrip latency (150ms) to exercise React Query loading/caching
  await new Promise((resolve) => setTimeout(resolve, 150));

  let results = [...STOCK_MEDIA_LIBRARY];

  if (type && type !== 'all') {
    results = results.filter((item) => item.type === type);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return results;
}
