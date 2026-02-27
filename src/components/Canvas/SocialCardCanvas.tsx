import { useRef, useEffect, useMemo } from 'react';
import type { AssetConfig, FocusedField } from '@/types';
import { ASSET_DIMENSIONS } from '@/types';
import { useMultipleImages } from '@/hooks/useImageLoader';
import {
  getSocialCardImageSources,
  renderSocialCardStatic,
} from '@/lib/socialCardLayers';

interface SocialCardCanvasProps {
  config: AssetConfig;
  zoom: number;
  panX: number;
  panY: number;
  focusedField: FocusedField;
}

export function SocialCardCanvas({
  config,
  zoom,
  panX,
  panY,
  focusedField,
}: SocialCardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimensions = ASSET_DIMENSIONS.social;

  const imageSources = useMemo(
    () => getSocialCardImageSources(config),
    [
      config.backgroundSource,
      config.customBackgroundUrl,
      config.heroModel1.provider,
      config.heroModel2.provider,
      config.heroModel3.provider,
      config.otherModel1.provider,
      config.otherModel2.provider,
      config.productType,
      config.heroCount,
    ],
  );

  const images = useMultipleImages(imageSources);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderSocialCardStatic(ctx, config, images, focusedField);
  }, [config, dimensions, images, focusedField]);

  return (
    <div
      className="relative"
      style={{
        transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
        transformOrigin: 'center center',
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="shadow-2xl rounded-lg"
        id="social-card-canvas"
      />
    </div>
  );
}
