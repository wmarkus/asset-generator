import { useState, useEffect } from 'react';

interface ImageCache {
  [key: string]: HTMLImageElement;
}

const imageCache: ImageCache = {};

export function useImageLoader(src: string): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(
    imageCache[src] || null
  );

  useEffect(() => {
    if (imageCache[src]) {
      setImage(imageCache[src]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache[src] = img;
      setImage(img);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
    };
    img.src = src;
  }, [src]);

  return image;
}

export function useMultipleImages(
  srcs: string[]
): Record<string, HTMLImageElement | null> {
  const [images, setImages] = useState<Record<string, HTMLImageElement | null>>(
    () => {
      const initial: Record<string, HTMLImageElement | null> = {};
      srcs.forEach((src) => {
        initial[src] = imageCache[src] || null;
      });
      return initial;
    }
  );

  useEffect(() => {
    let mounted = true;

    srcs.forEach((src) => {
      if (imageCache[src]) {
        setImages((prev) => ({ ...prev, [src]: imageCache[src] }));
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCache[src] = img;
        if (mounted) {
          setImages((prev) => ({ ...prev, [src]: img }));
        }
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };
      img.src = src;
    });

    return () => {
      mounted = false;
    };
  }, [srcs.join(',')]);

  return images;
}

export function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          if (imageCache[src]) {
            resolve(imageCache[src]);
            return;
          }

          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            imageCache[src] = img;
            resolve(img);
          };
          img.onerror = reject;
          img.src = src;
        })
    )
  );
}
