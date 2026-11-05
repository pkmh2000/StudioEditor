/**
 * Timecode formatting and mathematical utilities for high-precision timeline editing
 */

/**
 * Formats seconds into MM:SS:FF or HH:MM:SS:FF string
 * @param seconds Floating point seconds
 * @param fps Frame rate (defaults to 30)
 * @param includeHours Whether to always include HH
 */
export function formatTimecode(seconds: number, fps = 30, includeHours = false): string {
  if (isNaN(seconds) || seconds < 0) {
    seconds = 0;
  }
  
  const totalFrames = Math.floor(seconds * fps);
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(seconds);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');

  if (hours > 0 || includeHours) {
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  }
  return `${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}

/**
 * Formats seconds to a human-readable duration like "1m 24s" or "0:45"
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '0:00';
  const totalSecs = Math.round(seconds);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Parses timecode string (MM:SS:FF or HH:MM:SS:FF) into seconds
 */
export function parseTimecode(tc: string, fps = 30): number {
  if (!tc || typeof tc !== 'string') return 0;
  const parts = tc.trim().split(':').map(p => parseInt(p, 10) || 0);

  if (parts.length === 4) {
    // HH:MM:SS:FF
    const [h, m, s, f] = parts;
    return h * 3600 + m * 60 + s + (f / fps);
  } else if (parts.length === 3) {
    // MM:SS:FF
    const [m, s, f] = parts;
    return m * 60 + s + (f / fps);
  } else if (parts.length === 2) {
    // MM:SS
    const [m, s] = parts;
    return m * 60 + s;
  } else if (parts.length === 1) {
    return parts[0];
  }
  return 0;
}

/**
 * Clamp a number between min and max bounds
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Finds the nearest snap point within tolerance (pixels or seconds)
 */
export function findSnapPoint(
  targetTime: number,
  snapCandidates: number[],
  tolerance = 0.15 // in seconds
): { snappedTime: number; isSnapped: boolean } {
  let closestDist = Infinity;
  let snappedTime = targetTime;

  for (const candidate of snapCandidates) {
    const dist = Math.abs(candidate - targetTime);
    if (dist < tolerance && dist < closestDist) {
      closestDist = dist;
      snappedTime = candidate;
    }
  }

  return {
    snappedTime,
    isSnapped: closestDist !== Infinity,
  };
}

/**
 * Generates pseudo-random but deterministic audio waveform amplitude samples (0 to 1)
 */
export function generateWaveform(sampleCount = 40, seed = 1): number[] {
  const result: number[] = [];
  let s = seed;
  for (let i = 0; i < sampleCount; i++) {
    // simple linear congruential generator
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    // modulated sine wave curve with natural musical variation
    const base = Math.sin((i / sampleCount) * Math.PI * 4) * 0.35 + 0.45;
    const height = Math.min(Math.max(base + (rnd - 0.5) * 0.4, 0.1), 0.98);
    result.push(Number(height.toFixed(2)));
  }
  return result;
}
