import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
}: CanvasControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-neutral-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-neutral-700">
      <Button variant="ghost" size="icon" onClick={onZoomOut} title="Zoom Out" className="text-white hover:text-white hover:bg-neutral-700">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-sm font-mono w-14 text-center text-white">
        {Math.round(zoom * 100)}%
      </span>
      <Button variant="ghost" size="icon" onClick={onZoomIn} title="Zoom In" className="text-white hover:text-white hover:bg-neutral-700">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-neutral-600 mx-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={onResetView}
        title="Reset View"
        className="text-white hover:text-white hover:bg-neutral-700"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
