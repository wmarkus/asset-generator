import { useCallback, useRef } from 'react';
import type { AssetType, AssetDimensions } from '@/types';
import { ASSET_DIMENSIONS } from '@/types';

export function useExportImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const exportAsImage = useCallback(
    async (
      canvasElement: HTMLCanvasElement | null,
      assetType: AssetType,
      filename?: string
    ) => {
      if (!canvasElement) {
        console.error('Canvas element not found');
        return;
      }

      const dimensions: AssetDimensions = ASSET_DIMENSIONS[assetType];
      const defaultFilename =
        assetType === 'social'
          ? 'github-copilot-social-card.png'
          : 'github-copilot-header.png';

      try {
        // Create a temporary canvas at full resolution
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = dimensions.width;
        exportCanvas.height = dimensions.height;
        const ctx = exportCanvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Draw the source canvas onto the export canvas
        ctx.drawImage(
          canvasElement,
          0,
          0,
          dimensions.width,
          dimensions.height
        );

        // Convert to blob and download
        exportCanvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = filename || defaultFilename;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          },
          'image/png',
          1.0
        );
      } catch (error) {
        console.error('Error exporting image:', error);
      }
    },
    []
  );

  return {
    canvasRef,
    exportAsImage,
  };
}
