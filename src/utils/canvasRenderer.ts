import { TimelineTrack, ResolutionConfig, ClipItem } from '../types/timeline';

// Cache for loaded media elements
const imageCache = new Map<string, HTMLImageElement>();
const videoCache = new Map<string, HTMLVideoElement>();

/**
 * Compositor that renders a real-time frame onto HTML5 Canvas
 */
export function renderPreviewFrame(
  canvas: HTMLCanvasElement,
  currentTime: number,
  tracks: TimelineTrack[],
  resolution: ResolutionConfig,
  options?: {
    showSafeAreas?: boolean;
    showRuleOfThirds?: boolean;
    selectedClipId?: string | null;
  }
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = resolution;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  // 1. Clear with studio background
  ctx.save();
  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, width, height);

  // 2. Render each visible track from back to front
  // Order: Visuals -> Overlays -> Effects -> Captions
  const trackOrder = ['visuals', 'overlays', 'effects', 'captions'];
  const sortedTracks = [...tracks].sort((a, b) => {
    return trackOrder.indexOf(a.type) - trackOrder.indexOf(b.type);
  });

  for (const track of sortedTracks) {
    if (track.isHidden) continue;

    // Find active clips on this track at currentTime
    const activeClips = track.clips.filter(
      (clip) => currentTime >= clip.startTime && currentTime <= clip.startTime + clip.duration
    );

    for (const clip of activeClips) {
      if (clip.type === 'video' || clip.type === 'image') {
        renderVisualClip(ctx, clip, currentTime, width, height);
      } else if (clip.type === 'caption') {
        renderCaptionClip(ctx, clip, width, height);
      }
    }
  }

  // 3. Optional Safe Area Guides & Rule of Thirds
  if (options?.showSafeAreas) {
    drawSafeAreas(ctx, width, height);
  }
  if (options?.showRuleOfThirds) {
    drawRuleOfThirds(ctx, width, height);
  }

  ctx.restore();
}

/**
 * Render visual (video or image) clip with transforms & filters
 */
function renderVisualClip(
  ctx: CanvasRenderingContext2D,
  clip: ClipItem,
  currentTime: number,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.save();

  const visualProps = clip.visualProps || {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 1,
    fit: 'contain',
  };

  const filters = clip.filters || {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    invert: 0,
  };

  // Apply CSS filters string to 2D context
  ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) hue-rotate(${filters.hueRotate}deg) invert(${filters.invert}%)`;
  ctx.globalAlpha = Math.max(0, Math.min(1, visualProps.opacity));

  // Center coordinates with normalized visualProps.x / y
  const centerX = canvasWidth / 2 + (visualProps.x / 100) * (canvasWidth / 2);
  const centerY = canvasHeight / 2 + (visualProps.y / 100) * (canvasHeight / 2);

  ctx.translate(centerX, centerY);
  ctx.rotate((visualProps.rotation * Math.PI) / 180);
  ctx.scale(visualProps.scale, visualProps.scale);

  // Check if we have a preloaded image or SVG sourceUrl
  const source = clip.sourceUrl;
  let imageElement = imageCache.get(source);

  if (!imageElement && source && (source.startsWith('data:image') || source.endsWith('.jpg') || source.endsWith('.png') || source.endsWith('.svg'))) {
    imageElement = new Image();
    imageElement.src = source;
    imageCache.set(source, imageElement);
  }

  if (imageElement && imageElement.complete && imageElement.naturalWidth > 0) {
    // Render real image with fit
    const imgW = imageElement.naturalWidth;
    const imgH = imageElement.naturalHeight;
    const { drawW, drawH } = calculateFit(imgW, imgH, canvasWidth, canvasHeight, visualProps.fit);

    ctx.drawImage(imageElement, -drawW / 2, -drawH / 2, drawW, drawH);
  } else {
    // High-fidelity animated canvas simulation fallback so preview is always alive
    renderDynamicProceduralVisual(ctx, clip, currentTime, canvasWidth, canvasHeight);
  }

  ctx.restore();
}

/**
 * Procedural dynamic rendering for video clips without external video loading lag
 */
function renderDynamicProceduralVisual(
  ctx: CanvasRenderingContext2D,
  clip: ClipItem,
  currentTime: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const w = canvasWidth;
  const h = canvasHeight;
  const localTime = currentTime - clip.startTime;

  // Base dynamic cinematic gradient
  const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  if (clip.name.includes('Metropolis') || clip.color === '#3b82f6') {
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(0.5, '#4338ca');
    grad.addColorStop(1, '#06b6d4');
  } else if (clip.name.includes('Aurora') || clip.color === '#06b6d4') {
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.6, '#047857');
    grad.addColorStop(1, '#0f172a');
  } else {
    grad.addColorStop(0, '#311042');
    grad.addColorStop(0.5, '#7e22ce');
    grad.addColorStop(1, '#ec4899');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Animated elements based on local time
  const phase = (localTime * 1.5) % (Math.PI * 2);
  const orbY = Math.sin(phase) * (h * 0.12);
  const orbRadius = 70 + Math.cos(phase * 2) * 12;

  // Ambient light orb
  const orbGrad = ctx.createRadialGradient(0, orbY, 10, 0, orbY, orbRadius * 2);
  orbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  orbGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(0, orbY, orbRadius * 2, 0, Math.PI * 2);
  ctx.fill();

  // Subtle grid overlay for high-tech aesthetic
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  const step = 60;
  for (let x = -w / 2; x <= w / 2; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, -h / 2);
    ctx.lineTo(x, h / 2);
    ctx.stroke();
  }
  for (let y = -h / 2; y <= h / 2; y += step) {
    ctx.beginPath();
    ctx.moveTo(-w / 2, y);
    ctx.lineTo(w / 2, y);
    ctx.stroke();
  }

  // Clip title badge inside procedural visual
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(clip.name, 0, h * 0.28);
}

/**
 * Render timed subtitle / caption overlay
 */
function renderCaptionClip(
  ctx: CanvasRenderingContext2D,
  clip: ClipItem,
  canvasWidth: number,
  canvasHeight: number
) {
  const cap = clip.captionProps;
  if (!cap || !cap.text) return;

  ctx.save();

  const fontSize = cap.fontSize || 32;
  const fontFamily = cap.fontFamily || 'Plus Jakarta Sans';
  const fontWeight = cap.fontWeight || '700';

  ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textMetrics = ctx.measureText(cap.text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize * 1.25;

  let posY = canvasHeight * 0.86; // bottom
  if (cap.position === 'top') {
    posY = canvasHeight * 0.14;
  } else if (cap.position === 'center') {
    posY = canvasHeight * 0.5;
  }

  const posX = canvasWidth / 2;

  // Background box
  if (cap.backgroundColor && cap.backgroundColor !== 'transparent') {
    const padX = 24;
    const padY = 10;
    ctx.fillStyle = cap.backgroundColor;
    roundRect(
      ctx,
      posX - textWidth / 2 - padX,
      posY - textHeight / 2 - padY,
      textWidth + padX * 2,
      textHeight + padY * 2,
      8
    );
    ctx.fill();
  }

  // Text shadow for legibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = cap.color || '#ffffff';
  ctx.fillText(cap.text, posX, posY);

  ctx.restore();
}

/**
 * Utility to calculate contain / cover / fill dimensions
 */
function calculateFit(
  srcW: number,
  srcH: number,
  targetW: number,
  targetH: number,
  fit: 'contain' | 'cover' | 'fill'
) {
  if (fit === 'fill') {
    return { drawW: targetW, drawH: targetH };
  }

  const srcRatio = srcW / srcH;
  const targetRatio = targetW / targetH;

  if (fit === 'contain') {
    if (srcRatio > targetRatio) {
      return { drawW: targetW, drawH: targetW / srcRatio };
    } else {
      return { drawW: targetH * srcRatio, drawH: targetH };
    }
  } else {
    // cover
    if (srcRatio > targetRatio) {
      return { drawW: targetH * srcRatio, drawH: targetH };
    } else {
      return { drawW: targetW, drawH: targetW / srcRatio };
    }
  }
}

/**
 * Draws rounded rectangle path on canvas
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Safe action & title zones (90% & 80%)
 */
function drawSafeAreas(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'; // cyan
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);

  // 90% Action Safe
  const actX = width * 0.05;
  const actY = height * 0.05;
  const actW = width * 0.9;
  const actH = height * 0.9;
  ctx.strokeRect(actX, actY, actW, actH);

  // 80% Title Safe
  const titX = width * 0.1;
  const titY = height * 0.1;
  const titW = width * 0.8;
  const titH = height * 0.8;
  ctx.strokeRect(titX, titY, titW, titH);

  ctx.restore();
}

/**
 * Rule of thirds grid lines
 */
function drawRuleOfThirds(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;

  // Verticals
  ctx.beginPath();
  ctx.moveTo(width / 3, 0);
  ctx.lineTo(width / 3, height);
  ctx.moveTo((width * 2) / 3, 0);
  ctx.lineTo((width * 2) / 3, height);

  // Horizontals
  ctx.moveTo(0, height / 3);
  ctx.lineTo(width, height / 3);
  ctx.moveTo(0, (height * 2) / 3);
  ctx.lineTo(width, (height * 2) / 3);
  ctx.stroke();

  ctx.restore();
}
