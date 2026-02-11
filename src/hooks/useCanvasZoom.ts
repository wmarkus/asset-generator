import { useState, useCallback, useEffect, useRef, type MouseEvent } from 'react';
import type { CanvasState } from '@/types';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_SENSITIVITY = 0.001;

export function useCanvasZoom(initialZoom = 0.3) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: initialZoom,
    panX: 0,
    panY: 0,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Use native event listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * ZOOM_SENSITIVITY;
      setCanvasState((prev) => ({
        ...prev,
        zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.zoom + delta)),
      }));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        setCanvasState((prev) => ({
          ...prev,
          panX: prev.panX + deltaX,
          panY: prev.panY + deltaY,
        }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
      }
    },
    [isPanning, lastMousePos]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetView = useCallback(() => {
    setCanvasState({
      zoom: initialZoom,
      panX: 0,
      panY: 0,
    });
  }, [initialZoom]);

  const zoomIn = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.min(MAX_ZOOM, prev.zoom + 0.1),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.max(MIN_ZOOM, prev.zoom - 0.1),
    }));
  }, []);

  return {
    canvasState,
    isPanning,
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
    zoomIn,
    zoomOut,
  };
}
