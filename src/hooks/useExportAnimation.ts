import { useCallback, useRef, useState } from 'react';
import { canRenderMediaOnWeb, renderMediaOnWeb, type WebRendererContainer } from '@remotion/web-renderer';
import type { AssetConfig } from '@/types';
import { ASSET_DIMENSIONS } from '@/types';
import { FPS, TOTAL_FRAMES } from '@/lib/animationEngine';
import { SocialCardRemotionComposition } from '@/lib/remotion/SocialCardRemotionComposition';

type ExportFormat = 'mp4' | 'webm' | 'both';
type ExportStatus = 'idle' | 'rendering' | 'encoding' | 'done' | 'error';

interface ExportState {
  status: ExportStatus;
  progress: number; // 0-100
  message: string;
  mp4Url?: string;
  webmUrl?: string;
  error?: string;
}

const dimensions = ASSET_DIMENSIONS.social;

function getProgress(renderedFrames: number, encodedFrames: number): number {
  return Math.min(1, Math.max(renderedFrames, encodedFrames) / TOTAL_FRAMES);
}

export function useExportAnimation() {
  const [state, setState] = useState<ExportState>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const abortRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const renderWithRemotion = useCallback(
    async (config: AssetConfig, container: WebRendererContainer, progressStart: number, progressEnd: number) => {
      const support = await canRenderMediaOnWeb({
        container,
        width: dimensions.width,
        height: dimensions.height,
        muted: true,
      });

      if (!support.canRender) {
        const issueSummary = support.issues
          .filter((issue) => issue.severity === 'error')
          .map((issue) => issue.message)
          .join(' ');
        throw new Error(issueSummary || `${container.toUpperCase()} export is not supported in this browser.`);
      }

      const result = await renderMediaOnWeb({
        composition: {
          id: `social-card-${container}`,
          component: SocialCardRemotionComposition,
          width: dimensions.width,
          height: dimensions.height,
          fps: FPS,
          durationInFrames: TOTAL_FRAMES,
          defaultProps: { config },
        },
        inputProps: { config },
        container,
        muted: true,
        signal: abortControllerRef.current?.signal ?? null,
        onProgress: ({ renderedFrames, encodedFrames }) => {
          const frameProgress = getProgress(renderedFrames, encodedFrames);
          const progress = progressStart + frameProgress * (progressEnd - progressStart);

          setState({
            status: 'encoding',
            progress,
            message: `Encoding ${container.toUpperCase()} with Remotion...`,
          });
        },
      });

      return result.getBlob();
    },
    [],
  );

  const exportAnimation = useCallback(
    async (config: AssetConfig, format: ExportFormat = 'both') => {
      abortRef.current = false;
      abortControllerRef.current = new AbortController();
      setState({ status: 'rendering', progress: 0, message: 'Preparing Remotion renderer...' });

      try {
        let mp4Url: string | undefined;
        let webmUrl: string | undefined;

        if (format === 'mp4' || format === 'both') {
          const mp4End = format === 'both' ? 50 : 100;
          const mp4Blob = await renderWithRemotion(config, 'mp4', 0, mp4End);
          mp4Url = URL.createObjectURL(mp4Blob);
        }

        if (abortRef.current) {
          throw new Error('Export cancelled');
        }

        if (format === 'webm' || format === 'both') {
          const webmStart = format === 'both' ? 50 : 0;
          const webmBlob = await renderWithRemotion(config, 'webm', webmStart, 100);
          webmUrl = URL.createObjectURL(webmBlob);
        }

        setState({
          status: 'done',
          progress: 100,
          message: 'Export complete!',
          mp4Url,
          webmUrl,
        });
      } catch (err) {
        const isAbortError =
          abortRef.current || (err instanceof DOMException && err.name === 'AbortError');
        const message = isAbortError
          ? 'Export cancelled'
          : err instanceof Error
            ? err.message
            : 'Export failed';
        setState({ status: 'error', progress: 0, message, error: message });
      } finally {
        abortControllerRef.current = null;
      }
    },
    [renderWithRemotion],
  );

  const cancel = useCallback(() => {
    abortRef.current = true;
    abortControllerRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    if (state.mp4Url) URL.revokeObjectURL(state.mp4Url);
    if (state.webmUrl) URL.revokeObjectURL(state.webmUrl);
    setState({ status: 'idle', progress: 0, message: '' });
  }, [state.mp4Url, state.webmUrl]);

  const download = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { state, exportAnimation, cancel, reset, download };
}
