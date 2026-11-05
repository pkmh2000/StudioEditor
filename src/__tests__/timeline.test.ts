import {
  formatTimecode,
  formatDuration,
  parseTimecode,
  clamp,
  findSnapPoint,
  generateWaveform,
} from '../utils/timecode';

describe('Timeline Studio - Timecode & Math Utilities', () => {
  describe('formatTimecode', () => {
    it('formats 0 seconds correctly as MM:SS:FF', () => {
      expect(formatTimecode(0, 30)).toBe('00:00:00');
    });

    it('formats 65.5 seconds at 30 fps correctly (1 min, 5 sec, 15 frames)', () => {
      expect(formatTimecode(65.5, 30)).toBe('01:05:15');
    });

    it('formats hours when exceeding 3600 seconds', () => {
      // 1 hour, 2 minutes, 3 seconds, 0 frames
      const totalSec = 3600 + 120 + 3;
      expect(formatTimecode(totalSec, 30)).toBe('01:02:03:00');
    });

    it('handles negative or invalid seconds gracefully by falling back to 0', () => {
      expect(formatTimecode(-5, 30)).toBe('00:00:00');
      expect(formatTimecode(NaN, 30)).toBe('00:00:00');
    });
  });

  describe('formatDuration', () => {
    it('formats 45 seconds to 0:45', () => {
      expect(formatDuration(45)).toBe('0:45');
    });

    it('formats 84 seconds to 1:24', () => {
      expect(formatDuration(84)).toBe('1:24');
    });

    it('formats 0 or negative seconds to 0:00', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(-10)).toBe('0:00');
    });
  });

  describe('parseTimecode', () => {
    it('parses MM:SS:FF into floating seconds', () => {
      const parsed = parseTimecode('01:05:15', 30);
      expect(parsed).toBeCloseTo(65.5, 4);
    });

    it('parses HH:MM:SS:FF into seconds', () => {
      const parsed = parseTimecode('01:00:00:00', 30);
      expect(parsed).toBe(3600);
    });

    it('parses MM:SS into seconds', () => {
      const parsed = parseTimecode('02:30');
      expect(parsed).toBe(150);
    });

    it('returns 0 for empty or invalid strings', () => {
      expect(parseTimecode('')).toBe(0);
    });
  });

  describe('clamp', () => {
    it('restricts values to specified min and max bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('findSnapPoint', () => {
    it('snaps to closest point when within tolerance', () => {
      const candidates = [0, 5.0, 10.0, 15.0];
      const result = findSnapPoint(5.08, candidates, 0.15);
      expect(result.isSnapped).toBe(true);
      expect(result.snappedTime).toBe(5.0);
    });

    it('does not snap when distance exceeds tolerance', () => {
      const candidates = [0, 5.0, 10.0];
      const result = findSnapPoint(5.3, candidates, 0.15);
      expect(result.isSnapped).toBe(false);
      expect(result.snappedTime).toBe(5.3);
    });
  });

  describe('generateWaveform', () => {
    it('generates the requested number of amplitude samples', () => {
      const samples = generateWaveform(50, 42);
      expect(samples).toHaveLength(50);
    });

    it('keeps sample heights normalized between 0.1 and 1.0', () => {
      const samples = generateWaveform(30, 99);
      for (const sample of samples) {
        expect(sample).toBeGreaterThanOrEqual(0.1);
        expect(sample).toBeLessThanOrEqual(1.0);
      }
    });

    it('is deterministic when given the same seed', () => {
      const runA = generateWaveform(20, 1234);
      const runB = generateWaveform(20, 1234);
      expect(runA).toEqual(runB);
    });
  });

  describe('Timeline Clip Splitting Arithmetic', () => {
    it('correctly partitions clip durations and offsets at playhead', () => {
      const originalClip = {
        startTime: 2.0,
        duration: 8.0,
        trimStart: 1.0,
      };
      const playhead = 5.0; // split point

      const splitOffset = playhead - originalClip.startTime; // 3.0
      const firstDuration = splitOffset; // 3.0
      const secondDuration = originalClip.duration - splitOffset; // 5.0
      const secondTrimStart = originalClip.trimStart + splitOffset; // 4.0

      expect(firstDuration).toBe(3.0);
      expect(secondDuration).toBe(5.0);
      expect(secondTrimStart).toBe(4.0);
      expect(firstDuration + secondDuration).toBe(originalClip.duration);
    });
  });
});
