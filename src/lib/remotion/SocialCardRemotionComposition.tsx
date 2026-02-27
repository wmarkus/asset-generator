import { useEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame } from 'remotion';
import type { AssetConfig } from '@/types';
import { ASSET_DIMENSIONS } from '@/types';
import { FPS, renderAnimatedFrame } from '@/lib/animationEngine';
import { getSocialCardImageSources } from '@/lib/socialCardLayers';

interface SocialCardRemotionCompositionProps {
  config: AssetConfig;
}

async function loadImages(sources: string[]): Promise<Record<string, HTMLImageElement | null>> {
  const entries = await Promise.all(
    sources.map(
      (src) =>
        new Promise<[string, HTMLImageElement | null]>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve([src, img]);
          img.onerror = () => resolve([src, null]);
          img.src = src;
        }),
    ),
  );

  return Object.fromEntries(entries);
}

export function SocialCardRemotionComposition({ config }: SocialCardRemotionCompositionProps) {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<Record<string, HTMLImageElement | null> | null>(null);
  const [handle] = useState(() => delayRender('Loading social card assets'));
  const imageSources = useMemo(() => getSocialCardImageSources(config), [config]);

  useEffect(() => {
    let cancelled = false;

    loadImages(imageSources)
      .then((loaded) => {
        if (cancelled) return;
        setImages(loaded);
        continueRender(handle);
      })
      .catch((error) => {
        if (cancelled) return;
        cancelRender(error);
      });

    return () => {
      cancelled = true;
    };
  }, [handle, imageSources]);

  useEffect(() => {
    if (!images) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      cancelRender(new Error('Unable to initialize canvas context for Remotion composition.'));
      return;
    }

    const time = frame / FPS;
    renderAnimatedFrame(ctx, config, images, time);
  }, [config, frame, images]);

  const dimensions = ASSET_DIMENSIONS.social;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1117' }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ width: '100%', height: '100%' }}
      />
    </AbsoluteFill>
  );
}
