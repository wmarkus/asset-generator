import type { AssetConfig } from '@/types';
import { ASSET_DIMENSIONS } from '@/types';
import type { AnimationParams } from './socialCardLayers';
import {
  drawBackground,
  drawProductBadge,
  drawBadgeAndHeadline,
  drawModelOverlay,
  drawCursor,
} from './socialCardLayers';

// Easing function: ease-out cubic
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Animation timeline keyframes (in seconds)
const TIMELINE = {
  // Layer 1: Background is fully visible from frame 1
  // Layer 2: Product logo slide in from left
  productStart: 0.4,
  productEnd: 1.2,
  // Layer 3: Badge + headline fade up
  headlineStart: 1.4,
  headlineEnd: 2.2,
  // Layer 4: Model overlay slide in from right
  overlayStart: 2.4,
  overlayEnd: 3.2,
  // Layer 5: Cursor appears
  cursorStart: 3.4,
  cursorEnd: 4.2,
  // Hold on final frame
  holdUntil: 8.0,
} as const;

function getProgress(time: number, start: number, end: number): number {
  if (time <= start) return 0;
  if (time >= end) return 1;
  return easeOutCubic((time - start) / (end - start));
}

export interface FrameParams {
  background: AnimationParams;
  product: AnimationParams;
  headline: AnimationParams;
  overlay: AnimationParams;
  cursor: AnimationParams;
}

export function getFrameParams(time: number): FrameParams {
  const productP = getProgress(time, TIMELINE.productStart, TIMELINE.productEnd);
  const headlineP = getProgress(time, TIMELINE.headlineStart, TIMELINE.headlineEnd);
  const overlayP = getProgress(time, TIMELINE.overlayStart, TIMELINE.overlayEnd);
  const cursorP = getProgress(time, TIMELINE.cursorStart, TIMELINE.cursorEnd);

  return {
    background: { opacity: 1, offsetX: 0, offsetY: 0 },
    product: { opacity: productP, offsetX: (1 - productP) * -80, offsetY: 0 },
    headline: { opacity: headlineP, offsetX: 0, offsetY: (1 - headlineP) * 40 },
    overlay: { opacity: overlayP, offsetX: (1 - overlayP) * 200, offsetY: 0 },
    cursor: { opacity: cursorP, offsetX: (1 - cursorP) * 100, offsetY: (1 - cursorP) * 50 },
  };
}

export function renderAnimatedFrame(
  ctx: CanvasRenderingContext2D,
  config: AssetConfig,
  images: Record<string, HTMLImageElement | null>,
  time: number,
) {
  const dimensions = ASSET_DIMENSIONS.social;
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  // Fill black background so partially-transparent layers look correct
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);

  const params = getFrameParams(time);

  drawBackground(ctx, config, images, params.background);

  if (time < TIMELINE.productStart) {
    return;
  }

  // Hard-gate layer rendering by timeline so frame 1 stays background-only.
  drawProductBadge(ctx, config, images, params.product);
  if (time >= TIMELINE.headlineStart) {
    drawBadgeAndHeadline(ctx, config, params.headline);
  }
  if (time >= TIMELINE.overlayStart) {
    drawModelOverlay(ctx, config, images, params.overlay);
  }
  if (time >= TIMELINE.cursorStart) {
    drawCursor(ctx, config, images, params.cursor);
  }
}

export const TOTAL_DURATION = TIMELINE.holdUntil;
export const FPS = 30;
export const TOTAL_FRAMES = Math.ceil(TOTAL_DURATION * FPS);
